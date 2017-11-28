"use strict"

// Create Request

function CreateRequest() {
	let Request = false;

  console.log('CreateRequest()');
	if (window.XMLHttpRequest) {
		// GECKO
		Request = new XMLHttpRequest();
	} else if (ActiveXObject) {
		// IE
		try {
			Request = new ActiveXObject('Microsoft.XMLHTTP');
		}
    catch(CatchException) {
      Request = new ActiveXObject('Msxm12.XMLHTTP');
    }
	}

  if (!Request) {
    alert('ERROR XMLHttpRequest');
  }

  return Request;
}

// Send Request

function SendRequest(a_method, a_path, a_args, a_handler) {
  let ajax = CreateRequest();

  if (!ajax) return;

  ajax.onreadystatechange = function() {
    if (ajax.readyState == 4 && ajax.status == 200) 
      a_handler(ajax);
  }

  // is there get?
  if (a_method.toLowerCase() == 'get' && a_args.length > 0) 
    a_path += '?' + a_args;

  // Init connect
  ajax.open(a_method, a_path, true);

  if (a_method.toLowerCase() == "post") {
    // POST
    ajax.setRequestHeader('ContentType', 'application/x-www-form-urlencoded; charset=utf8');
    ajax.send(a_args);
  } else {
    // GET
    ajax.send(null);
  }

  console.log(a_path);
}



let model = {
  posts : [],
  smth: ""
};

window.addEventListener('load', function() {
  let createForm = document.getElementById('create_post_form');
  createForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submit', createForm.feedpost.value);

    createFeedPost({
      info: createForm.feedpost.value  
    });
    
  });
});

function createFeedPost(postvalue) {
  let ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(ajax.readyState===4 && ajax.status===200) {
      console.log(ajax.readyState, ajax.response, ajax.status);
      let postvalueObj = JSON.parse(ajax.response);
      model.posts.push(postvalueObj);
      renderPosts();

      console.log(postvalueObj);
    }
  };

  ajax.open('POST', '/newfeed');
  ajax.setRequestHeader("Content-type", "application/json");
  ajax.send(JSON.stringify(postvalue));
}

function renderPosts() {
  let postlist = document.createElement('ul');
  postlist.className = "list-group";
  postlist.setAttribute('id', 'posts');
}