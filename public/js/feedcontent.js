"use strict";

// Get all posts --------------------------------------------------------------------
let blog = new Vue({
	el: '#blog',
	data: {
		posts: 'Если вы видите это сообщение, то что-то пошло не так...',
		loading: true,
		offset: -1,
		limit: -1,
		buttonStatus: true
	},
	methods: {
		// Get Global Feed ------
		getFeed: function(offs, lim) {
			axios.get('/feedcontent', {
				params: {
					offset: offs,
					limit: lim
				}
			})
			.then(function (res) {
				// if page just started
				if(blog.offset == -1){
					blog.offset = res.data.offset;
					blog.limit = res.data.limit;
				}

				// Employ data
				let docs = res.data.docs;
				blog.posts = docs.reverse();
				blog.loading = false;
			});
		},
		// Get User Feed ------
		getMyFeed: function() {
			let pagename = document.location.href.match(/[^\/]+$/)[0];
			console.log(pagename);

			axios.get('/feedcontent', {
				params: {
					login: pagename
				}
			})
			.then(function(res) {
				
				// Employ data
				let data = res.data;
				blog.posts = data.reverse();
				blog.loading = false;
			});
		},
		// Get More Posts ------
		showMore: function() {
			axios.get('/feedcontent')
			.then(function(res) {
				if((blog.offset - 4) < 0) {
					blog.offset = 0;
					blog.limit = res.data.total;
					blog.buttonStatus = false;
				}	else {
					// get bot
					blog.offset = blog.offset - 4;
					// show top
					blog.limit = (Number(blog.limit) + 4)
				}

				// upload
				blog.getFeed(blog.offset, blog.limit);
			});
		},
	},
	created: function() {
		let pagename = document.location.href.match(/[^\/]+$/)[0];
		this.loading = true;

		// get total pages from mongoose
		axios.get('/feedcontent')
		.then(function(res){
		// recognize which func to do
			if ( pagename == 'feed' ) {
				// Get newest content
				axios.get('/feedcontent')
				.then(function(res) {
					let newcontent = (res.data.total - 4);
					let newlimit = 4;
					blog.getFeed(newcontent, newlimit);
				});
			} else {
				blog.getMyFeed();
			}
		});
	}
});

// Send new post --------------------------------------------------------------------
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
			let pagename = document.location.href.match(/[^\/]+$/)[0];

			axios.post('/feednew', {
				text: textcap
			})
			.then(function(res) {
				console.log('res.data' + res.data);
				
				if (pagename == 'feed') {
					blog.getFeed(blog.pgtop);
				} else {
					blog.getMyFeed();
				}
				
				create_post_form.loading = false;
				create_post_form.message = 'Опубликовано!';
			})
			.catch(function(err) {
				create_post_form.message = 'Ошибка. Нет соединения!';
				console.log(err);
			});

			this.message = 'Отправление...';
			this.loading = true; 
		}
	}
});
