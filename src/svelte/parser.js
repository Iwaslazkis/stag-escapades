import fs from 'fs';
import config from '/home/student/projects/stag-escapades/src/svelte/puzzles.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const md = fs.readFileSync(__dirname + '/scenes.md', 'utf-8');
let parsed = [];
let id = 0;

md
    .split('\n\n')
    .forEach( (el, i, arr) => {
        const matched = el.match(/#(.+): (.*)/);
        console.log(config.activity("hi"));
        if (el.startsWith('#SCENE:')) {
            let scene = {
                id: id,
                name: el.substring(8),
                lines: []
            };

            parsed.push(scene);
            id++;
        } else if (el.match(/#.+: .*/)) {
            //const line = ["", matched[2], config[matched[1]](matched[2])];
            parsed[parsed.length - 1].lines.push(matched[1]);
        } else {
            parsed[parsed.length - 1].lines.push(el);
        }
    })

console.log(parsed);