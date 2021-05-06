<script>
  import { setContext } from "svelte";
  import { act, wsConnect, DEBUGMODE } from "./utils.js";
  import Animation from "./emotion/Animation.svelte";

  const getHostWs = wsConnect('ws://REPLACE_HOSTNAME/host');
  setContext('main', { getHostWs });

  let typing = false;

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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main on:click={jumper}>
  <Animation
    on:proceed={e => {typing = false; jumper(e)}}
    on:typingDone={() => {typing = false;}}
  />
  {#if DEBUGMODE}
  <div class="debug">
    <button on:click={() => {getHostWs().raw.close()}}>Simulate ws crash</button>
    <button on:click={() => {getHostWs().trySend("Sent thru debug UI!")}}>Send test msg</button>
  </div>
  {/if}
</main>

