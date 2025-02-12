document.addEventListener("DOMContentLoaded", () => {
    let summaryElement = document.getElementById("summary");
    let readButton = document.getElementById("readSummary");

    chrome.storage.local.get("summary", (data) => {
        if (data.summary) {
            summaryElement.textContent = data.summary;
            readButton.style.display = "block";
            readSummaryAloud(data.summary);
        } else {
            summaryElement.textContent = "No summary available.";
            readButton.style.display = "none";
        }
    });

    readButton.addEventListener("click", () => {
        let summaryText = summaryElement.textContent.trim();
        if (summaryText && summaryText !== "No summary available.") {
            speechSynthesis.cancel();
            readSummaryAloud(summaryText);
        }
    });
});

function readSummaryAloud(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
}
