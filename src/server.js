import express from 'express';
const app = express();
const port = +process.env.PORT;
const host = process.env.LOCALIP;

// Source: https://medium.com/developers-tomorrow/understanding-how-cookie-and-session-in-javascript-3af858fa8112
const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

function formattedDate() {
  const now = new Date();
  const time = now.toTimeString().split(' ');
  const timezone = time[1] === "GMT-0500" ? "CDT" : time.filter((v, i) => i >= 2).join(" ");
  return `${time[0]} ${timezone} ${now.toDateString().substring(4)}`;
}

app.use(express.urlencoded({
  extended: true
}))

// Logging
app.use((req, res, next) => {
  console.log("\x1b[32m" + req.url,
              "\x1b[36m" + formattedDate(),
              "\x1b[0m");
  console.log(parseCookies(req.headers.cookie), req);
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
    'Set-Cookie': `session=${encodeURIComponent(req.body["room"])};Expires=${expires.toGMTString()};HttpOnly;`
  });
  res.end();
});

// Static files
app.use(express.static('public'));

app.listen(port, host,  () => {
  console.log(`Listening on http://${host}:${port}/`);
});
