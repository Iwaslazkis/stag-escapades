<script>
  import { act } from "./stores.js";
  import Animation from "./emotion/Animation.svelte";

  const ws = new WebSocket('ws://localhost:3000/ws');
  ws.addEventListener("open", (e) => {
    ws.send('Connection started');
  });

  ws.addEventListener("message", (e) => {
    console.log("Message received:", e.data);
  });

  function jumper(e) {
    ws.send($act.currLine[1]);
    if (!($act.currLine[1] === "puzzle")) {
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

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main on:click={jumper}>
  <Animation/>
  {#if !($act.currLine[0] === "")}
  <div class="bubble">
    <h1>{$act.currLine[0]}</h1>
  </div>
  {/if}
</main>

