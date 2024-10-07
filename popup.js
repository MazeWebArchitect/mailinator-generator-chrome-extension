document.addEventListener('DOMContentLoaded', () => {
    try {
        chrome.storage.local.get('generatedMailinatorMailboxes', (data) => {
            const emails = data.generatedMailinatorMailboxes || [];
            const emailTableBody = document.getElementById('emailTableBody');
            const errorMessageElement = document.getElementById('errorMessage');

            if (emails.length === 0) {
                emailTableBody.innerHTML = '<tr><td colspan="3">No emails generated yet.</td></tr>';
            } else {
                emails.forEach((entry) => {
                    const tr = document.createElement('tr');

                    const mailinatorUrl = `https://www.mailinator.com/v4/public/inboxes.jsp?to=${entry.email}`;

                    tr.innerHTML = `
                        <td>${entry.email}</td>
                        <td><a href="${entry.url}" target="_blank">${entry.url}</a></td>
                        <td><a href="${mailinatorUrl}" target="_blank" title="Go to Mailinator">&#x1F4EB;</a></td>
                    `;
                    emailTableBody.appendChild(tr);
                });
            }
        });
    } catch (error) {
        const errorMessageElement = document.getElementById('errorMessage');
        errorMessageElement.textContent = 'Error loading emails: ' + error.message;
    }
});
