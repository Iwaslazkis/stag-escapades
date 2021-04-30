<script>
  import { getContext } from "svelte";
  import { act, DEBUGMODE } from "../utils.js";

  const { getHostWs } = getContext('main');

  let puzzlecheck = "Try it";

  let guess;
  function checker(e) {
    e.preventDefault();
    if (guess.toUpperCase() === $act.currLine[2].answer) {
      act.jumpLines();
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
        stirs += 1;
        if (stirs > 4) {
          act.jumpLines();
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

  .cube {
    margin: 60vh;
  }
</style>


{#if $act.currLine[1] === "happy"}
<section >
  <img class="cube" src="/pics/tempcubert.png" alt="walk">
</section>


{:else if $act.currLine[1] === "puzzle"}
<section>
  <img src={$act.currLine[2].image} alt="puzzle">
  <h2>{$act.currLine[2].prompt}</h2>
  <form action="">
    <input class="text" type="text" name="" id="" bind:value={guess}>
    <button class="submit" on:click={checker}>{puzzlecheck}</button>
  </form>
</section>


{:else if $act.currLine[1] === "activity"}
<section>
  <div class="activity">
    <h2>Let's make some Chicken Noodle Soup!</h2>
    <p>
      Look for the ingredients (chicken, noodles, broth, and water) around the room!
      Each one will have a link on it: once you find it, go to the link on your phone and
      begin stirring it in!
    </p>
    <div class="items">
      {#each found as type (type)}
        <img class="item" style="--item:{type}" src="/pics/chicken.png" alt="{type} found">
      {/each}
      <div class="item" style="--item:pot">
        <h2>Currently stirring: {stirs}</h2>
        <img src="/pics/chicken.png" alt="Mixing pot" id="potimg">
      </div>
    </div>
  </div>
</section>
{/if}

