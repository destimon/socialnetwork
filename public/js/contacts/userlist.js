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
    status: null,
    loading: false
  },
  watch: {
    search: function(string) {
      this.status = 'Searching...';
      this.loading = true;
      this.showUsers(this.currPage);
    }
  },
  methods: {
    showUsers: _.debounce(
      function(page) {
        this.loading = true;
        axios.get('/api/users', {
          params: {
            p: page
          }
        })  
        .then(function(res) {
          let pageArray = [];
          let filter = _.filter(res.data.docs, function(i) {
            let match = i.login.match(app.search);
            return match;
          });
          app.users = filter;
          app.status = '';
          
          for (let i = 1; i <= (res.data.pages); i++) {
            pageArray.push(i);
          }
          app.pages = pageArray;
          app.loading = false;  
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
