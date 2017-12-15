Vue.component('user-list', {
  template: '#userEl',
  props: ['users']
});

let app = new Vue({
  el: "#users",
  data: {
    currPage: 1,
    pages: [],
    users: [],
    search: '',
    status: null
  },
  watch: {
    search: function(string) {
      this.status = 'Searching...';
      this.showUsers();
    }
  },
  methods: {
    showUsers: _.debounce(
      function(page) {
        axios.get('/api/users', {
          params: {
            p: page
          }
        })  
        .then(function(res) {
          let filter = _.filter(res.data.docs, function(i) {
            let match = i.login.match(app.search);
            return match;
          });

          app.users = filter;
          app.status = '';
        })
        .catch(function(error) {
          app.status = 'Failed with error ' + error;
        })
      },
      500
    )
  },
  created: function() {
    this.showUsers(this.currPage);
  }
});
