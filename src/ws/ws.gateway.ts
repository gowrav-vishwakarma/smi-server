import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
import {
  User,
  UserDocument,
  UserOnlineStatus,
} from '../api/schemas/user.schema';

@WebSocketGateway({ cors: true })
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectModel(SolutionAttempted.name)
    private readonly solutionAttemptedModel: Model<SolutionAttemptedDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private logger: Logger = new Logger('WsGateway');
  private connectedClients = new Map<string, Socket>();

  @WebSocketServer() server: Socket;

  afterInit(server: Socket) {
    this.logger.log('WS Initialized');
  }

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    this.logger.log(`WS Client connected: ${client.id}`);
    client.join(client.handshake.auth.username);
    this.connectedClients.set(client.id, client);
    this.logger.log(
      `WS Client connected username: ${client.handshake.auth.username}`,
      this.connectedClients[client.handshake.auth.username],
    );
    // update user status online
    // await this.userModel
    //   .updateOne(
    //     {
    //       _id: new Types.ObjectId(client.handshake.auth.username),
    //     },
    //     {
    //       onlineStatus: UserOnlineStatus.ONLINE,
    //     },
    //   )
    //   .catch((err) => {
    //     this.logger.error('Error while updating user status', err);
    //   });
    client.emit('session', {
      username: client.handshake.auth.username,
    });
  }

  async handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    // update user status offline
    await this.userModel
      .updateOne(
        {
          _id: new Types.ObjectId(client.handshake.auth.username),
        },
        {
          onlineStatus: UserOnlineStatus.OFFLINE,
        },
      )
      .catch((err) => {
        this.logger.error('Error while updating user status', err);
      });

    this.logger.log(
      'Client disconnected:',
      client.id,
      this.connectedClients.get(client.id),
    );
  }

  getClientById(clientId: string): Socket | undefined {
    return this.connectedClients.get(clientId);
  }

  // here userId= SMI User Model ID
  // and client = socket client
  getConnectedClientIdByUserId(userIds?: string[]): string[] {
    if (userIds) {
      return Array.from(this.connectedClients.values())
        .filter((client) => {
          this.logger.log(
            'checking for user ',
            client.handshake.auth.username,
            userIds.includes(client.handshake.auth.username),
          );
          return userIds.includes(client.handshake.auth.username);
        })
        .map((client) => client.handshake.auth.username);
    }
    return [];
  }

  // getClientByUserId(clientId: string): Socket | undefined {
  //   return this.connectedClients.get(clientId);
  // }

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
    this.logger.log('server Call Accepted', payload);
    await this.solutionAttemptedModel.updateOne(
      {
        _id: payload.solutionOfferId,
      },
      {
        status: 'ACCEPTED',
      },
    );

    // update user status
    await this.userModel.updateMany(
      {
        _id: { $in: [payload.to, payload.from] },
      },
      {
        onlineStatus: 'BUSY',
      },
    );
    this.server.to(payload.to).emit('callAccepted', payload);
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

  // @SubscribeMessage('RtcOffer')
  // handleRtcOffer(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: any,
  // ): void {
  //   console.log('RtcOffer', payload);
  //   payload.connectionId = client.id;
  //   this.server.to(payload.to).emit('RtcOffer', payload);
  // }

  // @SubscribeMessage('RtcAnswer')
  // handleRtcAnswerData(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: any,
  // ): void {
  //   payload.connectionId = client.id;
  //   console.log('RTC Answer', payload);
  //   this.server.to(payload.to).emit('RtcAnswer', payload);
  // }

  // @SubscribeMessage('RtcCandidate')
  // handleRtcCandidateData(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: any,
  // ): void {
  //   console.log('Rtccandidate', payload);
  //   this.server.to(payload.to).emit('RtcCandidate', client.id, payload);
  // }

  // @SubscribeMessage('RtcDisconnect')
  // handleRtcDisconnectData(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: any,
  // ): void {
  //   console.log('RtcDisconnect', payload);
  //   this.server.to(payload.to).emit('RtcDisconnect', client.id, payload);
  // }

  // @SubscribeMessage('RtcStream')
  // handleRtcStreamData(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: any,
  // ): void {
  //   console.log('RtcStream', payload);
  //   // this.server.to(payload.to).emit('RtcDisconnect', client.id, payload);
  // }

  @SubscribeMessage('checkUserConnected')
  handleCheckUserConnected(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      userId: string[];
      questionId: string;
    },
  ) {
    if (payload && payload.userId.length) {
      let onlineUser = this.getConnectedClientIdByUserId(payload.userId);
      if (onlineUser.length) {
        this.server.to(client.id).emit('checkedUserConnected', {
          questionId: payload.questionId,
          onlineUserIds: onlineUser,
        });

        // this.server.to(payload.to).emit('RtcAnswer', payload);
      }
    }
  }

  @SubscribeMessage('OfferPlaced')
  async handleOfferPlaced(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<any> {
    this.logger.log('OfferPlaced', payload);
    // todo check if user is online
    let onlineUser = this.getConnectedClientIdByUserId([payload.to]);
    if (onlineUser.length) {
      this.server.to(onlineUser[0]).emit('OfferPlaced', payload);
    }
  }

  async questionAskedTo(
    id: string,
    askedBy: { name: string; title: string; topic: string; questionId: string },
  ) {
    let onlineUser = this.getConnectedClientIdByUserId([id]);
    if (onlineUser.length) {
      this.server.to(onlineUser[0]).emit('questionAskedTo', askedBy);
    }
  }
}
