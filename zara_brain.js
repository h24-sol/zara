// ZARA v5.0 CORE BRAIN
const API_KEY = 'd2fe03d609b8d0c74757ddf0addad1a1';
let currentLang = 'en';

function setLang(l) {
    currentLang = l;
    document.getElementById('btn-en').className = l === 'en' ? 'px-4 py-1 rounded-full border border-cyan-500 bg-cyan-500 text-black text-xs font-bold' : 'px-4 py-1 rounded-full border border-cyan-500 text-cyan-500 text-xs font-bold transition-all hover:bg-cyan-500/20';
    document.getElementById('btn-bn').className = l === 'bn' ? 'px-4 py-1 rounded-full border border-cyan-500 bg-cyan-500 text-black text-xs font-bold' : 'px-4 py-1 rounded-full border border-cyan-500 text-cyan-500 text-xs font-bold transition-all hover:bg-cyan-500/20';
    document.getElementById('panel-title').innerText = l === 'en' ? "Strategic Analysis" : "কৌশলগত বিশ্লেষণ";
}

async function interrogate() {
    const query = document.getElementById('user-query').value;
    const output = document.getElementById('intel-output');
    const speech = document.getElementById('zara-speech');
    const avatar = document.getElementById('avatar-frame');

    if (!query) return;

    // Developer Recognition (Silent Protocol)
    if (query.toLowerCase().includes("developer") || query.toLowerCase().includes("owner")) {
        const devMsg = currentLang === 'en' ? 
            "My architect is Manish Haldar. He is a Web4 developer based in Bangladesh." : 
            "আমার নির্মাতা মনীষ হালদার। তিনি বাংলাদেশের একজন ওয়েব-ফোর ডেভেলপার।";
        speech.innerText = `"${devMsg}"`;
        speak(devMsg);
        return;
    }

    // Initialize Analysis UI
    speech.innerText = currentLang === 'en' ? "Accessing global intelligence..." : "বৈশ্বিক তথ্য সংগ্রহ করছি...";
    avatar.classList.add('speaking-pulse');
    output.innerHTML = '<div class="flex items-center gap-3"><span class="w-3 h-3 bg-cyan-500 animate-ping rounded-full"></span> INTERROGATING GLOBAL NEWS NODES...</div>';

    try {
        // Build API URL (Bilingual support included)
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${currentLang}&max=5&token=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API_ERROR_${response.status}`);
        }

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            const first = data.articles[0];
            const voiceBrief = currentLang === 'en' ? 
                `Analysis complete. The primary report concerns: ${first.title}.` : 
                `বিশ্লেষণ সম্পন্ন। প্রধান খবরটি হলো: ${first.title}।`;

            speech.innerText = `"${voiceBrief}"`;
            speak(voiceBrief);

            // Populate the feed with reports
            let html = `<p class="mb-6 font-bold text-cyan-400 border-b border-cyan-500/20 pb-2 uppercase tracking-tighter text-xs">Reports Found: ${data.articles.length}</p>`;
            data.articles.forEach(art => {
                html += `
                    <div class="mb-8 group">
                        <h4 class="text-white font-bold uppercase text-base mb-2 group-hover:text-cyan-400 transition-colors">${art.title}</h4>
                        <p class="text-sm opacity-50 mb-3 leading-relaxed">${art.description}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-[9px] uppercase tracking-widest text-cyan-600">Source: ${art.source.name}</span>
                            <a href="${art.url}" target="_blank" class="text-[10px] text-white border border-white/20 px-3 py-1 rounded hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all font-bold">ACCESS FULL INTEL</a>
                        </div>
                    </div>
                `;
            });
            output.innerHTML = html;
        } else {
            const noData = currentLang === 'en' ? "No intelligence found for this query." : "এই বিষয়ে কোনো তথ্য পাওয়া যায়নি।";
            speech.innerText = noData;
            speak(noData);
            output.innerHTML = noData;
        }
    } catch (err) {
        console.error("DIAGNOSTICS:", err);
        const errText = currentLang === 'en' ? 
            "Connection failed. The global link has been severed by your browser security." : 
            "কানেকশন ফেইলড। আপনার ব্রাউজার সিকিউরিটির কারণে তথ্য সংগ্রহ করা সম্ভব হয়নি।";
        speech.innerText = errText;
        output.innerHTML = `<div class="text-red-500 font-bold uppercase text-xs">ERROR: ${err.message}<br><br>Check your GNews API Quota or enable CORS access.</div>`;
    }

    setTimeout(() => avatar.classList.remove('speaking-pulse'), 4000);
}

function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Attempt to select a high-status female voice
    const zaraVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Female'));
    if (zaraVoice) msg.voice = zaraVoice;

    msg.pitch = 1.2; // Sophisticated pitch
    msg.rate = 0.9;  // Controlled, powerful pace
    window.speechSynthesis.speak(msg);
}

// Warm up speech synthesis
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
