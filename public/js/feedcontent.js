"use strict";

// Component
Vue.component('post-list', {
	template: '#postList_template',
	props: ['posts']
});

// Block with posts(blog)
let blog = new Vue({
	el: '#blog',
	data: {
		posts: 'Если вы видите это сообщение, то что-то пошло не так...',
		loading: true
	},
	methods: {
		getFeed: function() {
			$.ajax({
			  type: "GET",
			  url: '/feedcontent',
			  success: function(data) {
			  	// Set blog data
 			  	console.log('GETED: ', data);
			  	blog.posts = data.reverse(); 
			  	blog.loading = false;
			  }
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
		loading: false,
		message: ''
	},
	methods: {

		postFeed: function() {
			let textcap = $("#text").val();

			let model = { 
				text: textcap
			};

			$.ajax({
				type: "POST",
				url: '/feednew',
				data: JSON.stringify(model),
				contentType: "application/json",
				success: function() {
					create_post_form.loading = false;
					create_post_form.message = 'Опубликовано!';
				},
				error: function() {
					create_post_form.message = 'Ошибка. Нет соединения!';
				}
			});

			this.message = 'Отправление...';
			this.loading = true; 
			blog.getFeed();
		}
	}
});

