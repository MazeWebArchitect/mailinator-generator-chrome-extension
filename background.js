chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generateMailinatorEmail",
    title: "Generate Mailinator Email",
    contexts: ["editable"]
  });
  chrome.storage.local.set({ generatedMailinatorMailboxes: [] });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "generateMailinatorEmail") {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const length = Math.floor(Math.random() * 3) + 16;
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const numberOfDashes = Math.floor(Math.random() * 6) + 1;
        for (let i = 0; i < numberOfDashes; i++) {
            const dashPosition = Math.floor(Math.random() * (randomString.length - 2)) + 1;
            randomString = randomString.slice(0, dashPosition) + '-' + randomString.slice(dashPosition);
        }

        const generatedEmail = randomString + '@mailinator.com';

        const url = new URL(tab.url);
        const domain = url.origin;

        chrome.storage.local.get("generatedMailinatorMailboxes", (data) => {
            const updatedEmails = data.generatedMailinatorMailboxes || [];
            updatedEmails.push({ email: generatedEmail, url: domain });
            chrome.storage.local.set({ generatedMailinatorMailboxes: updatedEmails });
        });

        if (tab && tab.id) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            }, () => {
                chrome.tabs.sendMessage(tab.id, { action: 'fillEmail', email: generatedEmail });
            });
        }
    }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get("generatedMailinatorMailboxes", (data) => {
    const emails = data.generatedMailinatorMailboxes || [];
    let emailList = "Generated Emails:\n\n";
    emails.forEach((entry) => {
      emailList += `Email: ${entry.email}\nURL: ${entry.url}\n\n`;
    });
    alert(emailList);
  });
});
