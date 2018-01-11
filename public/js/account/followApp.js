// 1. Show Followers
// 2. Show Following
// 3. Make designed(html/css, clickable bars)
// 4. Make pages and ajax loading('more' button)
// DONE

Vue.component('followers-list', {
	template: '#followersList_template',
	props: ['followers'],
});

Vue.component('follows-list', {
	template: '#followsList_template',
	props: ['follows'],
});

let followApp = new Vue({
	el: '#followApp',
	data: {
		owner: '',
		followers: [],
		follows: [],
		followersLength: 0,
		followsLength: 0,
		followsOffset: 0,
		followersOffset: 0,
		followsPerPage: 4,
		followersPerPage: 4,
	},
	methods: {
		getFollowList: function() {
			let url = '/api/follows?list=all'; 
			let owner = this.owner;
			
			// get followers/follows list from db
			axios.get(url)
			.then(function(res) {
				let filteredFollowers = _.filter(res.data, { 'target' : owner, 'statusF' : true }); // lodash filter followers only
				let filteredFollows = _.filter(res.data, { 'follower' : owner, 'statusF' : true }); // filter follows

				followApp.followers = filteredFollowers.slice(followApp.followersOffset, followApp.followersPerPage);
				followApp.follows = filteredFollows.slice(followApp.followsOffset, followApp.followsPerPage);

				followApp.followersLength = filteredFollowers.length;
				followApp.followsLength = filteredFollows.length;
			})
		},
		// sorry for shit codding //
		prevFollows: function() {	
			if (this.followsOffset > 0) {
				this.followsOffset = this.followsOffset - 4;
				this.followsPerPage = this.followsPerPage - 4;
				
				this.getFollowList();				
			}
		},
		nextFollows: function() {
			if (this.followsOffset < this.followsLength) {
				this.followsOffset += 4;
				this.followsPerPage += 4;

				this.getFollowList();
			}
		},
		prevFollowers: function() {
			if (this.followersOffset > 0) {
				this.followersOffset = this.followersOffset - 4;
				this.followersPerPage = this.followersPerPage - 4;
				
				this.getFollowList();							
			}
		},
		nextFollowers: function() {
			if (this.followersOffset < this.followersLength) {
				this.followersOffset += 4;
				this.followersPerPage += 4;
				
				this.getFollowList();				
			}
		},
		// really, sorry //
	},
	created: function() {
		this.owner = $("#login").text();
		
		this.getFollowList();
	}
})