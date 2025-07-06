# 🦅 ParamHawk - URL & Parameter Extractor (v1)

This is a basic Chrome Extension designed for bug bounty hunters and testers. It automatically extracts URL parameters (GET), POST body parameters, and JS file paths while you browse any website. Perfect for quick recon work.

---

## 📦 Features

- ✅ Extracts **GET** parameters from URL
- ✅ Captures **POST** request bodies
- ✅ Lists **JavaScript file** paths from the page
- ✅ Collects **request headers**
- ✅ Displays everything in a popup UI
- ✅ One-click **save to file** (organized)

---

## 📁 Files Included

ParamHawk/
│
├── manifest.json 
├── background.js 
├── content.js
├── popup.html 
├── popup.js
├── styles.css 
└── icons/ 


---

## 🔧 How to Install

1. Download the folder or clone this repo
2. Open Chrome and visit: `chrome://extensions/`
3. Turn ON "Developer Mode"
4. Click "Load unpacked" and select the `ParamHawk/` directory
5. Done! You’ll see the ParamHawk icon in your browser

---

## 🚀 How to Use

1. Browse any website
2. Click the ParamHawk icon
3. You will see:
   - ✅ All GET parameters
   - 📦 POST body content
   - 🧾 Headers
   - 📁 JS file URLs
4. Click "Save" to export data into a `.txt` file

---

## 📋 Permissions Used

| Permission | Reason |
|------------|--------|
| `webRequest` | Listen to POST and headers |
| `activeTab` | Inject scripts into the current tab |
| `<all_urls>` | Needed to access any page |

---

## 🛠 For Bug Bounty Use

Use this tool as a helper to identify:
- Hidden API endpoints
- Parameters for fuzzing
- Suspicious JavaScript paths
- Tokens and auth params in headers

---

## 🧠 Tips

- Open the popup after page is loaded
- Switch pages, it auto refreshes data
- Use in combination with tools like Burp, ParamSpider, etc.

---

**Author:** @0xnazmul 

**Version:** v1.0  
**License:** MIT

