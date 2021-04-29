<script>
  const url = window.location.href.split('/');

  const color = "#AAA";
  let done = false;

  const ws = new WebSocket(`wss://REPLACE_HOSTNAME/ws/ActiveCurious?main=${url[3]}`);
  ws.addEventListener("open", (event) => {
    ws.send(`found=${url[4]}`);
  });

  ws.addEventListener("message", (e) => {
    console.log("Message received:", e.data);

    if (e.data === "Done") {
      done = true;
    }
  });

  function stirring (e) {
    ws.send(`stirStart=${url[4]}`);
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
  }

  h1 {
    margin: 0px;
  }

  img {
    width: 100%;
  }
</style>

<main style="--color:{color}">
  {#if !done}
  <h1>You found the...</h1>
  <img src="/pics/{"chicken"}.png" alt="{url[4]}!">
  <button on:click={stirring}>Now stir it in (Literally!)</button>
  {:else}
  <h1>Awesome mixing! Here's the soup:</h1>
  <img src="/pics/{"chicken"}.png" alt="The chicken noodle soup">
  {/if}
</main>
