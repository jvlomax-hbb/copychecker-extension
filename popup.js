// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Should edit this so it controls the popup window with analysis of the page and a button that says "analyze page"

// This calls the analyze function


function updateCounterText() {

  let formattedScore = document.getElementById('displayScore');
  
  chrome.storage.sync.get(['counters'], function(result) {
    const values = Object.values(result['counters']);
    for (i=0; i<values.length; i++) {
      let child = document.createElement('li');
      child.innerHTML = values[i];
      formattedScore.appendChild(child);
    }
  });
}

updateCounterText();

document.getElementById('analyze').onclick = function() {

  // Tell the content_script to do all the work
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      console.log('Stored value');
    });
  });  

}
