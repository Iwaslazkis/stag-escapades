import express from 'express';
import WebSocket from "ws";

const app = express();
const wss = new WebSocket.Server({ noServer: true, path: '/ws' });
const port = +process.env.PORT;
const host = process.env.LOCALIP;
const sessions = [];

// Source: https://medium.com/developers-tomorrow/understanding-how-cookie-and-session-in-javascript-3af858fa8112
function parseCookies (cookie = '') {
  return cookie
  .split(';')
  .map(v => v.split('='))
  .map(([k, ...vs]) => [k, vs.join('=')])
  .reduce((acc, [k, v]) => {
    acc[k.trim()] = decodeURIComponent(v);
    return acc;
  }, {});
};

function formattedDate() {
  const now = new Date();
  const time = now.toTimeString().split(' ');
  const timezone = time[1] === "GMT-0500" ? "CDT" : time.filter((v, i) => i >= 2).join(" ");
  return `${time[0]} ${timezone} ${now.toDateString().substring(4)}`;
};

app.use(express.urlencoded({
  extended: true
}))

// Logging
app.use((req, res, next) => {
  console.log("\x1b[32m" + req.url,
              "\x1b[36m" + formattedDate(),
              "\x1b[0m");
  console.log(parseCookies(req.headers.cookie), req);
  console.log(sessions, wss.clients);
  next();
});

// Game Start Form Handler
app.post("/", (req, res) => {
  const expires = new Date();
  expires.setHours(expires.getHours() + 2);

  console.log(req.body);
  console.log(encodeURIComponent(req.body["room"]));
  res.writeHead(302, {
    Location: '/game',
    'Set-Cookie': `session=${encodeURIComponent(req.body["room"])};Expires=${expires.toGMTString()};`
  });
  res.end();
});

// Static files
app.use(express.static('public'));

const server = app.listen(port, () => {
  console.log(`Listening on http://${host}:${port}/`);
});

//WebSocket Server
wss.on('connection',(socket, req) => {
  const cookie = parseCookies(req.headers.cookie).session;
  //Logging
  console.log("\x1b[33m" + cookie + " connected on:",
              "\x1b[32m" + req.url,
              "\x1b[36m" + formattedDate(),
              "\x1b[0m");
  console.log(req, socket);

  sessions.push({
    session: cookie,
    socket: socket
  });

  socket.on('message', message => {
    console.log(`\x1b[33m${cookie} says: \x1b[31m${message}\x1b[0m`);
    socket.send(`You sent ${message}`);
  })
});

server.on('upgrade', (req, socket, head) => {
  //const pathname;
  wss.handleUpgrade(req, socket, head, socket => {
    wss.emit('connection', socket, req);
  });
});
