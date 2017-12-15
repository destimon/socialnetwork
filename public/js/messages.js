"use strict";

let socket = io();

let messages = [];

// MSG LIST --------------------
Vue.component('msg-item', {
	props: ['msglist'],
	template: '#message_box'
});


// APP -------------------- -------------------- -------------------- -------------------- //
let app = new Vue({
	el: '#app',
	data: {
		msglist: messages,
		username: ' ' 
	},
	methods: {
		sendMessage: function() {
			let getuser = $("#username").val() + ':';
			let getmessage = $("#m").val();
      let date_now = new Date();

	    date_now = date_now.getHours() + ':' + date_now.getMinutes() + '.' + date_now.getSeconds();
	    // let avatarlink = '/usr/' + req.user.login + '/avatar';

			let prevMessagesObj = {
				user: getuser,
				text: getmessage,
				date: date_now,
				color: ' '
			};

			pushMessage(prevMessagesObj);
		}
	},
	created: function() {
		let getuser = $("#username").val();
		
	  socket.emit('connect message', getuser);
		
		// send nickname who connects		
		socket.on('chat message', function(msg) {
			let getuser = $("#username").val();
			messages.push(msg);
		});

	  // get this nickname+'connected'
		socket.on('connect message', function(msg) {
			let modelObj = { 
				user: msg,
				text: ' connected'
			};

			messages.push(modelObj);
		});
	}
});
	
// -------------------- -------------------- -------------------- -------------------- //

function pushMessage(prevObj) {
	socket.emit('chat message', prevObj);
	$('#m').val('');
};