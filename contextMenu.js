function onContextClick(info, tab) {
    console.log("on click");
    chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { event: "analyze" }
            );
        }
    );
}

chrome.contextMenus.create({
    title: 'Copy check selection',
    contexts: ['selection'],
    onclick: onContextClick,
    visible: true
});


chrome.tabs.onActiveChanged.addListener(function(tabId){
    chrome.storage.local.remove("results", function(){
        chrome.runtime.sendMessage( { event: "resultsupdated" });
     
    });
    chrome.storage.local.remove("contentText", function(){
        chrome.runtime.sendMessage({ event: "contentUpdated" });
    });

    // if the active page is currently known to be annotated, we refresh it
    chrome.storage.local.get("annotatedPage", function(result){
        if(typeof result.annotatedPage != "undefined"){
            chrome.tabs.get(tabId, function(tab){
                if(tab.url == result.annotatedPage && typeof tab.url != "undefined"){
                    chrome.tabs.reload();
                    chrome.storage.local.remove("annotatedPage");
                }
            });
        }
    });
  });