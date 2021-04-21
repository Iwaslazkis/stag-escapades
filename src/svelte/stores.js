const scenes = [
    {
        id: 0,
        name: "room 1",
        lines: 
        [ // ["SPEAKER: line" | "", animation/component]
            ["", "walk-in"],
            ["CUBERT: Hey, you parsed me right!", "neutral"],
            ["CUBERT: That's one thing down", "neutral"],
            ["CUBERT: Now keep going, you don't have much time", "smiles"],
            ["", "puzzle", {
                image: "/pics/puzzle1.png",
                prompt: "What do you think this means?",
                answer: "AEFH"
            }]
        ]
    },
    {
        id: 1,
        name: "room 2",
        lines: 
        [ // ["SPEAKER: line" | "", animation/component]
            ["", "walk-in"],
            ["CUBERT: Hey, room 2 came in! So the store was setup right too!", "neutral"],
            ["CUBERT: That's one thing down", "neutral"],
            ["CUBERT: Now keep going, you don't have much time", "smiles"]
        ]
    },
];

let current = scenes[0];
current.currLine = current.lines[0];
current.currLineID = 0;

let subscribers = [];
function notify(curr) {
    for(const subscriber of subscribers) {
        subscriber(curr);
    } 
};


export const scene = {
    subscribe(fn) {
        fn(current);
        subscribers.push(fn);
        return () => {
            subscribers.splice(subscribers.indexOf(fn), 1);
        }
    },
    jumpLines(n = 1) {
        current.currLineID += n;
        const currScene = scenes[scenes.map(scene => scene.id).indexOf(current.id)];
        const remainder = current.currLineID + 1 - currScene.lines.length;

        if (remainder > 0) {
            //Switch scenes if lines overflowed
            current = scenes[scenes.indexOf(currScene) + 1];
            current.currLine = current.lines[remainder - 1];
            current.currLineID = remainder - 1;
        } else {
            current.currLine = current.lines[current.currLineID];
        }
        
        notify(current);
    },
    
};