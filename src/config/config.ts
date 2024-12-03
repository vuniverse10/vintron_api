import dotenv from "dotenv";

dotenv.config();

const MONGO_OPTIONS = {};

const MONGO_USERNAME = process.env.MONGO_USERNAME || "MONGO_USER";
const MONGO_PASSWORD = process.env.MONGO_USERNAME || "MONGO_PASS";
const MONGO_HOST = process.env.MONGO_URL || `CLUSTERPATH`;

const MONGO = {
  /*host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    
    url: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`*/
  options: MONGO_OPTIONS,
  url: `mongodb+srv://vintronfuturetechnologies:LGCppwg4csFjLcRb@cluster0.yt86g.mongodb.net/userDB?retryWrites=true&w=majority`,
};

const SERVER_HOSTNAME = "cluster0.yt86g.mongodb.ne";
const SERVER_PORT = process.env.SERVER_PORT || 27017;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER =
  process.env.SERVER_TOKEN_ISSUER || "VINTRON_TOKEN_RANDOM";
const SERVER_TOKEN_SECRET =
  process.env.SERVER_TOKEN_SECRET ||
  "EgZjaHJvbWUqEggAEAAYQxiDARixAxiABBiKBTISCAAQABhDGIMBGLEDGIAEGIoFMhIIARAuGEMY1AIYsQMYgAQYigUyDAgCEAAYQxiABBiKBTISCAMQABhDGIMBGLEDGIAEGIoFMgwIBBAAGEMYgAQYigUyDAgFEAAYQxiABBiKBTIKCAYQLhixAxiABDIMCAcQABhDGIAEGIoFMgwICBAAGEMYgAQYigUyBwgJEAAYjwLSAQkzOTQ4MWowajeoAgCwAgA";

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
  token: {
    expireTime: SERVER_TOKEN_EXPIRETIME,
    issuer: SERVER_TOKEN_ISSUER,
    secret: SERVER_TOKEN_SECRET,
  },
};

const config = {
  mongo: MONGO,
  server: SERVER,
};
export default config;
