Vue.component('pagination', {
	template: '#paginationEl',
	props: ['pages'],
	methods: {
		changePage: function(page) {
			app.currPage = page;
			app.showUsers(page);
		}
	}
});


