## Chrome Extension MVP: AI Content Generator

### Overview:

A minimalistic Chrome extension that generates context-aware replies directly from selected text on platforms like X.com (Twitter). The reply generation will consider distinct personalities, representing your business (Monsoft Solutions), your product (VernisAI), or yourself.

### Key Features:

- **Text Selection:** Users highlight text from a tweet.
- **Personality Selection:** Dropdown or toggles to choose between Monsoft Solutions, VernisAI, or personal voice.
- **Content Generation:** Automatically generates a reply based on the selected text and chosen personality.
- **Direct Reply Input:** Generated content is displayed with an option to copy directly to the reply input.

### UI/UX Requirements:

- **Minimalistic Popup:** Simple, clean interface activated upon selecting text and clicking the extension icon.
- **Clear Labels:** Easily understandable options ("Generate Reply," personality selector, copy button).

### Technical Approach (MVP):

- **Extension Components:**
  - Content Script: Captures selected text.
  - Popup Interface: Personality selection and reply display.
- **Local AI Processing:** For MVP, use integrated JavaScript-based inference (like lightweight local models or directly API-calls to OpenAI).

### MVP Implementation Steps:

1. **Create Basic Chrome Extension Structure** (manifest.json, popup.html, popup.js, contentScript.js).
2. **Implement Text Capture from Page** using Chrome content scripts.
3. **Develop Popup UI:** personality selection, display generated reply, copy-to-clipboard.
4. **Integrate AI Generation:** Initially use direct API calls to OpenAI or a simplified local inference solution.

### Next Steps (Beyond MVP):

- Connect extension to a scalable backend API for robust content generation.
- Add support for multiple platforms (LinkedIn, Instagram, Facebook).
- Implement authentication and account settings to manage personalities dynamically.

This approach ensures quick development, testing of core functionalities, and sets the groundwork for future scalability.
