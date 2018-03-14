<template>
	<div class="playground-box"><template v-for="itemRow in itemsArray"><item v-for="item in itemRow" v-bind:item="item"></item><br class="clear"></template>{{ itemsArray }}</div>
</template>

<script>
	'use strict';

	import item from '../components/PlaygroundItem.vue';

	export default {
		components: {
			item,
		},
		computed: {
			itemsArray: function() {
				return this.$store.state.itemsArray
			}
		}
	}
</script>

<style lang="scss">
	.playground-box {
		display: table;
		margin: 100px auto 0;
		text-align: center;
		font-size: 0;
	}
</style>
