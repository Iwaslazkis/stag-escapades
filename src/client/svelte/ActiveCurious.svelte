<script>
  const url = window.location.href.split('/');

  const color = "#AAA";

  const ws = new WebSocket(`ws://REPLACE_HOSTNAME/ws/ActiveCurious?main=${url[3]}`);
  ws.addEventListener("open", (e) => {
    ws.send('Connection started');
  });

  ws.addEventListener("message", (e) => {
    console.log("Message received:", e.data);
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
  <h1>You found the...</h1>
  <img src="/pics/{url[4]}.png" alt="{url[4]}!">
  <button on:click={stirring}>Now stir it in (Literally!)</button>
</main>
