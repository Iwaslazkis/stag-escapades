import script from "../script.md";
console.log(script);

let current = script[0];
current.currLine = current.lines[0];
current.currLineID = 0;

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
            current = script[script.indexOf(currAct) + 1];
            current.currLine = current.lines[remainder - 1];
            current.currLineID = remainder - 1;
        } else {
            current.currLine = current.lines[current.currLineID];
        }
        
        notify(current);
    },
    
};