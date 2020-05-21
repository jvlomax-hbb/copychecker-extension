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
