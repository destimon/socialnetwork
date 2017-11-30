function postFunc() {
		$.ajax({
			type: "POST",
			url: "/feednew",
			success: function(data) {
				console.log(JSON.stringify(data))
				alert('Posted', data);
			}
		});  
}

function getFunc() {
		$.ajax({
		  type: "GET",
		  url: '/feeds',
		  success: function(data) {
		  	console.log(JSON.stringify(data));
		  	alert('Geted', JSON.stringify(data));
		  }
		});
}