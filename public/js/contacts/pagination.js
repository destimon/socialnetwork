Vue.component('pagination', {
	template: '#paginationEl',
	props: ['pages'],
	methods: {
		changePage: function(page) {
			app.currPage = page;
			app.showUsers(page);
		},
		prevPage: function() {
			if (app.currPage > 1) {
				app.currPage -= 1;
				app.showUsers(app.currPage);
			}
		},
		nextPage: function() {
			if (app.currPage < app.totalPages) {
				app.currPage += 1;
				app.showUsers(app.currPage);
			}
		}
	},
	computed: {
		isCurrent: function() {
			let wClass = 'list-group-item';
			console.log(this.pages);


			// if (page == app.currPage)
			// 	wClass = (wClass + ' active');

			return wClass;
		}
	}
});
