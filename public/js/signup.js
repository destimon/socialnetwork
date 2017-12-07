"use strict";

let password_form = new Vue({
	el: '#password_form',
	data: {
		pass: '',
		valid: '',
		status: '',
		length: 0
	},
	watch: {
		pass: function(password) {
			this.getValid();
		}
	},
	methods: {
		getValid: _.debounce(
			function() {
				if (this.pass.length < 6) {
					this.valid = 'Password too low!';
					this.status = 'bg-danger';
				} else {
					this.valid = 'Good password!';
					this.status = 'bg-success';
				}
				this.length = this.pass.length
			},
			250
		)
	}
});