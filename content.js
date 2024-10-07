chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fillEmail') {
        console.log('Generated email:', message.email);
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT' && (activeElement.type === 'email' || activeElement.type === 'text')) {
            activeElement.value = message.email;
            sendResponse({ status: "success" });
        }
    }
});