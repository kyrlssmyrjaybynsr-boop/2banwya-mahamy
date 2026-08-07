let subjects = JSON.parse(localStorage.getItem("subjects_v2")) || [
    {name: "عربي", plan: "", done: false},
    {name: "تاريخ", plan: "", done: false},
    {name: "برمجه", plan: "", done: false},
    {name: "انجليزي", plan: "", done: false}
];
let notes = JSON.parse(localStorage.getItem("notes_v2")) || {};
let weekData = JSON.parse(localStorage.getItem("weekData_v2")) || {};

const subjectsList = document.getElementById("subjectsList");
const datePicker = document.getElementById("datePicker");
const notesArea = document.getElementById("notes");

function saveData() {
    localStorage.setItem("subjects_v2", JSON.stringify(subjects));
    localStorage.setItem("notes_v2", JSON.stringify(notes));
    localStorage.setItem("weekData_v2", JSON.stringify(weekData));
}

function renderSubjects() {
    subjectsList.innerHTML = "";
    subjects.forEach((subject, index) => {
        const card = document.createElement("div");
        card.classList.add("subject-card", `card-${index % 4}`);
        card.innerHTML = `
            <div class="subject-header">
                <input type="checkbox" class="subject-checkbox" ${subject.done? 'checked' : ''} onchange="toggleDone(${index})">
                <span class="subject-name ${subject.done? 'done' : ''}">${subject.name}</span>
            </div>
            <textarea class="plan-input" placeholder="المطلوب مذاكرته..." oninput="updatePlan(${index}, this.value)">${subject.plan}</textarea>
        `;
        subjectsList.appendChild(card);
    });
}

// كود الجدول الجديد
const days = ["السبت", "الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعة"];
const weekBody = document.getElementById("weekBody");
document.getElementById("weekName").value = weekData.weekName || '';

days.forEach(day => {
    let row = `<tr><td><b>${day}</b></td>`;
    for(let i=0; i<3; i++){
        let key = `${day}-${i}`;
        let val = weekData[key] || '';
        row += `<td><input type="text" value="${val}" placeholder="المادة" oninput="saveWeek('${key}', this.value)"></td>`;
    }
    row += `</tr>`;
    weekBody.innerHTML += row;
});

function saveWeek(key, value){
    weekData[key] = value;
    saveData();
}
document.getElementById("weekName").oninput = (e) => {
    weekData.weekName = e.target.value;
    saveData();
}

datePicker.valueAsDate = new Date();
loadNotes();
datePicker.addEventListener("change", loadNotes);
document.getElementById("saveNoteBtn").addEventListener("click", () => {
    notes[datePicker.value] = notesArea.value; saveData(); alert("تم حفظ الملاحظة ✓");
});
function loadNotes() { notesArea.value = notes[datePicker.value] || ""; }
function toggleDone(index) { subjects[index].done =!subjects[index].done; saveData(); renderSubjects(); }
function updatePlan(index, value) { subjects[index].plan = value; saveData(); }

let swTime = 0, swInterval, swRunning = false;
document.getElementById("swStart").onclick = () => {
    swRunning =!swRunning;
    document.getElementById("swStart").innerText = swRunning? "ايقاف" : "استكمال";
    if(swRunning) swInterval = setInterval(() => { swTime++; updateSW(); }, 1000);
    else clearInterval(swInterval);
}
document.getElementById("swReset").onclick = () => {
    swTime = 0; clearInterval(swInterval); swRunning = false;
    document.getElementById("swStart").innerText = "ابدأ"; updateSW();
}
function updateSW() {
    let h = Math.floor(swTime / 3600); let m = Math.floor((swTime % 3600) / 60); let s = swTime % 60;
    document.getElementById("stopwatch").innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

let timerTime = 60*60, timerInterval, timerRunning = false;
const timerInput = document.getElementById("timerInput");
document.getElementById("timerStart").onclick = () => {
    if(!timerRunning){
        timerTime = timerInput.value * 60; timerRunning = true;
        document.getElementById("timerStart").innerText = "ايقاف";
        timerInterval = setInterval(updateTimer, 1000);
    } else {
        timerRunning = false; document.getElementById("timerStart").innerText = "استكمال"; clearInterval(timerInterval);
    }
}
document.getElementById("timerReset").onclick = () => {
    timerRunning = false; clearInterval(timerInterval);
    timerTime = timerInput.value * 60; document.getElementById("timerStart").innerText = "ابدأ"; updateTimerDisplay();
}
function updateTimer() {
    timerTime--; updateTimerDisplay();
    if(timerTime <= 0){
        clearInterval(timerInterval); timerRunning = false;
        document.getElementById("alarmSound").play(); alert("⏰ الوقت خلص! خد بريك");
    }
}
function updateTimerDisplay() {
    let m = Math.floor(timerTime / 60); let s = timerTime % 60;
    document.getElementById("timer").innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

renderSubjects(); updateTimerDisplay(); updateSW();