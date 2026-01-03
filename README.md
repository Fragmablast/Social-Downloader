# 📥 Social Video Downloader - Premium All-in-One Solution

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-Ready-success?style=for-the-badge)

A professional, high-performance web application designed to download videos from major social platforms (Facebook, TikTok, Instagram, YouTube, Twitter/X, etc.) in **HD/4K quality**. This project features a stunning **"Cream & Olive"** aesthetic UI and a **robust backend** that automatically handles API rate limits.

---

## ✨ Features

- **🚀 Universal Support**: Download videos from Facebook, TikTok, Instagram, YouTube, Twitter, Pinterest, and more.
- **🚫 Watermark Remover**: Automatically downloads TikToks and Reels **without watermarks**.
- **🛡️ Robust Fallback System**: Intelligent backend that rotates between **3 Unique API Keys**. If one server is busy or quota is reached, it automatically switches to the next one instantly.
- **🎨 Premium UI/UX**:
  - Beautiful "Cream & Olive" light theme.
  - Fully functional **Dark Mode**.
  - Glassmorphism effects and smooth transitions.
- **📱 Fully Responsive & PWA**: Works perfectly on Mobile, Tablet, and Desktop. Can be installed as a Native App (PWA).
- **📦 Batch Downloading**: Paste multiple links (one per line) to download them all at once.
- **🎵 Audio Visualizer & Extractor**: Convert video to MP3 and preview it with a live audio visualizer.
- **📂 Smart History**: Automatically saves your recent downloads locally.

---

## 🛠️ Tech Stack

- **Core**: HTML5, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN/Configuration)
- **Icons**: Remix Icons
- **API**: [Social Download All-in-One](https://rapidapi.com/social-download-all-in-one/api/social-download-all-in-one) (RapidAPI)

---

## 🚀 How to Run

1. **Clone the Repository**

   ```bash
   git clone https://github.com/YourUsername/Social-Downloader.git
   ```
2. **Open the Project**

   - Simply open `index.html` in your browser.
   - Or run with a live server:
     ```bash
     npx serve .
     ```
3. **API Configuration**

   - The project comes with a pre-configured key pool in `script.js`.
   - To add your own keys, edit the `APP_CONFIG` object:
     ```javascript
     const APP_CONFIG = {
       apiKeys: ["YOUR_KEY_1", "YOUR_KEY_2", "YOUR_KEY_3"],
     };
     ```

---

## 📸 Screenshots

_(Add your screenshots here)_

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](issues).

## 📝 License

This project is [MIT](LICENSE) licensed.
