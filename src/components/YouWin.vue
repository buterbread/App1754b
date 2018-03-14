<template>
	<div class="you-win">
		You Win<br>Congratulations!
		<br><br><a href="#" v-on:click.prevent="onClick">Restart</a>
	</div>
</template>

<script>
'use strict';

export default {
	methods: {
		onClick: function () {
			this.$store.dispatch('startNewGame');
		}
	},
}
</script>

<style lang="scss">
	.you-win {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		text-align: center;
		padding: 50px 20px;
		z-index: 9999;
		background: #fafafa;
		font-size: 36px;
		color: mediumseagreen;
	}
</style>
