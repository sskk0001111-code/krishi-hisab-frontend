let currentLang = 'bn';

const langData = {
    bn: {
        title: "কৃষি হিসাব - বিঘা-কাঠা ক্যালকুলেটর",
        typeLabel: "হিসাবের ধরন নির্বাচন করুন:",
        areaCrop: "জমির পরিমাণ (বিঘা):",
        areaPond: "পুকুরের আয়তন (কাঠা):",
        btn: "হিসাব করুন",
        error: "অনুগ্রহ করে সঠিক সংখ্যা দিন।",
        seed: "বীজ লাগবে:",
        urea: "ইউরিয়া সার:",
        dap: "ডিএপি (DAP):",
        mop: "পটাশ (MOP):",
        lime: "চুন লাগবে:",
        gobor: "গোবর সার:",
        khail: "সরিষার খৈল:"
    },
    en: {
        title: "Krishi Hisab - Farm Calculator",
        typeLabel: "Select Calculation Type:",
        areaCrop: "Land Area (Bigha):",
        areaPond: "Pond Area (Katha):",
        btn: "Calculate",
        error: "Please enter a valid number.",
        seed: "Seed Required:",
        urea: "Urea Fertilizer:",
        dap: "DAP Fertilizer:",
        mop: "Potash (MOP):",
        lime: "Lime Required:",
        gobor: "Cow Dung Manure:",
        khail: "Mustard Cake:"
    }
};

const rates = {
    dhan: { unit: 'bigha', seed: 6, urea: 20, dap: 15, mop: 10 },
    alu: { unit: 'bigha', seed: 250, urea: 35, dap: 40, mop: 30 },
    sorshe: { unit: 'bigha', seed: 1.2, urea: 12, dap: 15, mop: 8 },
    pukur: { unit: 'katha', lime: 2.5, gobor: 15, khail: 1.5 }
};

function switchLang(lang) {
    currentLang = lang;
    document.getElementById('calc-title').innerText = langData[lang].title;
    document.getElementById('type-label').innerText = langData[lang].typeLabel;
    document.getElementById('calc-btn').innerText = langData[lang].btn;
    updateForm();
    document.getElementById('result-box').style.display = 'none';
}

function updateForm() {
    const type = document.getElementById('calc-type').value;
    const areaLabel = document.getElementById('area-label');
    areaLabel.innerText = rates[type].unit === 'bigha' ? langData[currentLang].areaCrop : langData[currentLang].areaPond;
}

async function calculateFarm() {
    const areaInput = parseFloat(document.getElementById('land-area').value);
    const type = document.getElementById('calc-type').value;
    const resBox = document.getElementById('result-box');
    const t = langData[currentLang];

    if (isNaN(areaInput) || areaInput <= 0) {
        alert(t.error);
        return;
    }

    const r = rates[type];
    let outputHtml = "";

    if (type === 'pukur') {
        outputHtml = `
            <strong>${t.lime}</strong> ${(r.lime * areaInput).toFixed(2)} kg<br>
            <strong>${t.gobor}</strong> ${(r.gobor * areaInput).toFixed(2)} kg<br>
            <strong>${t.khail}</strong> ${(r.khail * areaInput).toFixed(2)} kg
        `;
    } else {
        outputHtml = `
            <strong>${t.seed}</strong> ${(r.seed * areaInput).toFixed(2)} kg<br>
            <strong>${t.urea}</strong> ${(r.urea * areaInput).toFixed(2)} kg<br>
            <strong>${t.dap}</strong> ${(r.dap * areaInput).toFixed(2)} kg<br>
            <strong>${t.mop}</strong> ${(r.mop * areaInput).toFixed(2)} kg
        `;
    }

    resBox.innerHTML = outputHtml;
    resBox.style.display = 'block';

    // Background Render + Supabase logging (User experience wait korabe na)
    try {
        fetch('https://krishi-hisab-api.onrender.com/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ crop_type: type, land_area: areaInput })
        });
    } catch (e) {
        console.log("Log error:", e);
    }
}
