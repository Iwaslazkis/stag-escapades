import { createFilter } from "rollup-pluginutils";

function parse (script, config) {
  let parsed = [];
  let id = 0;

  script
  .trim()
  .split('\n\n')
  .forEach( (el, i, arr) => {
    const matched = el.match(/#(.+): (.*)/);

    // New Act (#ACT: ...)
    if (el.startsWith('#ACT:')) {
      let act = {
        id: id,
        name: el.substring('#ACT: '.length),
        lines: []
      };

      parsed.push(act);
      id++;

      // New Scene (#<SCENETYPE>: [options])
    } else if (matched !== null && matched !== undefined) {
      let options;
      try   { options = config[matched[1].toLowerCase()](matched[2]); }
      catch { throw Error(`Scene type ${matched[1].toUpperCase()} is not defined`); }
      const scene = ["", matched[1].toLowerCase(), options];
      parsed[parsed.length - 1].lines.push(scene);

      // New Line (#<Emotion>\n<Line>)
    } else {
      let line = el.split('\n').reverse();
      line[2] = line[1].replace("#", "").toLowerCase();
      line[1] = "dialogue";
      parsed[parsed.length - 1].lines.push(line);
    }
  });

  return JSON.stringify(parsed);
};


export default function (opts = {}) {
  opts.include = opts.include ? opts.include : './**/script.md';
  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: "screenwriter",

    transform(code, id) {
      if (filter(id)) {
        return {
          code: `export default ${parse(code, opts.scenes)};`,
          map: { mappings: "" }
        };
      }
    }
  };
};




/* Check parser:
for (let index = 0; index < parsed.length; index++) {
  const acts = parsed[index];
  console.log(acts);
  for (let i2 = 0; i2 < acts["lines"].length; i2++) {
    const line = acts["lines"][i2];
    console.log(line);
  }
}
*/
