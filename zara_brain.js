const API_KEY = 'd2fe03d609b8d0c74757ddf0addad1a1';
let currentLang = 'en';

function setLang(l) {
    currentLang = l;
    document.getElementById('btn-en').className = l === 'en' ? 'px-4 py-1 rounded-full border border-cyan-500 bg-cyan-500 text-black text-xs font-bold' : 'px-4 py-1 rounded-full border border-cyan-500 text-cyan-500 text-xs font-bold';
    document.getElementById('btn-bn').className = l === 'bn' ? 'px-4 py-1 rounded-full border border-cyan-500 bg-cyan-500 text-black text-xs font-bold' : 'px-4 py-1 rounded-full border border-cyan-500 text-cyan-500 text-xs font-bold';
}

async function interrogate() {
    const query = document.getElementById('user-query').value;
    const output = document.getElementById('intel-output');
    const display = document.getElementById('zara-voice-display');
    const avatar = document.getElementById('avatar-frame');

    if (!query) return;

    // Visual State: Analysis
    display.innerText = currentLang === 'en' ? "Accessing global news portals..." : "বৈশ্বিক নিউজ পোর্টালগুলো বিশ্লেষণ করছি...";
    avatar.classList.add('speaking-pulse');
    output.innerHTML = '<div class="animate-pulse">SYNTHESIZING DATA...</div>';

    try {
        const url = `https://gnews.io/api/v4/search?q=${query}&lang=${currentLang}&token=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            const first = data.articles[0];
            const brief = currentLang === 'en' ? 
                `Analysis complete. The top development is: ${first.title}.` : 
                `বিশ্লেষণ সম্পন্ন। প্রধান খবরটি হলো: ${first.title}।`;

            display.innerText = `"${brief}"`;
            speak(brief);

            // Generate HTML for the articles
            let html = `<p class="mb-6 font-bold text-white underline tracking-widest uppercase">Intel Reports Found: ${data.articles.length}</p>`;
            data.articles.slice(0, 5).forEach(art => {
                html += `
                    <div class="mb-6 pb-4 border-b border-white/5">
                        <h4 class="text-cyan-400 font-bold uppercase text-sm mb-1">${art.title}</h4>
                        <p class="text-xs opacity-50 mb-2">${art.description}</p>
                        <a href="${art.url}" target="_blank" class="text-[10px] text-white border border-white/20 px-2 py-1 rounded hover:bg-white/10 transition-all">FULL INTEL</a>
                    </div>
                `;
            });
            output.innerHTML = html;
        } else {
            const errorMsg = currentLang === 'en' ? "No live reports found for this query." : "এই বিষয়ের ওপর কোনো লাইভ রিপোর্ট পাওয়া যায়নি।";
            display.innerText = errorMsg;
            speak(errorMsg);
        }
    } catch (err) {
        display.innerText = "Connection failed. Intelligence link severed.";
    }

    setTimeout(() => avatar.classList.remove('speaking-pulse'), 5000);
}

function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Select the "Sexy/Smart" Female Voice
    const female = voices.find(v => v.name.includes('Google US English') || v.name.includes('Zira') || v.name.includes('Samantha'));
    if (female) msg.voice = female;

    msg.pitch = 1.3; // Sophisticated, high-status pitch
    msg.rate = 0.85; // Slow, commanding pace
    window.speechSynthesis.speak(msg);
}

// Pre-load voices
window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
