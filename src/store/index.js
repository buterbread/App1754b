import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

var ARRAY_WIDTH = 5;
var ARRAY_HEIGHT = 5;
var MIN_ITEM_VALUE = 0;
var MAX_ITEM_VALUE = 4;
var INITIAL_DROPS_COUNTER = 1000;
var DROP_POP_DELAY = 500;
var DROP_INJECTION_DELAY = 170;

var directions = [
	{ top: 0, left: -1, label: 'left' },
	{ top: -1, left: 0, label: 'top' },
	{ top: 0, left: 1, label: 'right' },
	{ top: 1, left: 0, label: 'bottom' },
	// { top: -1, left: -1, label: 'topLeft' },
	// { top: 1, left: 1, label: 'bottomRight' }
];

function Bubble(options) {
	this.value = options.value;
	this.row = options.row;
	this.col = options.col;
	this.isPopAnimationActive = false;
	this.directions = directions.slice();
	this.dropPassageAnimation = {
		'left': false,
		'top': false,
		'right': false,
		'bottom': false,
		'topLeft': false,
		'bottomRight': false,
	};
}

Vue.use(Vuex);

export function createStore() {
	return new Vuex.Store({
		state: {
			itemsArray: [],
			dropsCount: 0,
			gameStarted: false
		},
		mutations: {
			GENERATE_ITEMS_ARRAY: function(state, options) {
				var itemsArray = [];

				for (var i = 0; i < ARRAY_HEIGHT; i++) {
					var itemsRow = [];
					for (var j = 0; j < ARRAY_WIDTH; j++) {
						var col = new Bubble({
							value: Math.floor(Math.random() * (MAX_ITEM_VALUE - MIN_ITEM_VALUE + 1)) + MIN_ITEM_VALUE,
							row: i,
							col: j,
						});
						itemsRow.push(col);
					}
					itemsArray.push(itemsRow);
				}

				state.itemsArray = itemsArray;
			},

			INCREASE_ITEM: function(state, options) {
				var {row, col} = options;

				state.itemsArray[row][col].value++;
			}
		},
		actions: {
			startNewGame: function(context, options) {
				context.commit('GENERATE_ITEMS_ARRAY');
				context.state.dropsCount = INITIAL_DROPS_COUNTER;
				context.state.gameStarted = true;
			},

			makeUserMove: function(context, options) {
				var {row, col, addBonusDrop} = options;

				context.state.dropsCount--;

				this.commit('INCREASE_ITEM', {row: options.row, col: options.col});

				this.dispatch('popBubble', {row: row, col: col, addBonusDrop: true});
			},

			injectAllDrops: function(context, options) {
				var {row, col, addBonusDrop} = options;

				if (addBonusDrop === true) {
					context.state.dropsCount++;
				}

				var emitter = context.state.itemsArray[row][col];

				emitter.directions.forEach(function(direction) {
					context.dispatch('injectSingleDrop', {row: row, col: col, direction: direction});
				});
			},

			injectSingleDrop: function(context, options) {
				var items = context.state.itemsArray;

				var initialItemCords = options.initialItemCords || options;

				var row = options.row + options.direction.top;
				var col = options.col + options.direction.left;

				if (!items[row] || !items[row][col]) {
					context.dispatch('stopDropPassageAnimation', initialItemCords);
					return;
				}

				context.dispatch('startDropPassageAnimation', options);

				var top = options.direction.top;
				var left = options.direction.left;

				if (items[row][col].value === 0) {
					var newTop;
					var newLeft;

					if (top === 0) {
						newTop = top;
					} else if (top < 0) {
						newTop = top - 1
					} else {
						newTop = top + 1
					}

					if (left === 0) {
						newLeft = left;
					} else if (left < 0) {
						newLeft = left - 1
					} else {
						newLeft = left + 1
					}

					setTimeout(function() {
						context.dispatch('injectSingleDrop', {
							row: options.row,
							col: options.col,
							direction: {
								top: newTop,
								left: newLeft
							},
							initialItemCords: initialItemCords
						})
					}, DROP_INJECTION_DELAY);
					return;
				}

				context.commit('INCREASE_ITEM', {row: row, col: col});

				setTimeout(function() {
					context.dispatch('stopDropPassageAnimation', initialItemCords);
				}, DROP_INJECTION_DELAY);

				context.dispatch('popBubble', {row: row, col: col, addBonusDrop: true});
			},

			startDropPassageAnimation: function(context, options) {
				var items = context.state.itemsArray;
				var {row, col, direction} = options;

				if (!items[row] || !items[row][col]) {
					return;
				}

				if (!items[row][col].dropPassageAnimation[direction.label]) {
					items[row][col].dropPassageAnimation[direction.label] = true;
				}
			},

			stopDropPassageAnimation: function(context, options) {
				var {row, col, direction} = options;
				var items = context.state.itemsArray;

				items[row][col].dropPassageAnimation[direction.label] = false;
			},

			popBubble: function(context, options) {
				var {row, col} = options;

				if (context.state.itemsArray[row][col].value > MAX_ITEM_VALUE) {
					context.state.itemsArray[row][col].value = MIN_ITEM_VALUE;
					context.dispatch('makePopAnimation', options);

					setTimeout(function() {
						context.dispatch('injectAllDrops', options);
					}, DROP_POP_DELAY);
				}
			},
			makePopAnimation: function(context, options) {
				var {row, col} = options;

				context.state.itemsArray[row][col].isPopAnimationActive = true;
				setTimeout(function() {
					context.state.itemsArray[row][col].isPopAnimationActive = false;
				}, DROP_POP_DELAY);
			}
		},
	});

	return new Vuex.Store({
		state: {
			activeType: null,
			itemsPerPage: 20,
			items: {/* [id: number]: Item */},
			users: {/* [id: string]: User */},
			lists: {
				top: [/* number */],
				new: [],
				show: [],
				ask: [],
				job: []
			}
		},
		actions,
		mutations,
		getters
	});
};
