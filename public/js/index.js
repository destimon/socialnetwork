// "use strict"

// let model = {
//   posts: []
// };

// window.addEventListener('load', function() {
//   let createFormEl = document.getElementById('create_post_form');
//   createFormEl.addEventListener('submit', function(e) {
//     e.preventDefault();
//     console.log('Form submit', createFormEl.text.value);
//     createFeedPost({
//       text: createFormEl.text.value
//     });
//   });

//   requestFeedPost();
// });

// function createFeedPost(postvalue) {
//   let ajax = new XMLHttpRequest();

//   ajax.onreadystatechange = function() {
//     if(ajax.readyState === 4 && ajax.status === 200) {
//       console.log(ajax.readyState, ajax.response, ajax.status);
//       let postvalueObj = JSON.parse(ajax.response);
//       model.posts.push(postvalueObj);
//       renderPosts();
//     }
//   };

//   ajax.open('POST', '/feednew');
//   ajax.setRequestHeader("Content-type", 
//     "application/json");
//   console.log('postvalue: ', JSON.stringify(postvalue));
//   ajax.send(JSON.stringify(postvalue));
// }

// function requestFeedPost() {
//   let ajax = new XMLHttpRequest();

//   ajax.onreadystatechange = function() {
//     if(ajax.readyState === 4 && ajax.status === 200) {
//       let postvalueObj = JSON.parse(ajax.response);
//       model.posts = postvalueObj;
//       renderPosts();
//     }
//   };

//   ajax.open('GET', '/feeds');
//   ajax.send();
// }

// function renderPosts() {
//   let appEl = document.getElementById('blog');
//   appEl.innerText = "";
//   let postlistEl = document.createElement('div');
//   postlistEl.className = "col-sm-4";
//   postlistEl.setAttribute('id', 'posts');
//   appEl.appendChild(postlistEl);

//   let posts = model.posts;
//   console.log(posts);

//   for(let post of posts) {
//     let postEl = document.createElement('blockquote');
//     let postInfoEl = document.createElement('h4');
    
//     postInfoEl.innerText = post.text;
//     postEl.appendChild(postInfoEl);
//     postlistEl.appendChild(postEl);
//   }
// }