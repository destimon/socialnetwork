let tp = new Vue({
  el: '#toolPanel',
  data: {
    user: '',
    target: '',
    isFollow: false,
    isDisabled: 'btn btn-primary'
  },
  methods: {
    checkFollow: function(target) {
      let url = '/api/follows?target=' + target;

      // get status from db
      axios.get(url)
      .then(function(res) {
        tp.user = res.data.follower; // get you from backend
        tp.isFollow = res.data.statusF; // set follow status
      })
      .catch(function(err) {
        console.log(err);
      });
    },
    followUser: function() {
      let url = '/api/follows';
      this.isDisabled = 'btn btn-primary disabled';

      // post status to db
      axios.post(url, {
        target: tp.target
      })
      .then(function(res) {
        tp.checkFollow(tp.target);
        tp.isDisabled = 'btn btn-primary';
        followApp.getFollowList(); // UPDATE FOLLOWERS LIST
      })
      .catch(function(err) {
        console.log(err);
      });
    },
    sendMessage: function() {
      let url = '/api/messages';
      
      // post new dialogue
      axios.post(url, {
        to: tp.target
      })
      .then(function(res) {
        window.location.href = "/messages";  
      })
    }
  },
  created: function() {
    this.target = document.location.href.match(/[^\/]+$/)[0]; // him

    this.checkFollow(this.target);
  },
  computed: {
    buttonName: function() {
      if(this.isFollow == true) {
        return this.buttonStatus = 'Unfollow';
      }
      else {
        return this.buttonStatus = 'Follow';
      }
    }
  }
});

