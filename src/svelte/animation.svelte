<script>
    import { scene } from "./stores.js";

    let guess;
    function checker(e) {
        e.preventDefault();
        if (guess.toUpperCase() === $scene.currLine[2].answer) {
            scene.jumpLines();
        }
    }


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

    input.submit {

    }
</style>

{#if $scene.currLine[1] === "walk-in"}
    <section>
        <img src="/pics/tempcubert.png" alt="walk">
    </section>
{:else if $scene.currLine[1] === "puzzle"}
    <section>
        <img src={$scene.currLine[2].image} alt="puzzle">
        <h2>{$scene.currLine[2].prompt}</h2>
        <form action="">
            <input class="text" type="text" name="" id="" bind:value={guess}>
            <button class="submit" on:click={checker}>Try it</button>
        </form>
    </section>
{:else}

{/if}

