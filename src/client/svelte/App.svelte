<script>
  import { setContext } from "svelte";
  import { act, wsConnect, DEBUGMODE } from "./utils.js";
  import Animation from "./emotion/Animation.svelte";

  const getHostWs = wsConnect('ws://REPLACE_HOSTNAME/ws');
  const getWs2 = DEBUGMODE ? wsConnect('ws://REPLACE_HOSTNAME/ws') : undefined;

  setContext('main', { getHostWs, getWs2 });

  function jumper(e) {
    if (Array.from(document.querySelectorAll(".debug")).includes(e.target.parentElement)) return;
    if (!($act.currLine[1] === "puzzle" || $act.currLine[1] == "activity")) {
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
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .bubble {
    position: absolute;
    top: 0%;
    width: calc(100% - 2vw);
    margin: 1.5vh 1vw auto;
    border: 1px solid hsla(0, 0.00%, 78.00%, 1.00);
    border-radius: 14px;
    background-image: linear-gradient(to bottom, white, hsla(0, 0.00%, 86.00%, 1.00));
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
  <Animation/>
  {#if DEBUGMODE}
  <div class="debug">
    <button on:click={() => {getWs2().raw.close()}}>Close WS2</button>
    <button on:click={() => {getHostWs().trySend("Sent thru 1!")}}>Contextless ws.send()</button>
    <button on:click={() => {getWs2().trySend("Sent thru 2!")}}>Contextless ws2.send()</button>
  </div>
  {/if}
  {#if !($act.currLine[0] === "")}
  <div class="bubble">
    <h1>{$act.currLine[0]}</h1>
  </div>
  {/if}
</main>

