"use strict"

// // Create Request

// function CreateRequest() {
// 	let Request = false;

//   console.log('CreateRequest()');
// 	if (window.XMLHttpRequest) {
// 		// GECKO
// 		Request = new XMLHttpRequest();
// 	} else if (ActiveXObject) {
// 		// IE
// 		try {
// 			Request = new ActiveXObject('Microsoft.XMLHTTP');
// 		}
//     catch(CatchException) {
//       Request = new ActiveXObject('Msxm12.XMLHTTP');
//     }
// 	}

//   if (!Request) {
//     alert('ERROR XMLHttpRequest');
//   }

//   return Request;
// }

// // Send Request

// function SendRequest(a_method, a_path, a_args, a_handler) {
//   let ajax = CreateRequest();

//   if (!ajax) return;

//   ajax.onreadystatechange = function() {
//     if (ajax.readyState == 4 && ajax.status == 200) 
//       a_handler(ajax);
//   }

//   // is there get?
//   if (a_method.toLowerCase() == 'get' && a_args.length > 0) 
//     a_path += '?' + a_args;


//   // Init connect
//   ajax.open(a_method, a_path, true);

//   if (a_method.toLowerCase() == "post") {
//     // POST
//     ajax.setRequestHeader('ContentType', 'application/x-www-form-urlencoded; charset=utf8');
//     ajax.send(a_args);
//   } else {
//     // GET
//     ajax.send(null);
//   }

//   console.log(a_path);
// }




let model = {
  posts: []
};

window.addEventListener('load', function() {
  let createFormEl = document.getElementById('create_post_form');
  createFormEl.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submit', createFormEl.text.value);
    createFeedPost({
      text: createFormEl.text.value
    });
  });

  requestFeedPost();
});

function createFeedPost(postvalue) {
  let ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(ajax.readyState === 4 && ajax.status === 200) {
      console.log(ajax.readyState, ajax.response, ajax.status);
      let postvalueObj = JSON.parse(ajax.response);
      model.posts.push(postvalueObj);
      renderPosts();
    }
  };

  ajax.open('POST', '/feednew');
  ajax.setRequestHeader("Content-type", 
    "application/json");
  console.log('postvalue: ', JSON.stringify(postvalue));
  ajax.send(JSON.stringify(postvalue));
}

function requestFeedPost() {
  let ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(ajax.readyState === 4 && ajax.status === 200) {
      let postvalueObj = JSON.parse(ajax.response);
      model.posts = postvalueObj;
      renderPosts();
    }
  };

  ajax.open('GET', '/feeds');
  ajax.send();
}

function renderPosts() {
  let appEl = document.getElementById('blog');
  appEl.innerText = "";
  let postlistEl = document.createElement('ul');
  postlistEl.className = "list-group";
  postlistEl.setAttribute('id', 'posts');
  appEl.appendChild(postlistEl);

  let posts = model.posts;
  console.log(posts);

  for(let post of posts) {
    console.log("POST: " + post);
    let postEl = document.createElement('li');
    postEl.className = "list-group-item";
    let postInfoEl = document.createElement('span');
    postInfoEl.innerText = post.text;
    postEl.appendChild(postInfoEl);
    postlistEl.appendChild(postEl);
  }
}