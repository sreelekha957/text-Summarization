chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarizeText",
        title: "Summarize Selected Text",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarizeText" && info.selectionText) {
        console.log("Selected text:", info.selectionText);
        
        chrome.storage.local.set({ selectedText: info.selectionText }, () => {
            if (tab.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["content.js"]
                }).catch(error => console.error("Script execution failed:", error));
            } else {
                console.error("No active tab found.");
            }
        });
    }
});
