<script>
  import { setContext } from "svelte";
  import { act, wsConnect, DEBUGMODE } from "./utils.js";
  import Animation from "./emotion/Animation.svelte";

  const getHostWs = wsConnect('ws://REPLACE_HOSTNAME/host');

  setContext('main', { getHostWs });

  let buffer = 0;
  function jumper(e) {
    console.log("main got clicked");
    if (e.target !== null) {if (Array.from(document.querySelectorAll(".debug")).includes(e.target.parentElement)) return};
    if (!($act.currLine[1] === "puzzle" || $act.currLine[1] == "activity")) {
      if (buffer > 0) { buffer -= 1; console.log("Buffer used:", buffer); return; };
      console.log("normal jump");
      getHostWs().trySend(`Jumped from: Scene ID ${$act.id}, Line ID ${$act.currLineID}`);
      act.jumpLines();
    } else if (e.detail.type === "puzact") {
      console.log("puzzle or activity");
      buffer += 1;
      getHostWs().trySend(`Jumped from: Scene ID ${$act.id}, Line ID ${$act.currLineID}`);
      act.jumpLines();
    }
  };
</script>

<style>
  main {
    position: relative;
    width: 100%;
    height: 100%;
    user-select: none;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main on:click={jumper}>
  <Animation on:proceed={jumper}/>
  {#if DEBUGMODE}
  <div class="debug">
    <button on:click={() => {getHostWs().raw.close()}}>Simulate ws crash</button>
    <button on:click={() => {getHostWs().trySend("Sent thru debug UI!")}}>Send test msg</button>
  </div>
  {/if}
</main>

