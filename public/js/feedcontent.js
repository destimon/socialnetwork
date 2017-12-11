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
		getMyFeed: function(offs, lim) {
			let pagename = document.location.href.match(/[^\/]+$/)[0];

			axios.get('/feedcontent', {
				params: {
					login: pagename,
					offset: offs,
					limit: lim
				}
			})
			.then(function(res) {
				// if page just started
				if(blog.offset == -1){
					if (res.data) {
						blog.offset = res.data.offset;
						blog.limit = res.data.limit;
					}
				};

				// Employ data
				let docs = res.data.docs;
				console.log(res);
				blog.posts = docs.reverse();
				blog.loading = false;
			});
		},
		// Get More Posts ------
		showMore: function() {
			let pagename = document.location.href.match(/[^\/]+$/)[0];
			console.log(pagename);

			axios.get('/feedcontent', {
				params: {
					login: pagename
				}
			})
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
				if (pagename == 'feed') {
					blog.getFeed(blog.offset, blog.limit);
				} else {
					blog.getMyFeed(blog.offset, blog.limit);
				}
			});
		},
	},
	created: function() {
		let pagename = document.location.href.match(/[^\/]+$/)[0];
		this.loading = true;

		// recognize which func to do
		if ( pagename == 'feed' ) {
			// IF GLOBAL FEED
			axios.get('/feedcontent')
			.then(function(res) {
				let newcontent = (res.data.total - 4);
				let newlimit = 4;
				
				// Get newest content	
				blog.getFeed(newcontent, newlimit);
			});
		} else {
			// IF USER FEED
			axios.get('/feedcontent', {
				params: {
					login: pagename
				}
			})
			.then(function(res) {
				let newcontent ;

				if (res.data.local>4){
					newcontent = (res.data.total - 4);
					
				} else {
					newcontent = (res.data.total);
				}
					let newlimit = 4;
					blog.getMyFeed(newcontent, newlimit);
			});
		}
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
				
				blog.offset = Number(blog.offset) + 1;
				blog.limit = Number(blog.limit) + 1;

				if (pagename == 'feed') {
					blog.getFeed(blog.offset, blog.limit);
				} else {
					blog.getMyFeed(blog.offset, blog.limit);
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

// ====================================================================================================