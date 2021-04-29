import script from "../script.md";

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
      current = {
        ...script[script.indexOf(currAct) + 1],
        currLine: current.lines[remainder - 1],
        currLineID: remainder - 1
      };
      console.log(script, current);
    } else {
      current.currLine = current.lines[current.currLineID];
    }

    notify(current);
  },

};
