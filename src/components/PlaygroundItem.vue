<template>
	<div class="item" v-bind:value="item.value" v-bind:data-row="item.row" v-bind:data-col="item.col" v-on:click.prevent="onClick">
		{{ theValue }}
		<div class="pop-animation" v-if="item.isPopAnimationActive"></div>
		<div class="drop-passage-anim-box">
			<div class="drop-passage left" v-if="item.dropPassageAnimation.left"></div>
			<div class="drop-passage top" v-if="item.dropPassageAnimation.top"></div>
			<div class="drop-passage right" v-if="item.dropPassageAnimation.right"></div>
			<div class="drop-passage bottom" v-if="item.dropPassageAnimation.bottom"></div>
		</div>
	</div>
</template>

<script>
	'use strict';
	import {timeAgo} from '../util/filters'

	export default {
		props: ['item'],
		computed: {
			theValue: function() {
				return this.$store.state.itemsArray[this.$props.item.row][this.$props.item.col].value
			}
		},
		methods: {
			onClick: function(event) {
				const row = +event.currentTarget.getAttribute('data-row');
				const col = +event.currentTarget.getAttribute('data-col');

				this.$store.dispatch('makeUserMove', {row: row, col: col});
			}
		}
	}
</script>

<style lang="scss">
	.item {
		display: inline-block;
		vertical-align: top;
		position: relative;
		border: 1px solid #cccccc;
		width: 48px;
		height: 48px;
		margin: 1px 1px;
		box-sizing: border-box;
		text-align: center;
		font-size: 16px;
		line-height: 48px;
		cursor: pointer;

		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.item:hover {
		border-color: #333333;
		z-index: 10;
	}

	.item[value="0"] {
		font-size: 0;
	}

	.clear {
		display: block;
		clear: both;
	}

	.pop-animation {
		background: #333333;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 50;
		opacity: 0.3;
	}

	.drop-passage-anim-box {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	@keyframes passage {
		from { width: 0; }
		to { width: 200px; }
	}

	.drop-passage {
		position: absolute;
		right: 50%;
		top: 0;
		bottom: 0;
		margin: auto;
		height: 10px;
		width: 10px;
		background: #f00;
		opacity: 0.5;
		transform-origin: right;

		animation-name: passage;
		animation-duration: 0.68s;
		animation-fill-mode: forwards;
		animation-timing-function: linear
	}

	.drop-passage.top {
		transform: rotate(90deg);
	}

	.drop-passage.right {
		transform: rotate(180deg);
	}

	.drop-passage.bottom {
		transform: rotate(270deg);
	}
</style>
