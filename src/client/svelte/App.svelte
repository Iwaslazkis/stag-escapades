<script>
  import { setContext } from "svelte";
  import { act, wsConnect, DEBUGMODE } from "./utils.js";
  import Animation from "./emotion/Animation.svelte";

  let [typing, loaded, started, paused ] = Array(4).fill(false);
  if (DEBUGMODE) {paused = true};

  const getHostWs = wsConnect('ws://REPLACE_HOSTNAME/host');
  setContext('main', { getHostWs });

  const audioCtx = new AudioContext();
  let audio;
  fetch("/coconut_shores.mp3")
    .then(data => data.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
    .then(decodedAudio => { audio = decodedAudio; loaded = true; });



  function startGame() {
    // Play song (Source: https://youtu.be/3NgVlAscdcA)
    if (!paused) {
      const playSound = audioCtx.createBufferSource();
      playSound.buffer = audio;
      playSound.connect(audioCtx.destination);
      playSound.start(audioCtx.currentTime);
      playSound.loop = true;
    }


    started = true;
  }


  function jumper(e) {
    console.log("main got clicked");
    if (e.target !== null) {if (Array.from(document.querySelectorAll(".debug")).includes(e.target.parentElement)) return};

    if (typing) { console.log("Still typing!"); return; };

    if (!($act.currLine[1] === "puzzle" || $act.currLine[1] === "activity") || e.detail.type === "puzact") {
      getHostWs().trySend(`Jumped from: Scene ID ${$act.id}, Line ID ${$act.currLineID}`);
      act.jumpLines();
    }
    if ($act.currLine[1] === "dialogue") {typing = true};
  };
</script>

<style>
  main {
    position: relative;
    width: 100%;
    height: 100%;
    user-select: none;
  }

  div.debug {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main on:click={jumper}>
  {#if DEBUGMODE}
  <div class="debug">
    <button on:click={() => {getHostWs().raw.close()}}>Simulate ws crash</button>
    <button on:click={() => {getHostWs().trySend("Sent thru debug UI!")}}>Send test msg</button>
    <button on:click={() => {paused = !paused}}>{paused ? "Paused" : "Playing"} song</button>
  </div>
  {/if}


  {#if !started}
    <section class="container">
      <h1>Instructions: </h1>
      <h1>1. To progress the story during dialogue,<br> just click anywhere on the screen.</h1>
      <h1>2. Make sure your sound is on!</h1>
      <br>
      <div>
        <h3>{!loaded ? "Loading..." : "Loaded!"}</h3>
        <button disabled={!loaded} on:click={startGame}>Start!</button>
      </div>
    </section>

  {:else}
    <Animation
    on:proceed={e => {typing = false; jumper(e)}}
    on:typingDone={() => {typing = false;}}
    />
  {/if}
</main>

