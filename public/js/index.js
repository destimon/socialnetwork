// Create Request

function CreateRequest() {
	var Request = false;

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
  var Request = CreateRequest();

  if (!Request) return;

  Request.onreadystatechange = function() {
    if (Request.readyState == 4) 
      r_handler(Request);
  }

  // is there get?
  if (r_method.toLowerCase() == 'get' && r_args.length > 0) 
    r_path += '?' + r_args;

  // Init connect
  Request.open(r_method, r_path, true);

  if (r.method.toLowerCase() == "post") {
    // POST
    Request.setRequestHeader('ContentType', 'application/x-www-form-urlencoded; charset=utf8');
    Request.send(r_args);
  } else {
    // GET
    Request.send(null);
  }
}