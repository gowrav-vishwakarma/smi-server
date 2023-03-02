// create default config file for node-config with mongodb url and port in db key
module.exports = {
  db: {
    url: process.env.MONGOURL || 'mongodb://localhost:27017/smi',
    port: 27017,
  },
};
