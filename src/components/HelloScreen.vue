<template>
	<div class="hello-screen">Hello World!<br><br><a href="#" v-on:click.prevent="onClick">Start Game</a></div>
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
	.hello-screen {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		text-align: center;
		padding: 50px 20px;
		z-index: 9999;
		background: #ffffff;
		font-size: 36px;
		color: cornflowerblue;
	}
</style>
