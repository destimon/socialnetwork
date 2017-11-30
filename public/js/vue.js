"use strict";

let blog = new Vue({
	el: '#blog',
	data: {
		message: 'Hi girls'
	},
	methods: {

		getFeed: function() {
			$.ajax({
			  type: "GET",
			  url: '/feedcontent',
			  success: function(data) {
			  	console.log('GETED: ', data);
			  }
			});
		},	
	}
})

let create_post_form = new Vue({
	el: '#create_post_form',
	data: {
		message: ' '
	},
	methods: {

		postFeed: function() {
			let textcap = $("#text").val();
			console.log(textcap);
			let sample = { 
				text: textcap
			};

			console.log(sample);

			$.ajax({
				type: "POST",
				url: '/feednew',
				data: JSON.stringify(sample),
				contentType: "application/json",
				success: function(data) {
					console.log(data);
				},
			})
		},
	}
})