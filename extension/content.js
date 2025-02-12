chrome.storage.local.get("selectedText", async (data) => {
    if (data.selectedText) {
        console.log("Content script received selected text:", data.selectedText);
        
        try {
            const response = await fetch("http://127.0.0.1:5000/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: data.selectedText })
            });

            const result = await response.json();
            
            if (result.summary) {
                chrome.storage.local.set({ summary: result.summary }, () => {
                    chrome.action.openPopup();
                });
            } else {
                alert("Summarization failed.");
            }
        } catch (error) {
            console.error("Error fetching summary:", error);
            alert("Failed to get summary.");
        }
    }
});
