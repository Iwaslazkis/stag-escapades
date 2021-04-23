import fs from 'fs';

const md = fs.readFileSync('scenes.md', 'utf-8');
let parsed = [];
let id = 0;

md
    .split('\n\n')
    .forEach( (el, i, arr) => {
        if (el.startsWith('#SCENE:')) {
            let scene = {
                id: id,
                name: el.substring(8),
                lines: []
            };

            parsed.push(scene);
            id++;
        } else if (!(el.match(/#.+: .*/))) {
            parsed[parsed.length - 1].lines.push(el);
        }
    })

console.log(parsed);