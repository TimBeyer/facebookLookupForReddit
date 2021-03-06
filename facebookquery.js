// Facebook query v. 2.0
// 
// Changelog:
//
// v 1.1	Fixed bug that prevented the info fields from being disabled 
//		if the mouse was moving too fast over the user names
// v 1.2	Fixed severe bug that prevented finding the user without reddit enhancement suite installed
//
// v 2.0  Re-wrote script to use a background page that does the cross-origin requests
//        after the hole in the permission system that I used was closed 
//        and the script stopped working
//        Also eliminated jQuery dependency
//
// v 2.1  Re-added jQuery for the event delegation 
//        Should fix a memory leak 
//        Also finally wrapped the code in an anonymous function
//
// Read public facebook information based on usernames

(function(){

  // The currently used item
  var currentItem = {};
  // The event that caused the data request
  var currentEvent = {};
  //
  var currentUserData = {};
  // the authors
  var authors = {};
  // the x and y position of the mouse
  // the event handler automatically updates the coordinates
  var x,y;
  document.body.onmousemove = function(e){x = e.pageX; y = e.pageY;updateInfoFieldPosition();};

  var showField = false;
  // The information field
  var infoField = document.createElement('div');
  document.body.appendChild(infoField);


  $(function(){
    $('.content').on('mouseover','a.author', function(e){
      console.log('mouseover',e.target);
      showField = true;
      requestData(e.target);
      e.target.addEventListener('mouseout', function hideField(e){
        showField = false;
        e.target.removeEventListener(hideField);
      });
    })
  });

  //Requests data from facebook
  function requestData(item){
    currentItem = item;
    var username = item.innerText;
    //console.log("Looking up", username);
    chrome.extension.sendMessage({username: username}, function(response) {
      var json = response.userData;
      if(!json.error){
       currentUserData = json;
       updateInfoContent();
      }
      else{
        currentUserData = {noResult:1};
        updateInfoContent();
      }
    });
  }



  function updateInfoFieldPosition(){
      var style = '';
      
      if(showField){
        style += 'position: absolute;';
        style += 'left: ' + (x+15) + 'px ;';
        style += 'top: ' + (y-20) + 'px ;';
        style += 'display: block;';
        style += 'border: 1px solid black;';
        style += 'padding: 3px;';
        style += 'z-index: 100;';
        style += 'background-color: white;';
        style += 'border-radius: 5px;';
        style += '-webkit-box-shadow: rgba(0,0,0,0.4) 3px 3px 5px;';
      }
      
      else{
        style += 'visibility: hidden;';
      }
            
      infoField.setAttribute('style',style);
  }

  //Update the information field
  function updateInfoContent(){
      var data = currentUserData;
      var html = '';
      
      if(showField){
        if(data.noResult)
  	      html += '<b> No Facebook Results found for ' + currentItem.innerText + '</b><br>';
        else
  	      html += '<b> Potential Facebook Match found for ' + currentItem.innerText + '</b><br>';
        
        if(data.id)
  	      html += 'ID: ' + data.id + '<br>';
        if(data.first_name)
  	      html += 'First Name: ' + data.first_name + '<br>';
        if(data.middle_name)
  	      html += 'Middle Name: ' + data.middle_name + '<br>';
        if(data.last_name)
  	      html += 'Last Name: ' + data.last_name + '<br>';
        if(data.gender)
  	      html += 'Gender: ' + data.gender + '<br>';
        if(data.link)
  	      html += 'Link: ' + data.link + '<br>';
        if(data.website)
  	      html += 'Website: ' + data.website + '<br>';
        if(data.locale)
  	      html += 'Locale: ' + data.locale + '<br>';
      }
      
      infoField.innerHTML = html;
      updateInfoFieldPosition();
  }

}());
