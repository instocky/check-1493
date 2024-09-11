chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: 'analyzeItemprops' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            chrome.storage.local.set({ analysisResult: response });
        }
    });
});