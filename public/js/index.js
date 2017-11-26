
function CreateRequest() {
	var Request = false;

	if (window.XMLHttpRequest) {
		// GECKO
		Request = new XMLHttpRequest();
	} else if (ActiveXObject) {
		// IE
		try {
			Request = new ActiveXObject("Microsoft.XMLHTTP");
		}
    catch(CatchException) {
      Request = new ActiveXObject("Msxm12.XMLHTTP");
    }
	}

  if (!Request) {
    alert('ERROR XMLHttpRequest');
  }

  return Request;
}