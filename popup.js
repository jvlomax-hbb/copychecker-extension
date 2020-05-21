// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Should edit this so it controls the popup window with analysis of the page and a button that says "analyze page"

// This calls the analyze function

function updateContentText(){
  console.log("update text");
  chrome.storage.local.get("contentText", function(result){
      conentDiv = document.getElementById("contentDiv");
      console.log(result)
      contentDiv.innerHTML = result.contentText;
  });
};

function updateCounterText() {
  chrome.storage.local.get('counters', function(result) {
    if(!result){
      return;
    }
    if(result.hasOwnProperty("counters")){
      let formattedScore = document.getElementById('displayScore');
      const values = Object.values(result.counters);
      for (i=0; i<values.length; i++) {
        let child = document.createElement('li');
        child.innerHTML = values[i];
        formattedScore.appendChild(child);
      }
    }else{
      document.getElementById('displayScore').innerHTML = "";
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.event == "countersUpdated"){
      updateCounterText();
    }
    if(request.event == "contentUpdated"){
      updateContentText();
    }
    
});

document.getElementById('analyze').onclick = function() {
  // Tell the content_script to do all the work
  chrome.storage.local.remove("counters", function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {event: "analyze"});  
    });
  });
};
  

document.getElementById('clear').onclick = function() {
  chrome.storage.local.remove("counters", function(){
    updateCounterText();
  });
  
};
window.onload = function() {
  updateCounterText();
  updateContentText();
};