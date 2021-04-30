<script>

  let errormsg = '';
  let confirm = '';
  let key;

  function setIfGiven(obj, variable) {
    if (obj[variable] !== undefined) {
      variable
    };
  };

  function firstSubmit(event) {
    console.log(event);
    fetch('/', {
      method: 'post',
      body: `confirmed=false&key=${key}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(res => res.json())
    .then(json => {
      if (json.errormsg !== undefined) {
        errormsg = json.errormsg;
      } else if (json.room !== undefined) {
        confirm = json.room;
      };
    });
  };
</script>

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

  div {
    background-color: indianred;
  }
</style>

<!-- have an if for errors and one for SecondSubmit which is default behaviour -->

<main>
  <h1>STAG Escape Room!</h1>
  {#if confirm}
    <form action="" method="POST">
      <h1>Start the escape room for room: {confirm}</h1>
      <input type="hidden" name="confirmed" value="true">
      <input type="hidden" name= "key" value={key}>
      <button type="submit">
        Start!
      </button>
    </form>
    <button on:click={() => {confirm = '';}}>That's not my room!</button>
  {:else}
  <form action="" method="POST" on:submit|preventDefault={firstSubmit}>
    <label for="keyid">
      Pop the Balloon to start!<br>
      Inside, you'll find a code. type it in here:<br>
    </label>

    <input type="hidden" name="confirmed" value="false">
    <input type="text" name="key" id="keyid" bind:value={key} />
    <button type="submit">
      Enter
    </button>
  </form>
  {/if}
  {#if errormsg}
    <div on:click={() => {errormsg = '';}}>
      {errormsg}
    </div>
  {/if}
</main>
