import express from 'express';
import WebSocket from "ws";
import fs from "fs";
import qs from "querystring";





//=========MAIN CONSTANTS=========
const host = process.env.LOCALIP;
const port = +process.env.PORT;

const app = express();

const wsServers = [];
const wsHost = createWsServer('/host');
const wsActiveCurious = createWsServer('/ws/ActiveCurious');

// { room: string, expiry: Date, host: WebSocket, phones: WebSocket[] }[]
const sessions = [];





//=========HELPER FUNCTIONS=========
function createWsServer(path) {
  const server = new WebSocket.Server({ noServer: true, path: path });
  wsServers.push({ server: server, path: path });
  return server;
};

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

function bigLog(req, cookOrSocket, mode = 'http') {
  let env = process.env.NODE_ENV;
  if (env !== "production") {env = "development"};
  switch (mode + "_" + env) {
    case "http_production": {
      console.log({ cookies: cookOrSocket, sessions });
      break;
    }
    case "ws_production": {
      console.log({ sessions });
      break;
    }
    case "http_development": {
      console.log({ request: req, cookies: cookOrSocket });
      console.log({ sessions, "ws.clients": wsHost.clients });
      break;
    }
    case "ws_development": {
      console.log({ request: req, socket: cookOrSocket });
      console.log({ sessions, "ws.clients": wsHost.clients });
      break;
    }
  }
};

function dropSession(room) {
  return () => {
    const index = sessions.findIndex(session => session.room === room);
    // Clean up open WS's first
    if (index > -1) {
      sessions.splice(index, 1);
    } else { // Never should run:
      console.log(`\x1b[31m${room} has NO SESSION!!\x1b[0m`)
    }
  };
};

function rejectSuspiciousWs(socket, req, room) {
  const main = () => {
    socket.send(`Room ${room} not logged in.`);
    socket.close();

    console.log("\x1b[33m" + room + " \x1b[31mSUSPICIOUSLY \x1b[33mtried to connect a WS on:",
                "\x1b[32m" + req.url,
                "\x1b[36m" + formattedDate(),
                "\x1b[0m");
    bigLog(req, socket, "ws");
  };

  if (socket.readyState === WebSocket.OPEN) {
    main();
  } else {
    socket.on('open', main);
  };
};





//=========HTTP/EXPRESS=========
// For adding a req.body to POST requests
app.use(express.urlencoded({ extended: true }));

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
  bigLog(req, cookies);
  next();
});

// Game Start Form Handler
app.post("/", (req, res) => {
  if (req.body["room"] === undefined) {
    res.status(404).send("<h1>Nice try, but don't mess with the form code ;)</h1>");
    return;
  };

  const expires = new Date();
  const duration = 2; // in Hours
  expires.setHours(expires.getHours() + duration);
  const currSession = sessions.find(session => session.room === req.body["room"]);
  if (currSession === undefined) {
    sessions.push({
      room: req.body["room"],
      expiry: expires,
      timeoutID: setTimeout(dropSession(req.body["room"]), duration * 1000 * 60 * 60),
      host: undefined,
      phones: []
    });
  } else {
    clearTimeout(currSession.timeoutID);
    currSession.expiry = expires;
    currSession.timeoutID = setTimeout(dropSession(req.body["room"]), duration * 1000 * 60 * 60);
  };

  console.log(`\x1b[35mRoom ${encodeURIComponent(req.body["room"])} started a game!`);
  res.writeHead(302, {
    Location: '/game',
    'Set-Cookie': `session=${encodeURIComponent(req.body["room"])};Expires=${expires.toGMTString()};`
  });
  res.end();
});

// Phone links
app.get('/:room([0-9]+)/:event', (req, res) => {
  const { room, event } = req.params;
  switch (event) {
    case "pot":
    case "chicken":
    case "noodles":
    case "broth":
    case "water": {
      if (sessions.find(session => session.room === room) === undefined) {
        res.status(404).send("<h1>Wait until your class starts the game!</h1>");
        break;
      }

      const expires = new Date();
      expires.setHours(expires.getHours() + 2);

      // res.writeHead(200, {'Set-Cookie': `room=${encodeURIComponent(room)};Expires=${expires.toGMTString()};`});

      fs.readFile("public/activity/activeCurious.html", "utf8", (err, data) => {
        if (err) throw err;
        res.send(data);
      })
      break;
    }
    default: {
      res.status(404).send("<h1>Wrong link!</h1>");
      break;
    }
  }
});

// Redirect if not logged in
app.get('/game', (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const isLoggedIn = sessions.find(session => session.room === cookies.session);
  if (isLoggedIn !== undefined) {
    fs.readFile("public/game.html", "utf8", (err, data) => {
      if (err) throw err;
      res.send(data);
    });
  } else {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
});

// Static files
app.use(express.static('public'));

// Start server
const server = app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}/`);
});





//=========WEBSOCKETS=========
//Host WebSocket Server
wsHost.on('connection', (socket, req) => {
  const cookies = parseCookies(req.headers.cookie);
  const currSession = sessions.find(session => session.room === cookies.session);
  if (currSession === undefined) {
    rejectSuspiciousWs(socket, req, cookies.session);
    return;
  };

  currSession.host = socket;

  //Logging
  console.log("\x1b[33m" + cookies.session + " connected a WS on:",
              "\x1b[32m" + req.url,
              "\x1b[36m" + formattedDate(),
              "\x1b[0m");
  bigLog(req, socket, "ws");


  socket.on('message', message => {
    // Logging
    console.log(`\x1b[33m${cookies.session} sent: \x1b[31m${message}\x1b[0m`);

    for (const phone of currSession.phones) {
      phone.send(message);
    };
  });

  // Remove from sessions when WebSocket closes
  socket.on("close", (code, reason) => {
    console.log(`\x1b[33m${cookies.session} disconnected: \x1b[31m${code} ${reason}\x1b[0m`)
    currSession.host = undefined;
  });
});

// ActiveCurious WebSocket Server
wsActiveCurious.on('connection', (socket, req) => {
  const query = req.url.includes("?") ? qs.parse(req.url.substring(req.url.indexOf("?") + 1)) : qs.parse("");
  const currSession = sessions.find(session => session.room === query.room);
  if (currSession === undefined) {
    rejectSuspiciousWs(socket, req, query.room);
    return;
  };

  currSession.phones.push(socket);

  //Logging
  console.log("\x1b[33mMobile connected to " + query.room + " with a WS on:",
              "\x1b[32m" + req.url,
              "\x1b[36m" + formattedDate(),
              "\x1b[0m");
  bigLog(req, socket, "ws");


  socket.on('message', message => {
    // Logging
    console.log(`\x1b[33mMobile of ${query.room} sent: \x1b[31m${message}\x1b[0m`);

    currSession.host.send(message);
  });

  // Remove from phone from sessions when WebSocket closes
  socket.on("close", (code, reason) => {
    console.log(`\x1b[33mMobile of ${query.room} disconnected: \x1b[31m${code} ${reason}\x1b[0m`)
    const index = currSession.phones.findIndex(ws => ws === socket);
    if (index > -1) {
      currSession.phones.splice(index, 1);
    } else { // Never should run:
      console.log(`\x1b[31mMobile of \x1b[33m${query.room}\x1b[31m had NO SESSION??\x1b[0m`);
      console.log(socket);
    };
    console.log(currSession, sessions);
  });
});


// Route WebSocket Servers
server.on('upgrade', (req, socket, head) => {
  const pathname = req.url.includes("?") ? req.url.substring(0, req.url.indexOf("?")) : req.url;
  const wsServer = wsServers.find(server => server.path === pathname).server;

  wsServer.handleUpgrade(req, socket, head, socket => {
    wsServer.emit('connection', socket, req);
  });
});
