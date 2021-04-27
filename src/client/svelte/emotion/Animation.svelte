<script>
  import { } from "node:os";
import { act } from "../stores.js";

  let guess;
  function checker(e) {
    e.preventDefault();
    if (guess.toUpperCase() === $act.currLine[2].answer) {
      act.jumpLines();
    }
  }

  let found = ["chicken", "pot", "broth", "water", "noodles"];

</script>

<style>
  section {
    height: 100%;
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
  }

  .items {
    display: grid;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
    grid-auto-columns: 1fr;
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    grid-template-areas: "chicken pot broth" "noodles pot water";
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: auto auto;
  }

  img.item {
    grid-area: var(--item);
    align-self: center;
    justify-self: center;
  }
</style>

{#if $act.currLine[1] === "happy"}
<section>
  <img src="/pics/tempcubert.png" alt="walk">
</section>


{:else if $act.currLine[1] === "puzzle"}
<section>
  <img src={$act.currLine[2].image} alt="puzzle">
  <h2>{$act.currLine[2].prompt}</h2>
  <form action="">
    <input class="text" type="text" name="" id="" bind:value={guess}>
    <button class="submit" on:click={checker}>Try it</button>
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
      {#each found as type}
        <img class="item" style="--item:{type}" src="/pics/tempcubert.png" alt="{type} found">
      {/each}
    </div>
  </div>
</section>
{/if}

