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

function SendRequest(r_method, r_path, r_args, r_handler) {
  let ajax = CreateRequest();

  if (!ajax) return;

  ajax.onreadystatechange = function() {
    if (ajax.readyState == 4) 
      r_handler(ajax);
  }

  // is there get?
  if (r_method.toLowerCase() == 'get' && r_args.length > 0) 
    r_path += '?' + r_args;

  // Init connect
  ajax.open(r_method, r_path, true);

  if (r_method.toLowerCase() == "post") {
    // POST
    ajax.setRequestHeader('ContentType', 'application/x-www-form-urlencoded; charset=utf8');
    ajax.send(r_args);
  } else {
    // GET
    ajax.send(null);
  }

  console.log(r_path);
}

function addUser() {
  
  ajax.onreadystatechange = function() {
    console.log(ajax.readyState, ajax.response, ajax.status);
    if (ajax.readyState === 4 && ajax.status === 200) { 
      let goveoel = document.getElementById('goveo');
      goveoel.innerHTML = "";
    }
  }

  ajax.open('get', '/usr/asdf');
  ajax.send();   


  
}