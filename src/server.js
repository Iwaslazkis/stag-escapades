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
  const cookies = parseCookies(req.headers.cookie);
  let noCookies = Object.entries(cookies);
  if (noCookies.length === 1) {
    noCookies = (noCookies[0][0] === '' && noCookies[0][0] === noCookies[0][1]) ? true : false;
  };
  console.log(noCookies ? "" : `\x1b[35m${cookies.session}:`,
              "\x1b[32m" + req.url,
              "\x1b[36m" + formattedDate(),
              "\x1b[0m");
  console.log({ cookies: cookies, request: req });
  console.log({ sessions: sessions, "wss.clients": wss.clients });
  next();
});

// Game Start Form Handler
app.post("/", (req, res) => {
  const expires = new Date();
  expires.setHours(expires.getHours() + 2);

  console.log(`\x1b[35m Room ${encodeURIComponent(req.body["room"])} started a game!`);
  res.writeHead(302, {
    Location: '/game',
    'Set-Cookie': `session=${encodeURIComponent(req.body["room"])};Expires=${expires.toGMTString()};`
  });
  res.end();
});

// Static files
app.use(express.static('public'));

const server = app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}/`);
});

//WebSocket Server
wss.on('connection',(socket, req) => {
  const cookie = parseCookies(req.headers.cookie).session;
  sessions.push({
    session: cookie,
    socket: socket
  });

  //Logging
  console.log("\x1b[33m" + cookie + " connected a WS on:",
              "\x1b[32m" + req.url,
              "\x1b[36m" + formattedDate(),
              "\x1b[0m");
  console.log({ request: req, socket: socket });
  console.log({ sessions: sessions, "wss.clients": wss.clients });


  socket.on('message', message => {
    // Logging
    console.log(`\x1b[33m${cookie} sent: \x1b[31m${message}\x1b[0m`);

    socket.send(`You sent ${message}`);
  })
});

server.on('upgrade', (req, socket, head) => {
  //const pathname;
  wss.handleUpgrade(req, socket, head, socket => {
    wss.emit('connection', socket, req);
  });
});
