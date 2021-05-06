<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { act, DEBUGMODE } from "../utils.js";

  const { getHostWs } = getContext('main');
  const dispatch = createEventDispatcher();

  let puzzlecheck = "Try it";
  $: actionOptions = $act.currLine[2];

  let guess = '';
  function checker(e) {
    e.preventDefault();
    if (guess.toUpperCase() === $act.currLine[2].answer) {
      dispatch('proceed', { type: "puzact" });
    } else {
      puzzlecheck = "Please try again!";
    }
  }
  let found = [];
  let stirs = 0;

  getHostWs().addToListeners("message", (event) => {
    const flag = event.data.split("=");
    switch (flag[0]) {
      case "found": {
        if (!found.includes(flag[1])) {found = [...found, flag[1]]};
        console.log(found);
        break;
      }
      case "stirStart": {
        if (stirs <= 5) {stirs += 1;};
        if (stirs > 4 && found.length === 4) {
          dispatch('proceed', { type: "puzact" });
          getHostWs().trySend("Done");
        }
        break;
      }
      case "stirStop": {
        stirs -= 1;
        break;
      }
      default: {
        if (DEBUGMODE && flag[0] === "debug") { getHostWs().raw.close(); };
        break;
      }
    };
  });
</script>

<style>
  section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
  }

  input.text {
    margin-right: 3px;
  }

  div.activity {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 80vw;
    height: 80vh;
    padding: 4vw 4vh;
    border-radius: 14px;
    font-size: 1.5em;
    color: whitesmoke;
    background-color: hsla(0, 0%, 0%, 0.6);
  }

  h2 {
    text-align: center;
    margin: 0;
  }

  .items {
    display: grid;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
    grid-auto-columns: 1fr;
    grid-column-gap: 16px;
    grid-template-areas: "chicken pot broth" "noodles pot water";
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: 50% 50%;
    height: 40vh;
  }

  .item {
    max-width: 100%;
    max-height: 100%;
    grid-area: var(--item);
    align-self: center;
    justify-self: center;
    object-fit: contain;
  }

  #potimg {
    height: 400px;
  }

  div.cube-wrapper > img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35vw;
  }

  div.cube-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
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
</style>



{#if $act.currLine[1] === "picture"}
<div class="cube-wrapper">
  <img draggable="false" src={actionOptions.image} alt="walk">
</div>
{:else if $act.currLine[1] === "puzzle"}
<section>
  <img draggable="false" src={$act.currLine[2].image} alt="puzzle">
  <h2>{$act.currLine[2].prompt}</h2>
  <form action="">
    <input class="text" type="text" name="" id="" bind:value={guess}>
    <button class="submit" on:click={checker}>{puzzlecheck}</button>
  </form>
</section>


{:else if $act.currLine[1] === "activity"}
{#if actionOptions.activity === "ActiveCurious"}
<section>
  <div class="activity">
    <h2>Let's make some Chicken Noodle Soup!</h2>
    <p>
      Look for the ingredients (chicken, noodles, broth, and water) around the room!
      Each one will have a link on it: once you find it, go to the link on your phone and
      begin stirring it in! At least 6 of you need to stir to finish the soup.
    </p>
    <div class="items">
      {#each found as type (type)}
      <img draggable="false" class="item" style="--item:{type}" src="/pics/{type}.png" alt="{type} found">
      {/each}
      <div class="item" style="--item:pot">
        <h2>Currently stirring: {stirs}</h2>
        <img draggable="false" src="/pics/pot.gif" alt="Mixing pot" id="potimg">
      </div>
    </div>
  </div>
</section>
{:else if actionOptions.activity === "PositiveSocial"}
<div></div>
{/if}

{:else}
<div class="cube-wrapper">
  <img draggable="false" src="/pics/cubert/{$act.currLine[1]}.png" alt="{$act.currLine[1]}">
</div>
<div class="bubble">
  <h1>{$act.currLine[0]}</h1>
</div>
{/if}

