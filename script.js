/**
 * CONFIGURATION
 */
const apiKey = typeof CONFIG !== 'undefined' ? CONFIG.GEMINI_API_KEY : ""; 

// Flag to check if a preset is currently loading
let isPresetLoading = false;

/**
 * PRESETS (Hardware Selection for 2026)
 */
const PRESETS = {
    budget: {
        cpu: "Ryzen 5 9600X",
        cooler: "Peerless Assassin",
        mb: "MSI B650",
        gpu: "RTX 5060",  
        ram: "Vengeance",
        ssd: "SN770",
        psu: "Pure Power 12 M",
        case: "Arx 700"
    },
    midrange: {
        cpu: "Ryzen 7 9800X3D",
        cooler: "Dark Rock Elite",
        mb: "B850",
        gpu: "RTX 5070",
        ram: "Trident Z5",
        ssd: "Samsung 990 Pro",
        psu: "Vertex GX-1000",
        case: "North XL"
    },
    highend: {
        cpu: "Ryzen 9 9950X3D",
        cooler: "Liquid Freezer III",
        mb: "X870E",
        gpu: "RTX 5090", 
        ram: "Dominator Titanium",
        ssd: "T705",
        psu: "Dark Power Pro",
        case: "Hyte Y70"
    }
};

/**
 * Helper function: Resets all preset buttons to normal state
 */
function resetPresetButtons() {
    const btnBudget = document.getElementById('preset-budget');
    const btnMid = document.getElementById('preset-midrange');
    const btnHigh = document.getElementById('preset-highend');

    if (btnBudget) {
        btnBudget.classList.remove('btn-success');
        btnBudget.classList.add('btn-outline-success');
    }
    if (btnMid) {
        btnMid.classList.remove('btn-primary');
        btnMid.classList.add('btn-outline-primary');
    }
    if (btnHigh) {
        btnHigh.classList.remove('btn-danger');
        btnHigh.classList.add('btn-outline-danger');
    }
}

/**
 * Helper function: Sets a specific button to "Active" (filled)
 */
function activatePresetButton(type) {
    resetPresetButtons(); 
    
    let btn;
    let colorClass;
    
    if (type === 'budget') {
        btn = document.getElementById('preset-budget');
        colorClass = 'success';
    } else if (type === 'midrange') {
        btn = document.getElementById('preset-midrange');
        colorClass = 'primary';
    } else if (type === 'highend') {
        btn = document.getElementById('preset-highend');
        colorClass = 'danger';
    }

    if (btn) {
        btn.classList.remove(`btn-outline-${colorClass}`);
        btn.classList.add(`btn-${colorClass}`);
    }
}

/**
 * FUNCTION: Load Preset
 */
function loadPreset(type) {
    const preset = PRESETS[type];
    if (!preset) return;

    isPresetLoading = true; 

    activatePresetButton(type);

    const mapping = ['cpu', 'cooler', 'mb', 'gpu', 'ram', 'ssd', 'psu', 'case'];

    mapping.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].text.includes(preset[id])) {
                    select.selectedIndex = i;
                    update(select); 
                    break;
                }
            }
        }
    });

    isPresetLoading = false; 
}

/**
 * FUNCTION: update(select)
 * Calculates price and updates Amazon link
 */
function update(select) {
    if (!isPresetLoading) {
        resetPresetButtons();
    }

    const value = select.value;
    if (!value.includes(',')) return;
    
    const parts = value.split(',');
    const rawPrice = parseFloat(parts[0]);
    // Ensure 2 decimal places
    const formattedPrice = isNaN(rawPrice) ? "0.00" : rawPrice.toFixed(2);
    const link = parts.slice(1).join(','); 

    const row = select.closest('tr');
    const priceInput = row.querySelector('.price-input');
    if (priceInput) priceInput.value = formattedPrice;

    const linkButton = row.querySelector('a');
    if (linkButton) linkButton.href = link;

    calcTotal();
}

/**
 * Calculates total sum with 2 decimal precision
 */
function calcTotal() {
    let sum = 0;
    document.querySelectorAll("#hardware-table tbody tr").forEach(row => {
        const priceEl = row.querySelector('.price-input');
        if(priceEl) {
            const price = parseFloat(priceEl.value) || 0;
            sum += price;
        }
    });
    
    const totalEl = document.getElementById("total");
    if(totalEl) {
        if(totalEl.parentElement) {
            totalEl.parentElement.classList.remove('price-update-anim');
            void totalEl.offsetWidth; 
            totalEl.parentElement.classList.add('price-update-anim');
        }
        totalEl.textContent = sum.toFixed(2);
    }
}

// ==========================================
// AI LOGIC
// ==========================================

function getSelectedComponents() {
    let components = [];
    document.querySelectorAll('#hardware-table tbody tr').forEach(row => {
        const category = row.getAttribute('data-category');
        const select = row.querySelector('select');
        if(select && select.selectedIndex > -1) { 
            const selectedText = select.options[select.selectedIndex].text;
            components.push(`- ${category}: ${selectedText}`);
        }
    });
    return components.join('\n');
}

function toggleLoading(show) {
    const loadingEl = document.getElementById('ai-loading');
    const resultWrapper = document.getElementById('ai-result-wrapper');
    
    if(loadingEl) loadingEl.style.display = show ? 'flex' : 'none';
    if(resultWrapper && !show) resultWrapper.style.display = 'flex'; 
    
    if(resultWrapper && show) {
        resultWrapper.style.display = 'none';
    }
}

async function callGemini(prompt) {
    // API KEY checks removed as requested
    const cleanKey = apiKey.trim();

    const modelsToTry = [
        "gemini-2.5-flash", 
        "gemini-1.5-flash",
        "gemini-2.0-flash-exp"
    ];

    for (const model of modelsToTry) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                return data.candidates[0].content.parts[0].text;
            }
        } catch (error) {
            console.error(`Error with ${model}:`, error);
        }
    }

    return `Fehler: Die KI konnte keine Antwort generieren. Bitte überprüfe die Internetverbindung.`;
}

// UI Event Listener for Expand/Collapse
const btnResize = document.getElementById('btn-resize-ai');
const btnClose = document.getElementById('btn-close-expanded');

function toggleExpandedView() {
    const hwCol = document.getElementById('hardware-column');
    const aiCol = document.getElementById('ai-column');

    if(!hwCol || !aiCol) return;

    const isExpanded = aiCol.classList.contains('col-lg-8');

    if (isExpanded) {
        hwCol.classList.remove('col-lg-4');
        hwCol.classList.add('col-lg-8');
        aiCol.classList.remove('col-lg-8');
        aiCol.classList.add('col-lg-4');
        resetButtons(false);
    } else {
        hwCol.classList.remove('col-lg-8');
        hwCol.classList.add('col-lg-4');
        aiCol.classList.remove('col-lg-4');
        aiCol.classList.add('col-lg-8');
        resetButtons(true);
    }
}

function resetButtons(isExpanded) {
    if(isExpanded) {
        if(btnResize) btnResize.style.display = 'none';
        if(btnClose) btnClose.style.display = 'inline-block';
    } else {
        if(btnResize) btnResize.style.display = 'inline-block';
        if(btnClose) btnClose.style.display = 'none';
    }
}

if(btnResize) btnResize.addEventListener('click', toggleExpandedView);
if(btnClose) btnClose.addEventListener('click', toggleExpandedView);

// 1. Button: Check System
const btnCheck = document.getElementById('btn-check-build');
if(btnCheck) {
    btnCheck.addEventListener('click', async () => {
        const components = getSelectedComponents();
        const prompt = `Analysiere diese PC-Konfiguration (2026):
        ${components}
        Prüfe kurz Kompatibilität, Flaschenhälse und ob das Netzteil reicht. Antworte in Markdown.`;

        toggleLoading(true);
        const result = await callGemini(prompt);
        toggleLoading(false);
        
        const outputBox = document.getElementById('ai-output');
        if(typeof marked !== 'undefined') {
            outputBox.innerHTML = marked.parse(result);
        } else {
            outputBox.innerHTML = result;
        }
    });
}

// 2. Button: Ask Question
const btnAsk = document.getElementById('btn-ask-ai');
if(btnAsk) {
    btnAsk.addEventListener('click', async () => {
        const inputField = document.getElementById('ai-question-input');
        const question = inputField ? inputField.value : "";
        if(!question) return;

        const components = getSelectedComponents();
        const prompt = `PC-Konfig: ${components}\nFrage: ${question}\nAntworte kurz.`;

        toggleLoading(true);
        const result = await callGemini(prompt);
        toggleLoading(false);
        
        const outputBox = document.getElementById('ai-output');
        if(typeof marked !== 'undefined') {
            outputBox.innerHTML = marked.parse(result);
        } else {
            outputBox.innerHTML = result;
        }
    });
}

// ==========================================
// DARK MODE LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    if (document.getElementById('hardware-table')) {
        loadPreset('midrange');
        calcTotal();
    }
});