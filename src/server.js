import express from 'express';
const app = express();
const port = +process.env.PORT;
const host = process.env.LOCALIP;

// Logging
app.use((req, res, next) => {
  console.log("\x1b[32m" + req.url,
              "\x1b[36m" + new Date(),
              "\x1b[0m");
  // console.log(req);
  next();
});

// Static files
app.use(express.static('public'));

app.listen(port, host,  () => {
  console.log(`Listening on http://${host}:${port}/`);
});
