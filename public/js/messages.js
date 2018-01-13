"use strict";

let socket = io();

let username = $("#user").val;

Vue.component('dialogues-list', {
	template: '#dialoguesList_template',
	props: ['dialogues'],
	methods: {
		clickDialogue: function(t) {
			chat.selectDialogue(t);
		}
	}
});

Vue.component('messages-list', {
	template: '#messageList_template',
	props: ['messages'],
	methods: {
		defineAuthor: function(u) {
			if (u == chat.user) return true;
			else return false;
		}
	}
})

let chat = new Vue({
	el: '#chat',
	data: {
		user: '',
		dialogues: [],
		messages: [],
		loader: true
	},
	methods: {
		fetchDialogues: function() {
			let url = '/api/messages';
			this.loader = true;

			axios.get(url)
			.then(function(res) {
				console.log(res.data);
				chat.dialogues = res.data;
				chat.loader = false;
			})
		},
		selectDialogue: function(target) {
			let fetchMessages = _.find(this.dialogues, { 'userTwo' : target }) 
			this.messages = fetchMessages.messages; 		
		}
	},
	created: function() {
		this.user = $("#user").val();

		this.fetchDialogues();
	}
})