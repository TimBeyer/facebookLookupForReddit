chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	//console.log("Received message", request, sender);
    if (request.username){
    	var url = 'https://graph.facebook.com/' + (request.username);
    	var xhr = new XMLHttpRequest();
  		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
		    if (xhr.readyState == 4) {
		      // innerText does not let the attacker inject HTML elements.
		      //console.log(xhr.responseText);
		      sendResponse({'userData': JSON.parse(xhr.responseText)});
		    }
		}
		xhr.send();
    }
    return true;
});