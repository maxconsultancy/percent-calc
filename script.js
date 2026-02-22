// Initialize state from LocalStorage
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
updateHistoryUI();

function calculate() {
    const p = document.getElementById('percent').value;
    const n = document.getElementById('num').value;
    
    if (p === "" || n === "") return;

    const res = (parseFloat(p) / 100) * parseFloat(n);
    const formattedRes = Number.isInteger(res) ? res : res.toFixed(2);
    
    document.getElementById('result').innerText = `Result: ${formattedRes}`;

    // Add to History (Maximum 5 items)
    const entry = `${p}% of ${n} = ${formattedRes}`;
    history.unshift(entry);
    if (history.length > 5) history.pop();
    
    saveAndUpdate();
}

function deleteHistoryItem(index) {
    history.splice(index, 1);
    saveAndUpdate();
}

function saveAndUpdate() {
    localStorage.setItem('calcHistory', JSON.stringify(history));
    updateHistoryUI();
}

function updateHistoryUI() {
    const list = document.getElementById('history-list');
    list.innerHTML = history.map((item, index) => `
        <li>
            <span>${item}</span>
            <button class="delete-btn" onclick="deleteHistoryItem(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </li>
    `).join('');
}

function clearFields() {
    document.getElementById('percent').value = "";
    document.getElementById('num').value = "";
    document.getElementById('result').innerText = "Result: --";
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('theme-toggle').innerText = isDark ? "☀️" : "🌙";
}

async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Calculation Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);
    
    doc.setFontSize(12);
    if (history.length === 0) {
        doc.text("No history found.", 20, 50);
    } else {
        history.forEach((item, i) => {
            doc.text(`${i + 1}. ${item}`, 20, 50 + (i * 10));
        });
    }
    doc.save("history.pdf");
}
