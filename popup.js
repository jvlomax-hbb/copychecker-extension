// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Should edit this so it controls the popup window with analysis of the page and a button that says "analyze page"

// This calls the analyze function

function updateContentText(){
  console.log("update text");
  chrome.storage.local.get("contentText", function(result){
      
      conentDiv = document.getElementById("contentDiv");
      hr = document.getElementById("pageDivider");
      if(typeof result.contentText !== 'undefined'){
        hr.classList.remove("hidden");
        contentDiv.innerHTML = result.contentText;
      }else{
        hr.classList.add("hidden");
      }
     
  });
};

function updateResultsText() {
  chrome.storage.local.get('results', function(result) {
    if(!result){
      return;
    }
    if(result.hasOwnProperty("results")){
      let formattedScore = document.getElementById('displayScore');
      const values = Object.values(result.results);
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

function clear_data(){
  chrome.storage.local.remove("results", function(){
    updateResultsText();
   
  });
  chrome.storage.local.remove("contentText", function(){
    updateContentText();
  });
}

/* BUTTON HANDLERS */
document.getElementById('clear').onclick = function() {
  clear_data();
};


document.getElementById('analyze').onclick = function() {
  // Tell the content_script to do all the work
  chrome.storage.local.remove("results", function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {event: "analyze"});  
    });
  });
};
  
/* EVENT LISTENERS */
window.onload = function() {
  updateResultsText();
  updateContentText();
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.event == "resultsUpdated"){
    updateResultsText();
  }
  if(request.event == "contentUpdated"){
    updateContentText();
  }
  
});