import { Message, SelectedText } from '../types';

let selectedText = '';

// Listen for text selection events
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    selectedText = selection.toString().trim();
    
    // Send message to background script
    chrome.runtime.sendMessage({
      type: 'TEXT_SELECTED',
      payload: {
        text: selectedText,
        sourceUrl: window.location.href
      } as SelectedText
    } satisfies Message);
  }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === 'FILL_REPLY_FIELD') {
    const { text } = message.payload;
    insertTextIntoReplyField(text);
  }
  return true;
});

// Helper function to insert text into the reply field
function insertTextIntoReplyField(text: string): void {
  // Find the active reply field
  let replyField = null;
  
  // Handle Twitter/X.com
  if (window.location.hostname.includes('twitter.com') || window.location.hostname.includes('x.com')) {
    // Find focused textbox or text area
    const focused = document.activeElement;
    if (focused && (focused.tagName === 'TEXTAREA' || focused.tagName === 'INPUT' && (focused as HTMLInputElement).type === 'text')) {
      replyField = focused;
    } else {
      // Find any visible reply field
      const textareas = document.querySelectorAll('div[contenteditable="true"], textarea');
      for (let i = 0; i < textareas.length; i++) {
        const element = textareas[i];
        const htmlElement = element as HTMLElement;
        if (htmlElement.offsetHeight > 0 && htmlElement.offsetWidth > 0) {
          replyField = element;
          break;
        }
      }
    }
  }
  
  if (replyField) {
    // Different handling based on element type
    if (replyField.tagName === 'TEXTAREA' || replyField.tagName === 'INPUT') {
      const inputElement = replyField as HTMLInputElement;
      inputElement.value = text;
      
      // Trigger input event to update character count
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(inputEvent);
    } else if (replyField instanceof HTMLElement) {
      // For contenteditable div
      replyField.innerHTML = '';
      replyField.textContent = text;
      
      // Trigger input event
      const inputEvent = new Event('input', { bubbles: true });
      replyField.dispatchEvent(inputEvent);
    }
  }
}