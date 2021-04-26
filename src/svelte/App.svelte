<script>
	import { act } from "./stores.js";
	import Animation from "./animation.svelte";

	function jumper(e) {
		if (!($act.currLine[1] === "puzzle")) {
			act.jumpLines()
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

