<style>
  main {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  label {
    padding-bottom: 1em;
  }
</style>

<main>
  <h1>STAG Escape Room!</h1>
  <form action="" method="POST">
      <label for="roomid">
          "Pop the Balloon to start!" <br>
          "Inside, you'll find a code. type it in here:"<br>
      </label>
      <input type="text" name="room" id="roomid" />
      <input type="submit" value="Start!" />
  </form>
</main>
