"use strict";

let app = new Vue({
	el: '#app',
	data: {
		input: '',
		output: 'Waiting...',
		length: 0
	},
	watch: {
		input: function(newvalue) {
			this.getoutput();
		}
	},
	methods: {
		getoutput: _.debounce(
			function() {
				if (this.input.length < 6) {
					this.output = 'Need bigger value';
				} else {
					this.output = 'Good!';
				}

				this.length = this.input.length
			},
			500
		)
	}

});