"use strict";

// $(function () {
// 	let socket = io();
	
// 	$('form').submit(function(){
// 	  socket.emit('chat message', $('#m').val());
// 	  $('#m').val('');
// 	  return false;
// 	});

// 	socket.on('connected', function(msg) {
// 		$('#messages').append($('<li>').text(msg));
// 	});

// 	socket.on('disconnected', function(msg) {
// 		$('#messages').append($('<li>').text(msg));
// 	});

//   socket.on('chat message', function(msg){
//   	$('#messages').append($('<li>').text(msg));
// 	});

// });

let socket = io();

Vue.component('msg-item', {
	props: ['msglist'],
	template: '#message_box'
});

let model = [];

let app = new Vue({
	el: '#app',
	data: {
		msglist: model,
		username: ' ' 
	},
	methods: {
		sendMessage: function() {
			let getuser = $("#username").val() + ':';
			let getmessage = $("#m").val();
      let date_now = new Date();

	    date_now = date_now.getHours() + ':' + date_now.getMinutes() + '.' + date_now.getSeconds();
	    // let avatarlink = '/usr/' + req.user.login + '/avatar';

			let prevModelObj = {
				user: getuser,
				text: getmessage,
				date: date_now,
				color: ' '
			};

			pushMessage(prevModelObj);
		}
	},
	created: function() {
		let getuser = $("#username").val();
		this.username = getuser;	
		
		// send nickname who connects		
	  socket.emit('connect message', getuser);

	  $(function () {
			socket.on('chat message', function(msg) {
				let getuser = $("#username").val();
				model.push(msg);
				console.log(msg.text);
			});
		});

	  // get this nickname+'connected'
		socket.on('connect message', function(msg) {
			let modelObj = { 
				user: msg,
				text: ' connected'
			};

		 	model.push(modelObj);
		});
	}
});
	
function pushMessage(prevObj) {
	socket.emit('chat message', prevObj);
	$('#m').val('');
};