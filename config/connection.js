import fetch from 'isomorphic-fetch';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost';

class Connection {
  get(path) {
    return fetch(`${HOST}:${PORT}${path}`);
  }

  post(path, data) {
    return fetch(`${HOST}:${PORT}${path}`, data);
  }
}

const connection = new Connection();

export default connection;
