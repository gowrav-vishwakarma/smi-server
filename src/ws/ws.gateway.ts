import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import {
  SolutionAttempted,
  SolutionAttemptedDocument,
  SolutionAttemptedStatus,
} from '../api/schemas/solutionattempted.schema';

@WebSocketGateway({ cors: true })
export class WsGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(
    @InjectModel(SolutionAttempted.name)
    private readonly solutionAttemptedModel: Model<SolutionAttemptedDocument>,
  ) {}

  private logger: Logger = new Logger('WsGateway');

  @WebSocketServer() server: Socket;

  afterInit(server: any) {
    this.logger.log('WS Initialized');
  }

  handleConnection(@ConnectedSocket() client: Socket): void {
    this.logger.log(`WS Client connected: ${client.id}`);
    client.join(client.handshake.auth.username);
    this.logger.log(
      `WS Client connected username: ${client.handshake.auth.username}`,
    );
    client.emit('session', {
      username: client.handshake.auth.username,
    });
  }

  @SubscribeMessage('initiateCall')
  handleInitiateCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {
    this.server.to(payload.to).emit('ringing', payload);
  }

  @SubscribeMessage('acceptCall')
  async handleAcceptCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<any> {
    console.log('server Call Accepted', payload);
    this.server.to(payload.to).emit('callAccepted', payload);

    await this.solutionAttemptedModel.updateOne(
      {
        _id: payload.solutionOfferId,
      },
      {
        status: 'ACCEPTED',
      },
    );

    // todo remove this emit to who accepted the call todo manage at client side
    // this.server.to(payload.from).emit('callAccepted', payload);
  }

  @SubscribeMessage('hangupCall')
  hangupCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {
    console.log('server Call hangup Accepted', payload);

    this.server.to(payload.to).emit('callHanguped', payload);
  }

  @SubscribeMessage('disconnectCall')
  handleDisconnectCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {
    this.server.to(payload.to).emit('callDisconnected', payload);
  }

  @SubscribeMessage('denyCall')
  handleDenyCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {
    this.server.to(payload.to).emit('callDenied', payload);
  }

  @SubscribeMessage('RtcOffer')
  handleRtcOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {
    console.log('RtcOffer', payload);
    payload.connectionId = client.id;
    this.server.to(payload.to).emit('RtcOffer', payload);
  }

  @SubscribeMessage('RtcAnswer')
  handleRtcAnswerData(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {
    payload.connectionId = client.id;
    console.log('RTC Answer', payload);
    this.server.to(payload.to).emit('RtcAnswer', payload);
  }

  @SubscribeMessage('RtcCandidate')
  handleRtcCandidateData(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {
    console.log('Rtccandidate', payload);
    this.server.to(payload.to).emit('RtcCandidate', client.id, payload);
  }

  @SubscribeMessage('RtcDisconnect')
  handleRtcDisconnectData(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {
    console.log('RtcDisconnect', payload);
    this.server.to(payload.to).emit('RtcDisconnect', client.id, payload);
  }

  @SubscribeMessage('RtcStream')
  handleRtcStreamData(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): void {
    console.log('RtcStream', payload);
    // this.server.to(payload.to).emit('RtcDisconnect', client.id, payload);
  }
}
