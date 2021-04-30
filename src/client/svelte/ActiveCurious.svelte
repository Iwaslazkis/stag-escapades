<script>
  import { wsConnect, DEBUGMODE } from "./utils.js";
  const url = window.location.href.split('/');

  const color = "#AAA";
  let done = false;

  const getPhoneWs = wsConnect(`ws://REPLACE_HOSTNAME/ws/ActiveCurious?main=${url[3]}`);
  getPhoneWs().addToListeners("open", (event) => {
    getPhoneWs().trySend(`found=${url[4]}`);
  });

  getPhoneWs().addToListeners("message", (e) => {
    if (e.data === "Done") {
      done = true;
    }
  });

  function stirring (e) {
    getPhoneWs().trySend(`stirStart=${url[4]}`);
  }
</script>

<style>
  main {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--color);
    position: relative;
  }

  h1 {
    margin: 0px;
  }

  img {
    width: 100%;
  }

  .debug {
    position: absolute;
    top: 10px;
    left: 10px;
  }
</style>

<main style="--color:{color}">
  {#if DEBUGMODE}
  <button class="debug" on:click={() => {getPhoneWs().trySend("debug=close")}}>Close it!</button>
  {/if}
  {#if !done}
  <h1>You found the...</h1>
  <img src="/pics/{"chicken"}.png" alt="{url[4]}!">
  <button on:click={stirring}>Now stir it in (Literally!)</button>
  {:else}
  <h1>Awesome mixing! Here's the soup:</h1>
  <img src="/pics/{"chicken"}.png" alt="The chicken noodle soup">
  {/if}
</main>
