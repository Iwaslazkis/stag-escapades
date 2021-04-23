import fs from 'fs';
import config from '/home/student/projects/stag-escapades/src/svelte/puzzles.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const md = fs.readFileSync(__dirname + '/scenes.md', 'utf-8');
let parsed = [];
let id = 0;

md
    .trim()
    .split('\n\n')
    .forEach( (el, i, arr) => {
        const matched = el.match(/#(.+): (.*)/);
        if (el.startsWith('#SCENE:')) {
            let scene = {
                id: id,
                name: el.substring(8),
                lines: []
            };
            
            parsed.push(scene);
            id++;
        } else if (matched !== null && matched !== undefined) {
            console.log(matched);
            const line = ["", matched[1].toLowerCase(), config[matched[1].toLowerCase()](matched[2])];
            parsed[parsed.length - 1].lines.push(line);
        } else {
            let line = el.split('\n').reverse();
            line[1] = line[1].replace("#", "").toLowerCase();
            parsed[parsed.length - 1].lines.push(line);
        }
    })

export default parsed;
// Check parser:
// for (let index = 0; index < parsed.length; index++) {
//     const scenes = parsed[index];
//     console.log(scenes);
//     for (let i2 = 0; i2 < scenes["lines"].length; i2++) {
//         const line = scenes["lines"][i2];
//         console.log(line);
//     }
// }