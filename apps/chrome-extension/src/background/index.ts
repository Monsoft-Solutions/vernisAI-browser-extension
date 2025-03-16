import { Message, SelectedText, UseReplyPayload } from "../types";

// Store the most recently selected text
let currentSelectedText: SelectedText | null = null;

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.type === "TEXT_SELECTED") {
      // Save the selected text
      currentSelectedText = message.payload as SelectedText;

      // Update the extension icon
      chrome.action.setBadgeText({ text: "!" });
      chrome.action.setBadgeBackgroundColor({ color: "#4285F4" });
    } else if (message.type === "GET_SELECTED_TEXT") {
      // Return the selected text to the popup
      sendResponse(currentSelectedText);
    } else if (message.type === "USE_REPLY") {
      // Forward the reply text to the content script
      const payload = message.payload as UseReplyPayload;
      const { text } = payload;
      const tabId = sender.tab?.id;

      if (tabId) {
        chrome.tabs.sendMessage(tabId, {
          type: "FILL_REPLY_FIELD",
          payload: { text },
        } satisfies Message);

        // Clear the badge
        chrome.action.setBadgeText({ text: "" });
      }
    }

    return true;
  },
);

// Clear badge when popup is opened (happens automatically with default_popup)

// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  console.log("VernisAI Extension installed");

  // Clear badge
  chrome.action.setBadgeText({ text: "" });
});

// When a tab is updated, clear the badge for that tab
chrome.tabs.onUpdated.addListener((_, changeInfo) => {
  if (changeInfo.status === "complete") {
    chrome.action.setBadgeText({ text: "" });
    currentSelectedText = null;
  }
});
