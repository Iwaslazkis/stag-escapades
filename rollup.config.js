import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import replace from "@rollup/plugin-replace";
import screenwriter from "./src/rollup-plugin-screenwriter.js";
import scenesConfig from "./src/client/scenes.js";

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

const basePlugins = [
  // Insert hostname in frontend files
  replace({
    preventAssignment: true,
    'REPLACE_HOSTNAME': `${process.env.HOSTNAME}`,
    'ws://': () => process.env.NODE_ENV === 'production' ? 'wss://' : 'ws://',
    'REPLACE_DEBUG': () => process.env.NODE_ENV === 'production' ? 'false' : 'true',
  }),

  // Parse scene.md file into the stores.js file
  screenwriter({ scenes: scenesConfig }),

  svelte({
    compilerOptions: {
      // enable run-time checks when not in production
      dev: !production
    }
  }),

  // If you have external dependencies installed from
  // npm, you'll most likely need these plugins. In
  // some cases you'll need additional configuration -
  // consult the documentation for details:
  // https://github.com/rollup/plugins/tree/master/packages/commonjs
  resolve({
    browser: true,
    dedupe: ['svelte']
  }),
  commonjs(),

  // Watch the `public` directory and refresh the
  // browser on changes when not in production
  !production && livereload('public'),

  // If we're building for production (npm run build
  // instead of npm run dev), minify
  production && terser()
];

export default [
  {
  input: 'src/client/game.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/game.js'
  },
  plugins: [
    ...basePlugins,
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'game.css' }),
  ],
  watch: {
    clearScreen: false
  }
},
{
  input: 'src/client/login.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/login.js'
  },
  plugins: [
    ...basePlugins,

    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'login.css' }),
  ],
  watch: {
    clearScreen: false
  }
},
{
  input: 'src/client/activeCurious.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/activeCurious.js'
  },
  plugins: [
    ...basePlugins,

    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'activeCurious.css' }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),
  ],
  watch: {
    clearScreen: false
  }
}
];
