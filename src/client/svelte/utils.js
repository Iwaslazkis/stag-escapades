import script from "../script.md";

export const DEBUGMODE = REPLACE_DEBUG;

let current = {
  ...script[0],
  currLine: script[0].lines[0],
  currLineID: 0
};
console.log(script, current);

let subscribers = [];
function notify(curr) {
  for(const subscriber of subscribers) {
    subscriber(curr);
  }
};


export const act = {
  subscribe(fn) {
    fn(current);
    subscribers.push(fn);
    return () => {
      subscribers.splice(subscribers.indexOf(fn), 1);
    }
  },
  jumpLines(n = 1) {
    current.currLineID += n;
    const currAct = script[script.map(act => act.id).indexOf(current.id)];
    const remainder = current.currLineID + 1 - currAct.lines.length;

    if (remainder > 0) {
      //Switch acts if lines overflowed
      current = { ...script[script.indexOf(currAct) + 1] };
      current.currLine = current.lines[remainder - 1];
      current.currLineID = remainder - 1;

      console.log("Went to next act:", current);
    } else {
      current.currLine = current.lines[current.currLineID];
    }

    console.log(current);
    notify(current);
  },

};

export function wsConnect(path, listeners = []) {
  let socket;
  function reconnect() {
    socket = new WebSocket(path);
    socket.addEventListener("open", e => {
      socket.send('Connection started');
      console.log('Connection started', e)

      socket.addEventListener("message", e => {
        console.log("Message received:", e.data);
      });

      socket.addEventListener("close", e => {
        console.log("WS closed!", e);
        reconnect();
      });

      socket.addEventListener("error", e => {
        console.log("WS error: ", e);
        socket.close();
      });

      for (const listener of listeners) {
        socket.addEventListener(listener.event, listener.fn);
      }
    });
  };

  reconnect();

  return () => {
    return {
      addToListeners: (event, fn) => {
      socket.addEventListener(event, fn);
      listeners.push({ event: event, fn: fn });
      },
      trySend: (message) => {
        socket.send(message);
        //TODO: Try again when socket is down (maybe make a backlog) checking if socket.readyState is OPEN or CLOSED/CLOSING
      },
      //TODO: Implement a permClose() to stop retrying a connection

      raw: socket
    };
  };
};
