/**
 * Social Video Downloader - All-in-One API Edition
 * Supports: TikTok, Facebook, Instagram, YouTube, Twitter, etc.
 * API: Social Download All-in-One (RapidAPI)
 */

// Config: Multi-Key Fallback System (Robust Architecture)
const APP_CONFIG = {
  // Pool of Keys: Primary + Fallbacks provided by User
  apiKeys: [
    "2eaacd4a9bmsh759a563f749387dp1bd14fjsn85f99e89867f", // Primary
    "5db327f060mshc0db01df2714bccp18358cjsn8c99107635d5", // Fallback 1
    "b8e805e7a0msh1f3e19cb0479105p1dc736jsn3f59ade5a5dc"  // Fallback 2
  ],
  endpoint: "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink",
};

// ... (Translations remain the same) ...

// Logic: Social API Fetch (Internal)
// NOTE: This now returns the parsed JSON or throws an error
async function fetchSocialData(videoUrl, apiKey) {
  // Config for API
  const response = await fetch(APP_CONFIG.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
      "x-rapidapi-key": apiKey,
    },
    body: JSON.stringify({ url: videoUrl }),
  });

  if (!response.ok) {
    // Try to read error message from body
    try {
      const errJson = await response.json();
      // Rate Limit Specifics
      if(response.status === 403 || response.status === 429) {
          throw new Error("RATE_LIMIT");
      }
      throw new Error(errJson.message || `HTTP ${response.status}`);
    } catch (e) {
      if(e.message === "RATE_LIMIT") throw e;
      throw new Error(`HTTP ${response.status}`);
    }
  }

  return await response.json();
}

/**
 * 2. Robust Retry & Fallback System
 * Iterates through API keys if one fails (Rate Limit/Quota Exceeded).
 */
async function fetchWithRetry(videoUrl) {
    const loadingText = document.getElementById("loadingStatus");
    const keys = APP_CONFIG.apiKeys;
    let lastError = null;

    // Try each key in the pool
    for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i];
        
        try {
            // Log which key we are using (for debugging)
            if(i > 0) console.log(`Switching to Fallback Key #${i+1}`);
            
            if(loadingText && i > 0) {
                 loadingText.innerText = `Server busy, switching to Key ${i+1}/${keys.length}...`;
            }

            const rawData = await fetchSocialData(videoUrl, currentKey);
            
            // SOFT ERROR CHECK:
            // Some APIs return 200 OK but with body { message: "Error..." }
            // We must check this here to trigger the retry logic!
            const item = rawData.result || rawData.data || rawData;
            if(userDataHasError(item)) {
                throw new Error("API_SOFT_FAIL: " + (item.message || "Unknown Error"));
            }

            return rawData; // Success!

        } catch (err) {
            console.warn(`Key #${i+1} failed:`, err);
            lastError = err;
            
            // If it's the last key, fail
            if (i === keys.length - 1) break;
            
            // Short delay before switching key
            await new Promise(res => setTimeout(res, 500));
        }
    }
    throw lastError || new Error("All servers are busy. Please try again later.");
}

function userDataHasError(item) {
    if(!item) return true;
    if(item.error) return true;
    if(item.message && !item.url && !item.medias) return true; // Suspicious message without data
    return false;
}



// Translations
const translations = {
    en: {
        app_title: "Social Video Downloader",
        app_subtitle: "Download HD Videos from FB, TikTok, Insta, YouTube & more.",
        placeholder_text: "Paste any video link here...",
        download_btn: "Download",
        fetching_info: "Fetching video info...",
        features_title: "✨ Why Choose Us?",
        feat_fast_title: "Super Fast",
        feat_fast_desc: "Lightning fast download speeds for all media formats.",
        feat_hd_title: "4K & HD Support",
        feat_hd_desc: "Download in crystal clear 4K, 1080p, or 720p resolution.",
        feat_safe_title: "100% Safe",
        feat_safe_desc: "No ads, no malware. Completely free and secure to use.",
        feat_devices_title: "All Devices",
        feat_devices_desc: "Works perfectly on iPhone, Android, PC, and Tablets.",
        feat_audio_title: "Audio Extractor",
        feat_audio_desc: "Convert video to high-quality MP3 audio instantly.",
        feat_watermark_title: "No Watermark",
        feat_watermark_desc: "Download TikTok and Reels without any annoying watermarks.",
        footer_text: "&copy; 2024 Social Video Downloader. Built with ❤️.",
        result_found: "Result Found",
        reset_btn: "Reset",
        save_thumb: "Save Thumb",
        video_formats: "Video Formats",
        audio_formats: "Audio Formats",
        error_title: "Error",
        success_title: "Success"
    },
    bn: {
        app_title: "সোশ্যাল ভিডিও ডাউনলোডার",
        app_subtitle: "ফেসবুক, টিকটক, ইনস্টাগ্রাম এবং ইউটিউব ভিডিও ডাউনলোড করুন সহজেই।",
        placeholder_text: "যেকোনো ভিডিওর লিঙ্ক দিন...",
        download_btn: "ডাউনলোড",
        fetching_info: "ভিডিওর তথ্য আনা হচ্ছে...",
        features_title: "✨ আমাদের বৈশিষ্ট্যসমূহ",
        feat_fast_title: "সুপার ফাস্ট",
        feat_fast_desc: "যেকোনো ভিডিও বা অডিও নিমেষেই ডাউনলোড করুন।",
        feat_hd_title: "4K এবং HD কোয়ালিটি",
        feat_hd_desc: "ক্রিস্টাল ক্লিয়ার 4K, 1080p রেজোলিউশনে ভিডিও সেভ করুন।",
        feat_safe_title: "১০০% নিরাপদ",
        feat_safe_desc: "কোনো বিরক্তিকর অ্যাড বা ভাইরাস নেই। সম্পূর্ণ ফ্রি এবং নিরাপদ।",
        feat_devices_title: "সব ডিভাইসে চলে",
        feat_devices_desc: "আইফোন, অ্যান্ড্রয়েড এবং ল্যাপটপে সমানভাবে কাজ করে।",
        feat_audio_title: "অডিও কনভার্টার",
        feat_audio_desc: "ভিডিও থেকে সরাসরি হাই-কোয়ালিটি MP3 অডিও নামিয়ে নিন।",
        feat_watermark_title: "ওয়াটারমার্ক মুক্ত",
        feat_watermark_desc: "টিকটক বা রিলস ভিডিও ডাউনলোড করুন কোনো লোগো ছাড়াই।",
        footer_text: "&copy; ২০২৪ সোশ্যাল ভিডিও ডাউনলোডার। ❤️ দিয়ে তৈরি।",
        result_found: "ফলাফল পাওয়া গেছে",
        reset_btn: "রিসেট",
        save_thumb: "সেভ ছবি",
        video_formats: "ভিডিও ফরম্যাট",
        audio_formats: "অডিও ফরম্যাট",
        error_title: "ত্রুটি",
        success_title: "সফল"
    }
};

let currentLang = localStorage.getItem('social_app_lang') || 'en';

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    // 1. PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('PWA Service Worker Registered'))
            .catch(err => console.log('SW Fail:', err));
    }

    const searchBtn = document.getElementById("searchBtn");
    const input = document.getElementById("videoUrl");
    const langToggle = document.getElementById("langToggle");

    // Initial lang apply
    applyLanguage(currentLang);

    langToggle.addEventListener("click", () => {
        currentLang = currentLang === 'en' ? 'bn' : 'en';
        localStorage.setItem('social_app_lang', currentLang);
        applyLanguage(currentLang);
    });

    searchBtn.addEventListener("click", () => initiateSearch());
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") initiateSearch();
    });

    // 2. Smart Clipboard: Auto Paste Button
    const pasteBtn = document.createElement('button');
    // Responsive: right-24 (mobile) vs right-48 (desktop) to safely clear the "Download" button
    pasteBtn.className = "absolute right-24 md:right-48 top-1/2 transform -translate-y-1/2 bg-white/5 hover:bg-white/20 text-slate-400 hover:text-white border border-white/5 hover:border-white/20 p-2 rounded-xl transition-all duration-300 backdrop-blur-sm z-30 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 shadow-lg group";
    
    // Icon with slight scale animation on hover
    pasteBtn.innerHTML = `
        <i class="ri-clipboard-line text-lg md:text-xl group-hover:scale-110 transition-transform"></i>
        <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Paste Link</span>
    `;
    
    pasteBtn.setAttribute('title', 'Paste Link');
    input.parentElement.insertBefore(pasteBtn, searchBtn); // Insert before Download button

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                input.value = text;
                // Smart "Paste & Go"
                if(text.startsWith('http')) {
                     showToast("Link Pasted! searching...", "success");
                     initiateSearch();
                } else {
                     showToast("Link Pasted!", "success");
                }
            }
        } catch (err) {
            showToast("Please allow clipboard access", "error");
        }
    });

    // 3. Auto-Check Clipboard removed (Causes double paste issues)
    // Users prefer manual control via the paste button or Ctrl+V

    // 3. Theme Logic
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    let isDark = localStorage.getItem('social_app_theme') !== 'light'; 
    
    function applyTheme() {
        if(isDark) {
            document.documentElement.classList.add('dark');
            if(themeIcon) themeIcon.className = 'ri-moon-line text-lg';
        } else {
             document.documentElement.classList.remove('dark');
             if(themeIcon) themeIcon.className = 'ri-sun-line text-lg text-yellow-400';
        }
    }
    applyTheme();

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            localStorage.setItem('social_app_theme', isDark ? 'dark' : 'light');
            applyTheme();
        });
    }

    // 4. Restore History
    renderHistory();

    // 5. Pro Features Init
    initSettings();
    initDragDrop();
});

// ---------------------------
// Pro Features Logic
// ---------------------------

function initDragDrop() {
    const container = document.getElementById('searchContainer');
    const overlay = document.getElementById('dragOverlay');
    const input = document.getElementById('videoUrl');

    if(!container || !overlay) return;

    ['dragenter', 'dragover'].forEach(eventName => {
        container.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            overlay.classList.remove('opacity-0', 'pointer-events-none');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        container.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            overlay.classList.add('opacity-0', 'pointer-events-none');
        }, false);
    });

    container.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if(files.length > 0) {
            const file = files[0];
            if(file.type === "text/plain" || file.name.endsWith('.txt')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                     input.value = e.target.result;
                     showToast("File loaded! Starting Batch...", "success");
                     initiateSearch(); // Triggers batch logic automatically
                };
                reader.readAsText(file);
            } else {
                showToast("Only .txt files are supported for batch", "error");
            }
        }
    });
}

function initSettings() {
    const btn = document.getElementById('settingsToggle');
    if(!btn) return;

    btn.addEventListener('click', () => {
        // Simple Prompt for now (can be a modal later)
        const current = localStorage.getItem('social_dl_quality') || 'best';
        // Create Modal HTML dynamically
        const modal = document.createElement('div');
        modal.className = "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up";
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">⚙️ Download Settings</h3>
                <div class="space-y-3">
                    <label class="flex items-center gap-3 p-3 rounded-xl border ${current==='best'?'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10':'border-gray-200 dark:border-white/10'} cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5" onclick="saveSetting('best', this)">
                        <i class="ri-hd-line text-xl ${current==='best'?'text-indigo-600':'text-gray-400'}"></i>
                        <div>
                            <div class="font-semibold text-gray-800 dark:text-white">Best Quality (4K/HD)</div>
                            <div class="text-xs text-gray-500">Always select highest resolution</div>
                        </div>
                    </label>
                    <label class="flex items-center gap-3 p-3 rounded-xl border ${current==='saver'?'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10':'border-gray-200 dark:border-white/10'} cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5" onclick="saveSetting('saver', this)">
                        <i class="ri-smartphone-line text-xl ${current==='saver'?'text-indigo-600':'text-gray-400'}"></i>
                        <div>
                            <div class="font-semibold text-gray-800 dark:text-white">Data Saver (480p/720p)</div>
                            <div class="text-xs text-gray-500">Faster downloads, less data</div>
                        </div>
                    </label>
                    <label class="flex items-center gap-3 p-3 rounded-xl border ${current==='audio'?'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10':'border-gray-200 dark:border-white/10'} cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5" onclick="saveSetting('audio', this)">
                        <i class="ri-music-2-line text-xl ${current==='audio'?'text-indigo-600':'text-gray-400'}"></i>
                        <div>
                            <div class="font-semibold text-gray-800 dark:text-white">Audio Mode (MP3)</div>
                            <div class="text-xs text-gray-500">Prefer audio extraction</div>
                        </div>
                    </label>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="mt-6 w-full py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-700 dark:text-white rounded-xl font-medium transition">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    });
}

// Global for inline onclick
window.saveSetting = (val, el) => {
    localStorage.setItem('social_dl_quality', val);
    showToast(`Preference saved: ${val.toUpperCase()}`, "success");
    // Close modal after delay
    setTimeout(() => el.parentElement.parentElement.parentElement.remove(), 300);
};

function shareResult(url, title) {
    if (navigator.share) {
        navigator.share({
            title: 'Download Video',
            text: `Check out this video: ${title}`,
            url: url,
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(url).then(() => {
            showToast("Video Link Copied!", "success");
        });
    }
}

// History Logic
function saveToHistory(data, url) {
    const historyItem = {
        title: data.title,
        thumb: data.thumbnails?.[0]?.url,
        url: url,
        date: new Date().toISOString()
    };
    
    let history = JSON.parse(localStorage.getItem('dl_history') || '[]');
    history = history.filter(h => h.url !== url); // Remove duplicate
    history.unshift(historyItem); // Add to top
    if(history.length > 10) history.pop(); // Max 10
    
    localStorage.setItem('dl_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('historyGrid');
    const section = document.getElementById('historySection');
    if(!container || !section) return;

    const history = JSON.parse(localStorage.getItem('dl_history') || '[]');
    
    if(history.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    section.classList.remove('hidden');
    container.innerHTML = history.map(item => `
        <div class="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group cursor-pointer shadow-sm" onclick="document.getElementById('videoUrl').value = '${item.url}'; initiateSearch();">
            <img src="${item.thumb}" class="w-16 h-10 object-cover rounded-md opacity-100 dark:opacity-80 group-hover:opacity-100">
            <div class="flex-1 min-w-0">
                <h4 class="font-medium text-sm text-gray-800 dark:text-white truncate">${item.title}</h4>
                <div class="text-xs text-gray-500 dark:text-slate-400">${new Date(item.date).toLocaleDateString()}</div>
            </div>
            <button class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-white hover:bg-indigo-600 hover:text-white transition-colors">
                <i class="ri-play-fill"></i>
            </button>
        </div>
    `).join('');
}

function clearHistory() {
    localStorage.removeItem('dl_history');
    renderHistory();
}

function applyLanguage(lang) {
    const t = translations[lang];
    const langTxt = document.getElementById("langText");
    if(langTxt) langTxt.textContent = lang === 'en' ? 'English' : 'বাংলা';
    
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (t[key]) el.innerHTML = t[key];
    });
    
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.getAttribute('data-lang-placeholder');
        if (t[key]) el.setAttribute('placeholder', t[key]);
    });
}

// Main Search Flow (Batch Supported)
// Queue State
let processingQueue = false;
let downloadQueue = [];

async function initiateSearch() {
  const input = document.getElementById("videoUrl");
  const urlRaw = input.value.trim();
  const t = translations[currentLang];

  if (!urlRaw) {
    showToast(t.error_empty, "error");
    return;
  }

  // Detect Batch
  const urls = urlRaw.split(/[\n\s]+/).filter(u => u.startsWith("http"));
  
  if (urls.length > 1) {
      // ------------------------------------------------
      // BATCH MODE
      // ------------------------------------------------
      downloadQueue = urls.map(u => ({ url: u, status: 'pending', title: 'Pending...' }));
      renderQueueUI();
      document.getElementById('batchQueue').classList.remove('hidden');
      input.value = ''; // Clear input
      processQueue();
      return;
  }

    // Single Mode
  const url = urls[0] || urlRaw;
  
  // Smart Clean
  const cleanUrl = smartCleanUrl(url);
  localStorage.setItem("last_social_url", cleanUrl);

  // UI Reset
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("videoContainer").style.display = "none";
  resetErrors();

  try {
     const rawData = await fetchWithRetry(cleanUrl);
     const data = normalizeSocialData(rawData, cleanUrl); // Normalize first!
     
     renderVideoUI(data, cleanUrl);
     saveToHistory(data, cleanUrl);
     
     // Success Toast
     showToast(t.result_found, "success");
  } catch (err) {
      showError(err.message);
  } finally {
      document.getElementById("loading").classList.add("hidden");
  }
}

// ---------------------------
// Queue / Batch Logic
// ---------------------------
function renderQueueUI() {
    const list = document.getElementById('queueList');
    const count = document.getElementById('queueCount');
    if(!list) return;

    count.textContent = downloadQueue.length;
    list.innerHTML = downloadQueue.map((item, idx) => {
        let statusColor = 'text-gray-500';
        let icon = 'ri-time-line';
        if(item.status === 'processing') { statusColor = 'text-indigo-500 animate-pulse'; icon = 'ri-loader-4-line animate-spin'; }
        if(item.status === 'completed') { statusColor = 'text-green-500'; icon = 'ri-checkbox-circle-fill'; }
        if(item.status === 'error') { statusColor = 'text-red-500'; icon = 'ri-error-warning-fill'; }

        return `
            <div class="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-sm">
                <span class="${statusColor}"><i class="${icon}"></i></span>
                <span class="flex-1 truncate text-gray-700 dark:text-gray-300 font-medium">${item.url}</span>
                ${item.status === 'completed' ? `<button onclick="handleDownloadClick(this, '${item.thumb}', '${item.title}', 'video')" class="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-200 dark:hover:bg-indigo-500/40 transition">Download</button>` : ''}
            </div>
        `;
    }).join('');
}

async function processQueue() {
    if(processingQueue) return;
    processingQueue = true;

    for (let i = 0; i < downloadQueue.length; i++) {
        if(downloadQueue[i].status !== 'pending') continue;

        // Update UI: Processing
        downloadQueue[i].status = 'processing';
        renderQueueUI();

        try {
            const cleanUrl = smartCleanUrl(downloadQueue[i].url);
            const rawData = await fetchWithRetry(cleanUrl);
            const data = normalizeSocialData(rawData, cleanUrl); // Normalize here too
            
            // Success
            downloadQueue[i].status = 'completed';
            downloadQueue[i].title = data.title;
            downloadQueue[i].thumb = data.thumbnails?.[0]?.url;
            saveToHistory(data, cleanUrl);
        } catch (err) {
            downloadQueue[i].status = 'error';
        }

        renderQueueUI();
        // Small delay
        await new Promise(r => setTimeout(r, 1500));
    }
    
    processingQueue = false;
    showToast("Batch processing finished!", "success");
}

function clearBatch() {
    downloadQueue = [];
    renderQueueUI();
    document.getElementById('batchQueue').classList.add('hidden');
}

let activeAudio = null;
function previewAudio(url, btn) {
    if(activeAudio) {
        activeAudio.pause();
        activeAudio = null;
        // Reset all icons
        document.querySelectorAll('.ri-pause-mini-fill').forEach(i => i.className = 'ri-play-mini-fill');
        return;
    }

    const audio = new Audio(url);
    activeAudio = audio;
    
    // UI Update
    const icon = btn.querySelector('i');
    icon.className = 'ri-loader-4-line animate-spin';
    
    // Play
    audio.play().then(() => {
        icon.className = 'ri-pause-mini-fill';
        showToast("Playing preview...", "success");
    }).catch(err => {
        icon.className = 'ri-error-warning-fill';
        showToast("Cannot preview this file (CORS/Format restricted)", "error");
        activeAudio = null;
    });

    audio.onended = () => {
        icon.className = 'ri-play-mini-fill';
        activeAudio = null;
    };
}

// ---------------------------
// Audio Visualizer Logic
// ---------------------------
let audioCtx, analyser, dataArray, canvasCtx, visualizerAnim;

function initVisualizer(canvas) {
    if(!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64; 
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    canvasCtx = canvas.getContext("2d");
    return { bufferLength };
}

function drawVisualizer(canvas, bufferLength) {
    visualizerAnim = requestAnimationFrame(() => drawVisualizer(canvas, bufferLength));
    analyser.getByteFrequencyData(dataArray);

    const w = canvas.width;
    const h = canvas.height;
    
    canvasCtx.clearRect(0, 0, w, h);
    
    const barWidth = (w / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        // Gradient color
        const gradient = canvasCtx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#818cf8'); 
        gradient.addColorStop(1, '#c084fc'); 
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, h - barHeight, barWidth, barHeight);
        
        x += barWidth + 2;
    }
}

// ---------------------------------------------------------
// Self-Healing Features
// ---------------------------------------------------------

/**
 * 1. Smart URL Sanitizer
 * Automatically fixes common bad URL formats that APIs hate.
 */
function smartCleanUrl(url) {
    // Add protocol
    if (!url.startsWith('http')) url = 'https://' + url;

    try {
        const u = new URL(url);
        
        // Remove tracking params that confuse APIs (fbclid, si, feature, etc)
        const badParams = ['fbclid', 'si', 'feature', 'ref', 'cft', '__tn__'];
        badParams.forEach(p => u.searchParams.delete(p));

        // Standardize Mobile URLs (m.facebook -> www.facebook)
        if (u.hostname.startsWith('m.')) {
            u.hostname = u.hostname.replace('m.', 'www.');
        }

        return u.toString();
    } catch (e) {
        return url; // Return original if parsing fails
    }
}



// Logic: Social API Fetch


/**
 * Normalizes data from Social Download All-in-One API.
 * Handles various structures: {medias:[]}, {links:[]}, or flat {url:"..."}
 */
function normalizeSocialData(raw, originalUrl) {
  if (!raw) throw new Error("Empty response from API");

  // Handle generic 'result' or 'data' wrapper often returned by APIs
  const item = raw.result || raw.data || raw;
  
  // Specific Error Handling for this API
  if (item.error && item.message) {
      throw new Error(item.message);
  }

  // 1. Try to find arrays of streams
  let streams =
    item.medias || item.links || item.formats || item.video_links || [];

  // 2. If no array, check for single flat URL fields (Common in TikTok/Insta APIs)
  if (streams.length === 0) {
    if (item.url)
      streams.push({ url: item.url, quality: "HD", extension: "mp4" });
    if (item.video)
      streams.push({ url: item.video, quality: "HD", extension: "mp4" });
    if (item.hd)
      streams.push({ url: item.hd, quality: "HD", extension: "mp4" });
    if (item.sd)
      streams.push({ url: item.sd, quality: "SD", extension: "mp4" });
    if (item.audio)
      streams.push({
        url: item.audio,
        quality: "128kbps",
        extension: "mp3",
        isAudioOnly: true,
      });

    // Sometimes audio is in 'music' field
    if (item.music)
      streams.push({
        url: item.music,
        quality: "128kbps",
        extension: "mp3",
        isAudioOnly: true,
      });
  }

  // Critical: If still no streams, but we have a 'download' or 'play' url similar to original, use it
  if (streams.length === 0 && (item.play || item.play_url)) {
    streams.push({
      url: item.play || item.play_url,
      quality: "Watermark",
      extension: "mp4",
    });
  }

  if (streams.length === 0) {
    console.warn("API Data structure:", item); // Log for debugging
    throw new Error(
      "No download links found. The video might be private or deleted."
    );
  }

  // 3. Categorize Streams
  const videoStreams = streams.filter((s) => {
    const ext = (s.extension || "").toLowerCase();
    const type = (s.type || "").toLowerCase();
    // It's a video if it explicitly says so, OR has video ext, OR is NOT audio-only
    return (
      ["mp4", "webm", "mov", "mkv"].includes(ext) ||
      type === "video" ||
      (!s.isAudioOnly && !["mp3", "m4a", "wav"].includes(ext))
    );
  });

  const audioStreams = streams.filter((s) => {
    const ext = (s.extension || "").toLowerCase();
    return (
      ["mp3", "m4a", "aac", "wav"].includes(ext) ||
      s.isAudioOnly === true ||
      s.quality === "128kbps"
    );
  });

  // 4. Find Best Thumbnail (High Quality)
  // Priority: Optimized/HD keys -> Sorted Array -> Standard keys
  let bestThumb = item.origin_cover || item.hd_cover || item.cover || item.picture || item.thumbnail || item.thumb;

  // Check 'thumbnails' array (if exists, usually sorted low->high or has width)
  if (Array.isArray(item.thumbnails) && item.thumbnails.length > 0) {
    try {
      // Sort by Width (Highest First) to get HD
      const sorted = [...item.thumbnails].sort(
        (a, b) => (b.width || 0) - (a.width || 0)
      );
      if (sorted[0] && sorted[0].url) bestThumb = sorted[0].url;
    } catch (e) {}
  } else if (Array.isArray(item.images) && item.images.length > 0) {
    // Some APIs put the HD one at the end, some at the start.
    // We check if it's an object with width, otherwise take the last one (usually highest res in lists)
    const images = item.images;
    if(typeof images[0] === 'object' && images[0].width) {
         images.sort((a,b) => (b.width || 0) - (a.width || 0));
         bestThumb = images[0].url;
    } else {
         const last = images[images.length - 1];
         bestThumb = typeof last === "string" ? last : last.url || bestThumb;
    }
  }
  
  if (!bestThumb) bestThumb = "https://placehold.co/600x400?text=No+Preview";
  
  // Smart Avatar Extraction
  const authorName = item.author || item.source || item.owner || "Social Media";
  // Try multiple common fields for avatar
  const avatarUrl = item.authorAvatar || item.avatar || item.author_avatar || item.uploader_avatar || item.avatar_url || item.profile_pic;
  
  // Professional Fallback: Generate Initials Avatar
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&color=fff&size=128`;

  return {
    title: item.title || item.videoTitle || "Social Video",
    description: item.duration ? `Duration: ${item.duration}` : "",
    thumbnails: [{ url: bestThumb }],
    channel: {
      name: authorName,
      avatar: [{ url: avatarUrl || fallbackAvatar }], // Use Real or Generated
    },
    videos: { items: videoStreams.map(mapSocialStream) },
    audios: { items: audioStreams.map(mapSocialStream) },
  };
}

function mapSocialStream(s) {
  // Attempt to guess extension if missing
  let ext = s.extension || "mp4";
  if (!s.extension && s.url) {
    if (s.url.includes(".mp3")) ext = "mp3";
    else if (s.url.includes(".mp4")) ext = "mp4";
  }

  return {
    extension: ext,
    quality: s.quality || s.resolution || "Download",
    sizeText:
      s.formattedSize ||
      (s.filesize ? (s.filesize / 1024 / 1024).toFixed(2) + " MB" : "") ||
      (s.size ? (s.size / 1024 / 1024).toFixed(2) + " MB" : ""),
    url: s.url,
    mimeType: s.type || `video/${ext}`,
  };
}

// UI Rendering (Tailwind Edition)
function renderVideoUI(data, url) {
  const t = translations[currentLang]; // Get current translations
  const container = document.getElementById("videoContainer");
  const safeGet = (path, fallback) => path || fallback;
  const thumb = safeGet(
    data.thumbnails?.[0]?.url,
    data.picture || "https://placehold.co/600x400"
  );
  
  // Default to generated avatar if deep access fails
  const avatar = safeGet(
    data.channel?.avatar?.[0]?.url,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.channel?.name || 'User')}&background=random`
  );

  const showVideo = data.videos?.items?.length > 0;
  const showAudio = data.audios?.items?.length > 0;

  let html = `
        <div class="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
            <h3 class="text-lg text-gray-700 dark:text-slate-300 font-medium">${t.result_found}</h3>
            <div class="flex items-center gap-4">
                 <button onclick="shareResult('${url}', '${data.title.replace(/'/g, "\\'")}')" class="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors" title="Share Link">
                    <i class="ri-share-forward-line"></i> Share
                 </button>
                 <button id="resetBtn" onclick="resetUI()" class="text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 flex items-center gap-1 transition-colors">
                     <i class="ri-refresh-line"></i> ${t.reset_btn}
                 </button>
            </div>
        </div>

        <div class="flex flex-col md:flex-row gap-8 items-start">
            <!-- Thumbnail Side (Expanded to 5/12 for HD view) -->
            <div class="w-full md:w-5/12 group">
                <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 aspect-video">
                    <img src="${thumb}" alt="Thumb" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" onerror="this.src='https://placehold.co/600x400?text=No+Preview'">
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100">
                        <button class="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-full backdrop-blur-md border border-white/30 transition-all text-sm font-bold tracking-wide shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                onclick="handleDownloadClick(this, '${thumb}', '${data.title}', 'image')">
                            <i class="ri-image-2-fill mr-2"></i> ${t.save_thumb} (HD)
                        </button>
                    </div>
                </div>
            </div>

            <!-- Info Side -->
            <div class="w-full md:w-7/12">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">${data.title}</h2>
                
                <div class="flex items-center gap-3 mb-6">
                   <img src="${avatar}" class="w-10 h-10 rounded-full border border-gray-200 dark:border-white/20 bg-white dark:bg-white/5" onerror="this.src='https://placehold.co/50'">
                   <div>
                       <div class="text-indigo-600 dark:text-primary font-semibold text-sm">${data.channel?.name}</div>
                       <div class="text-gray-500 dark:text-slate-500 text-xs">${data.description ? 'Duration: ' + data.description.replace('Duration: ', '') : 'Social Media'}</div>
                   </div>
                </div>

                <!-- Tabs/Sections -->
                ${showVideo ? `
                <div class="mb-8">
                    <h4 class="flex items-center gap-2 text-gray-800 dark:text-white font-semibold mb-4 text-lg">
                        <span class="p-1 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"><i class="ri-film-fill"></i></span> ${t.video_formats}
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3" id="videoOptions"></div>
                </div>` : ''}

                ${showAudio ? `
                <div id="audioSection">
                    <h4 class="flex items-center gap-2 text-gray-800 dark:text-white font-semibold mb-4 text-lg">
                        <span class="p-1 rounded bg-pink-50 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400"><i class="ri-music-2-fill"></i></span> ${t.audio_formats}
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3" id="audioOptions"></div>
                </div>` : ''}
            </div>
        </div>
    `;

  container.innerHTML = html;

  // Filter Logic:
  // If preference is 'audio', we ONLY render audio buttons to keep it clean.
  // If preference is 'video' (best/saver), we render video buttons.
  // BUT: user said "smooth", so let's render ALL but use the "RECOMMENDED" highlight we added before.
  // To make it truly "Fixed", let's improve the rendering to show sizing more clearly.

  // Render Logic
  if (showVideo)
    renderOptions(
      document.getElementById("videoOptions"),
      data.videos?.items || [],
      "video",
      data.title
    );
  if (showAudio)
    renderOptions(
      document.getElementById("audioOptions"),
      data.audios?.items || [],
      "audio",
      data.title
    );

  container.style.display = "block";
  
  // 6. Focus Mode: Scroll to specific section if 'audio' preference is set
  const pref = localStorage.getItem('social_dl_quality') || 'best';
  if (pref === 'audio' && showAudio) {
      document.getElementById("audioOptions").scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderOptions(container, items, type, title) {
  if (!items || items.length === 0) return;

  // Deduplicate
  const unique = new Map();
  items.forEach((v) => {
    const key = `${v.quality}-${v.extension}`;
    if (!unique.has(key) && v.url) unique.set(key, v);
  });

  // Convert to array for indexing
  Array.from(unique.values()).forEach((v, index) => {
    const btn = document.createElement("button");
    // Tailwind classes: Responsive grid/flex
    btn.className =
      "group relative flex items-center justify-between w-full p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-indigo-400 dark:hover:bg-white/10 transition-all duration-300 text-left animate-fade-in-up hover:shadow-md dark:hover:shadow-lg overflow-hidden gap-3";
    // Added gap-3 to button flex container

    // Staggered Animation Delay
    btn.style.animationDelay = `${index * 0.05}s`;
    btn.style.animationFillMode = "both";

    const icon = type === "audio" ? "ri-music-2-fill" : "ri-film-fill";
    const qualityText = v.quality?.toUpperCase() || "HD";
    const sizeText = v.sizeText ? `${v.sizeText}` : "";
    const extBadgeColor =
      type === "audio"
        ? "bg-pink-50 text-pink-600 dark:bg-pink-500/20 dark:text-pink-300"
        : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300";

    // Auto-Quality Logic
    const pref = localStorage.getItem('social_dl_quality') || 'best';
    let isRecommended = false;
    if (pref === 'audio' && type === 'audio' && index === 0) isRecommended = true;
    if (type === 'video') {
         const q = (v.quality + '').toLowerCase();
         if (pref === 'saver' && (q.includes('360') || q.includes('480') || q.includes('sd'))) isRecommended = true;
         if (pref === 'best' && index === 0) isRecommended = true;
    }

    if(isRecommended) {
        btn.classList.add('ring-2', 'ring-olive-medium', 'dark:ring-indigo-500');
    }

    btn.innerHTML = `
            <!-- Subtle Shine Effect -->
            <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            
            ${isRecommended ? '<div class="absolute top-0 right-0 bg-olive-medium dark:bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold z-20">RECOMMENDED</div>' : ''}

            <div class="flex items-center gap-3 relative z-10 flex-1 min-w-0">
                <div class="w-10 h-10 shrink-0 rounded-lg bg-gray-100 dark:bg-black/20 flex items-center justify-center text-gray-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                    <i class="${icon} text-lg"></i>
                </div>
                <div class="flex flex-col min-w-0">
                    <div class="font-medium text-gray-900 dark:text-white text-base truncate flex items-center gap-2 flex-wrap">
                        <span class="truncate">${qualityText}</span>
                        <span class="text-[10px] px-2 py-0.5 rounded ${extBadgeColor} font-bold tracking-wider border border-gray-200 dark:border-white/5 shrink-0">${v.extension.toUpperCase()}</span>
                    </div>
                    ${v.sizeText ? `<div class="text-xs text-gray-500 dark:text-slate-500 mt-0.5">${v.sizeText}</div>` : ''}
                </div>
            </div>
            
            <div class="flex items-center gap-2 relative z-10 shrink-0">
                ${
                    type === 'audio' 
                    ? `<div role="button" onclick="event.stopPropagation(); previewAudio('${v.url}', this)" class="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-500 hover:bg-pink-100 dark:hover:bg-pink-500/20 flex items-center justify-center transition-colors cursor-pointer" title="Preview"><i class="ri-play-mini-fill"></i></div>`
                    : ''
                }
                ${
                  sizeText
                    ? `<span class="text-xs text-gray-500 font-medium group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors mx-1 whitespace-nowrap">${sizeText}</span>`
                    : ""
                }
                <div class="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-100 dark:border-white/5">
                    <i class="ri-download-cloud-2-line text-sm"></i>
                </div>
            </div>
         `;

    // Handle Click (Existing Logic)
    btn.onclick = (e) => {
       // Prevent preview button click from triggering download
       if(e.target.closest('[title="Preview"]')) return;
       handleDownloadClick(btn, v.url, title, type);
    };

    container.appendChild(btn);
  });
}

function handleDownloadClick(btn, url, title, type = "video") {
  if (btn.disabled) return;

  const originalContent = btn.innerHTML;
  const originalBg = btn.style.background;

  btn.disabled = true;
  btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Connecting...`;

  const ext = type === "audio" ? "mp3" : type === "image" ? "jpg" : "mp4";
  const safeTitle = title.replace(/[^a-z0-9]/gi, "_").substring(0, 30);
  const filename = `SocialDownloader_${safeTitle}.${ext}`;

  // Start Download with Progress (Retry enabled)
  downloadResourceWithRetry(url, filename, btn)
    .then(() => {
      btn.innerHTML = `<i class="ri-check-line"></i> Saved!`;
      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = originalBg;
        btn.disabled = false;
      }, 2000);
    })
    .catch((err) => {
      console.warn("Direct download failed", err);

      showToast("Download failed after 3 attempts. Opening tab...", "error");

      btn.innerHTML = `<i class="ri-error-warning-line"></i> Opening...`;
      // Fallback to new tab
      setTimeout(() => {
        window.open(url, "_blank");
        btn.innerHTML = originalContent;
        btn.style.background = originalBg;
        btn.disabled = false;
      }, 1000);
    });
}

/**
 * Downloads a file using XHR with specific retry logic.
 * Retries 3 times if network error or 5xx status occurs.
 */
async function downloadResourceWithRetry(url, filename, btn, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.responseType = "blob";

                xhr.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        btn.innerHTML = `<i class="ri-download-2-line"></i> ${percent}% (Try ${i+1})`;
                        btn.style.background = `linear-gradient(90deg, var(--secondary-color) ${percent}%, var(--container-bg) ${percent}%)`;
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200) {
                        // Success
                        const blob = xhr.response;
                        const link = document.createElement("a");
                        link.href = window.URL.createObjectURL(blob);
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setTimeout(() => window.URL.revokeObjectURL(link.href), 100);
                        resolve();
                    } else {
                        // Server Error -> Reject to trigger retry
                        reject(new Error(`HTTP ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error("Network Error"));
                xhr.send();
            });
        } catch (err) {
            console.warn(`Download Attempt ${i + 1} failed:`, err);
            if (i === retries - 1) throw err; // Throw on last fail
            await new Promise(r => setTimeout(r, 2000)); // Wait 2s before retry
        }
    }
}

// Toast
function showToast(message, type = "error") {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  // Base Tailwind classes
  toast.className = `toast-notification fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/10 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 transition-all duration-300 opacity-0 translate-y-10 transform`;

  const icon =
    type === "error"
      ? "ri-error-warning-fill text-red-400"
      : "ri-checkbox-circle-fill text-green-400";

  toast.innerHTML = `
        <i class="${icon} text-xl"></i>
        <div class="text-left">
            <div class="font-bold text-sm">${
              type === "error" ? "Error" : "Success"
            }</div>
            <div class="text-xs text-slate-300">${message}</div>
        </div>
    `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-10");
    toast.classList.add("opacity-100", "translate-y-0");
  });

  // Auto hide
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-10");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function showError(msg) {
  const el = document.getElementById("errorMessage");
  document.getElementById("errorText").textContent = msg;
  el.style.display = "block";
  showToast(msg, "error");
}

function resetErrors() {
  document.getElementById("errorMessage").style.display = "none";
}

function resetUI() {
  document.getElementById("videoContainer").style.display = "none";
  document.getElementById("videoUrl").value = "";
}

// ---------------------------------------------------------
// Keyboard Shortcuts
// ---------------------------------------------------------
document.addEventListener('keydown', (e) => {
    // 1. Focus Search (/)
    // Prevent if typing in an input
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const input = document.getElementById('videoUrl');
        input.focus();
        // Move cursor to end
        const len = input.value.length;
        input.setSelectionRange(len, len);
    }

    // 2. Clear/Close (Esc)
    if (e.key === 'Escape') {
        // If modal or loading is open, close/cancel (future enhancement)
        resetUI();
        document.getElementById('videoUrl').blur();
        resetErrors();
    }
});
