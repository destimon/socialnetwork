"use strict";

// Get all posts
let blog = new Vue({
	el: '#blog',
	data: {
		posts: 'Если вы видите это сообщение, то что-то пошло не так...',
		loading: true
	},
	methods: {
		getFeed: function() {
			axios.get('/feedcontent')
				.then(function (res) {
					console.log(res);
					let data = res.data;
					blog.posts = data.reverse();
					blog.loading = false;
				});
		}
	},
	created: function() {
		this.loading = true;
		this.getFeed()
	}
});

// Send new post
let create_post_form = new Vue({
	el: '#create_post_form',
	data: {
		pagename: '',
		loading: false,
		message: ''
	},
	methods: {

		postFeed: function() {
			let textcap = $("#text").val();
			let routecap = document.location.href.match(/[^\/]+$/)[0];

			axios.post('/feednew', {
				text: textcap,
				route: routecap
			})
			.then(function(res) {
				console.log('res.data' + res.data);
				create_post_form.loading = false;
				create_post_form.message = 'Опубликовано!';
			})
			.catch(function(err) {
				create_post_form.message = 'Ошибка. Нет соединения!';
				console.log(err);
			});

			this.message = 'Отправление...';
			this.loading = true; 
			blog.getFeed();
		}
	}
});
