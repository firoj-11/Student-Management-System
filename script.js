/* ============================================================
   DATA MODEL
============================================================ */
const SUBJECTS = ['Math','Science','English','History','Art'];
const CLASSES = ['Grade 9','Grade 10','Grade 11','Grade 12'];
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#6d5df6,#46a0fc)',
  'linear-gradient(135deg,#1fcfa8,#63e6c4)',
  'linear-gradient(135deg,#ff6b81,#ffa07a)',
  'linear-gradient(135deg,#ffb648,#ffd76b)',
  'linear-gradient(135deg,#a06df6,#f646d1)',
  'linear-gradient(135deg,#46c6fc,#46f6d5)'
];
const FIRST_NAMES = ['Ananya','Rohan','Priya','Kabir','Ishita','Aarav','Meera','Vivaan','Sara','Dev','Naina','Yusuf','Tanvi','Arjun','Diya','Kian','Riya','Sameer','Neha','Omar'];
const LAST_NAMES = ['Sharma','Verma','Iyer','Khan','Reddy','Nair','Kapoor','Bose','Malhotra','Rao','Singh','Das','Chatterjee','Mehta','Patel'];

let state = {
  students: [],
  editingId: null,
  deletingId: null,
  currentStatus: 'active',
  attendanceDate: todayISO(),
  currentDrawerId: null
};

function todayISO(){ return new Date().toISOString().slice(0,10); }
function uid(){ return 'S' + Math.random().toString(36).slice(2,9); }
function hashPick(arr, seed){
  let h = 0; for(const c of seed) h = (h*31 + c.charCodeAt(0)) % 100000;
  return arr[h % arr.length];
}
function initials(name){ return name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase(); }
function letterGrade(score){
  if(score>=90) return 'A'; if(score>=80) return 'B'; if(score>=70) return 'C'; if(score>=60) return 'D'; return 'F';
}
function gradeColor(letter){
  return {A:'var(--grad-mint)',B:'var(--grad-primary)',C:'var(--grad-amber)',D:'linear-gradient(135deg,#ff9f43,#ffb648)',F:'var(--grad-coral)'}[letter];
}
function dateMinus(n){
  const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10);
}

function seedData(){
  const list = [];
  for(let i=0;i<18;i++){
    const name = FIRST_NAMES[i % FIRST_NAMES.length] + ' ' + LAST_NAMES[(i*3) % LAST_NAMES.length];
    const cls = CLASSES[i % CLASSES.length];
    const section = ['A','B','C'][i % 3];
    const grades = {};
    SUBJECTS.forEach((s,idx)=>{ grades[s] = 55 + Math.floor(((i*13+idx*17)%46)); });
    const attendance = {};
    for(let d=0; d<21; d++){
      const r = (i*7+d*3) % 10;
      attendance[dateMinus(d)] = r < 7 ? 'present' : (r < 9 ? 'absent' : 'late');
    }
    list.push({
      id: uid(),
      name,
      email: name.toLowerCase().replace(' ','.') + '@meridianhigh.edu',
      phone: '+91 9' + (100000000 + i*7654321 % 899999999),
      gender: i%3===0?'Male':(i%3===1?'Female':'Other'),
      cls, section,
      enrollDate: dateMinus(200 - i*4),
      status: i % 9 === 0 ? 'inactive' : 'active',
      avatar: hashPick(AVATAR_GRADIENTS, name),
      grades,
      attendance
    });
  }
  return list;
}

/* ============================================================
   ICONS (inline helpers)
============================================================ */
const ICO = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  trend:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  award:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></svg>',
  grad:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5Z"/><path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5"/></svg>'
};

/* ============================================================
   RENDER: NAVIGATION
============================================================ */
document.querySelectorAll('.nav-item').forEach(btn=>{
  btn.addEventListener('click', ()=> switchView(btn.dataset.view));
});
function switchView(view){
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active', v.id === 'view-'+view));
  closeSidebarMobile();
  if(view==='reports') renderReports();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.getElementById('hamburgerBtn').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
});
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebarMobile);
function closeSidebarMobile(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

/* ============================================================
   DASHBOARD
============================================================ */
let attendanceChartInst=null, gradeChartInst=null;

function computeStats(){
  const total = state.students.length;
  const active = state.students.filter(s=>s.status==='active').length;
  let presentToday=0, recordedToday=0;
  state.students.forEach(s=>{
    const rec = s.attendance[state.attendanceDate] || s.attendance[todayISO()];
    if(rec){ recordedToday++; if(rec==='present') presentToday++; }
  });
  const attRate = recordedToday? Math.round(presentToday/recordedToday*100) : 0;
  let gradeSum=0, gradeCount=0;
  state.students.forEach(s=>{ SUBJECTS.forEach(su=>{ gradeSum += s.grades[su]; gradeCount++; }); });
  const avgGrade = gradeCount ? Math.round(gradeSum/gradeCount) : 0;
  const classesActive = new Set(state.students.map(s=>s.cls)).size;
  return {total, active, attRate, avgGrade, classesActive};
}

function renderStatCards(){
  const st = computeStats();
  const grid = document.getElementById('statGrid');
  const cards = [
    {label:'Total Students', value: st.total, icon:ICO.users, grad:'var(--grad-primary)', trend:'+'+Math.max(1,Math.round(st.total*0.08))+' this term', up:true},
    {label:"Today's Attendance", value: st.attRate+'%', icon:ICO.cal, grad:'var(--grad-mint)', trend: st.attRate>=75? 'On track':'Needs attention', up: st.attRate>=75},
    {label:'Average Grade', value: st.avgGrade+'%', icon:ICO.award, grad:'var(--grad-amber)', trend: letterGrade(st.avgGrade)+' average', up: st.avgGrade>=70},
    {label:'Active Classes', value: st.classesActive, icon:ICO.grad, grad:'var(--grad-coral)', trend: st.active+' active students', up:true},
  ];
  grid.innerHTML = cards.map(c=>`
    <div class="card stat-card" style="--accent-grad:${c.grad}">
      <div class="stat-top">
        <div class="stat-icon" style="background:${c.grad}">${c.icon}</div>
        <span class="stat-trend ${c.up?'trend-up':'trend-down'}">${c.trend}</span>
      </div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-label">${c.label}</div>
    </div>
  `).join('');
  document.getElementById('navStudentCount').textContent = st.total;
}

function renderAttendanceChart(){
  const ctx = document.getElementById('attendanceChart');
  const labels = []; const data = [];
  for(let i=6;i>=0;i--){
    const d = dateMinus(i);
    labels.push(new Date(d).toLocaleDateString('en-US',{weekday:'short'}));
    let present=0, total=0;
    state.students.forEach(s=>{ const r=s.attendance[d]; if(r){total++; if(r==='present') present++;} });
    data.push(total? Math.round(present/total*100) : 0);
  }
  if(attendanceChartInst) attendanceChartInst.destroy();
  attendanceChartInst = new Chart(ctx, {
    type:'line',
    data:{ labels, datasets:[{
      label:'Attendance %', data,
      borderColor:'#6d5df6', borderWidth:3, tension:0.4, fill:true,
      backgroundColor: (c)=>{
        const g = c.chart.ctx.createLinearGradient(0,0,0,220);
        g.addColorStop(0,'rgba(109,93,246,0.28)'); g.addColorStop(1,'rgba(109,93,246,0.02)');
        return g;
      },
      pointBackgroundColor:'#fff', pointBorderColor:'#6d5df6', pointBorderWidth:2, pointRadius:5, pointHoverRadius:7
    }]},
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false}, tooltip:{backgroundColor:'#1c2033', padding:10, cornerRadius:10, displayColors:false}},
      scales:{
        y:{min:0,max:100,grid:{color:'rgba(28,32,51,0.06)'}, ticks:{callback:v=>v+'%', color:'#9aa1b5', font:{size:11}}},
        x:{grid:{display:false}, ticks:{color:'#9aa1b5', font:{size:11,weight:600}}}
      }
    }
  });
}

function renderGradeChart(){
  const ctx = document.getElementById('gradeChart');
  const buckets = {A:0,B:0,C:0,D:0,F:0};
  state.students.forEach(s=>{ SUBJECTS.forEach(su=>{ buckets[letterGrade(s.grades[su])]++; }); });
  const colors = {A:'#1fcfa8',B:'#6d5df6',C:'#ffb648',D:'#ff9f43',F:'#ff6b81'};
  if(gradeChartInst) gradeChartInst.destroy();
  gradeChartInst = new Chart(ctx, {
    type:'doughnut',
    data:{ labels:Object.keys(buckets), datasets:[{ data:Object.values(buckets), backgroundColor:Object.keys(buckets).map(k=>colors[k]), borderWidth:0, hoverOffset:6 }]},
    options:{ responsive:true, maintainAspectRatio:false, cutout:'68%', plugins:{legend:{display:false}, tooltip:{backgroundColor:'#1c2033', padding:10, cornerRadius:10}} }
  });
  document.getElementById('gradeLegend').innerHTML = Object.keys(buckets).map(k=>`
    <div class="legend-item"><span class="legend-dot" style="background:${colors[k]}"></span>Grade ${k} · ${buckets[k]}</div>
  `).join('');
}

function studentAvgGrade(s){
  const vals = SUBJECTS.map(su=>s.grades[su]);
  return Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
}
function studentAttendanceRate(s){
  const entries = Object.values(s.attendance);
  if(!entries.length) return 0;
  const present = entries.filter(v=>v==='present').length;
  return Math.round(present/entries.length*100);
}

function renderRecentStudents(){
  const recent = [...state.students].sort((a,b)=> b.enrollDate.localeCompare(a.enrollDate)).slice(0,5);
  document.getElementById('recentStudentsList').innerHTML = recent.map(s=>personRowHTML(s, true)).join('') || emptyRow();
}

function emptyRow(){ return `<div class="empty-state"><p>No students yet — add your first one.</p></div>`; }

function personRowHTML(s, compact){
  const avg = studentAvgGrade(s);
  const letter = letterGrade(avg);
  return `
  <div class="person-row" data-id="${s.id}">
    <div class="avatar" style="background:${s.avatar}">${initials(s.name)}</div>
    <div class="person-info">
      <div class="person-name">${s.name}</div>
      <div class="person-meta">${s.email}</div>
    </div>
    <span class="pill pill-class">${s.cls} · ${s.section}</span>
    ${compact? '' : `<span class="pill ${s.status==='active'?'pill-active':'pill-inactive'}">${s.status}</span>`}
    <div class="grade-badge" style="background:${gradeColor(letter)}" title="Average ${avg}%">${letter}</div>
    <div class="row-actions">
      <button class="icon-btn-sm" title="View" onclick="openDrawer('${s.id}')">${ICO.eye}</button>
      <button class="icon-btn-sm" title="Edit" onclick="openStudentModal('${s.id}')">${ICO.edit}</button>
      <button class="icon-btn-sm danger" title="Delete" onclick="openDeleteModal('${s.id}')">${ICO.trash}</button>
    </div>
  </div>`;
}

function renderDashboard(){
  document.getElementById('dateLine').textContent = new Date().toLocaleDateString('en-US',{weekday:'long', year:'numeric', month:'long', day:'numeric'});
  renderStatCards();
  renderAttendanceChart();
  renderGradeChart();
  renderRecentStudents();
}

/* ============================================================
   STUDENTS VIEW
============================================================ */
function populateClassFilters(){
  ['classFilter','attClassFilter','gradeClassFilter'].forEach(id=>{
    const sel = document.getElementById(id);
    const cur = sel.value;
    sel.innerHTML = '<option value="">All Classes</option>' + CLASSES.map(c=>`<option value="${c}">${c}</option>`).join('');
    sel.value = cur;
  });
  const subjSel = document.getElementById('gradeSubjectFilter');
  subjSel.innerHTML = SUBJECTS.map(s=>`<option value="${s}">${s}</option>`).join('');
}

function getFilteredStudents(){
  const q = (document.getElementById('studentSearch').value || '').toLowerCase();
  const cls = document.getElementById('classFilter').value;
  const status = document.getElementById('statusFilter').value;
  return state.students.filter(s=>{
    const matchQ = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.cls.toLowerCase().includes(q);
    const matchC = !cls || s.cls===cls;
    const matchS = !status || s.status===status;
    return matchQ && matchC && matchS;
  });
}

function renderStudentsList(){
  const list = getFilteredStudents();
  const container = document.getElementById('studentsList');
  const empty = document.getElementById('studentsEmpty');
  if(!list.length){ container.innerHTML=''; empty.style.display='block'; return; }
  empty.style.display='none';
  container.innerHTML = list.map(s=>personRowHTML(s,false)).join('');
}

['studentSearch','classFilter','statusFilter'].forEach(id=>{
  document.getElementById(id).addEventListener('input', renderStudentsList);
});
document.getElementById('globalSearch').addEventListener('input', (e)=>{
  document.getElementById('studentSearch').value = e.target.value;
  switchView('students');
  renderStudentsList();
});

/* Student modal (add/edit) */
function openStudentModal(id){
  state.editingId = id || null;
  const backdrop = document.getElementById('studentModalBackdrop');
  document.getElementById('studentModalTitle').textContent = id ? 'Edit Student' : 'Add Student';
  if(id){
    const s = state.students.find(x=>x.id===id);
    document.getElementById('f_name').value = s.name;
    document.getElementById('f_email').value = s.email;
    document.getElementById('f_phone').value = s.phone;
    document.getElementById('f_gender').value = s.gender;
    document.getElementById('f_class').value = s.cls;
    document.getElementById('f_section').value = s.section;
    document.getElementById('f_enroll').value = s.enrollDate;
    setStatus(s.status);
  } else {
    document.getElementById('studentForm').reset();
    document.getElementById('f_enroll').value = todayISO();
    setStatus('active');
  }
  backdrop.classList.add('open');
}
function closeStudentModal(){ document.getElementById('studentModalBackdrop').classList.remove('open'); }
function setStatus(s){
  state.currentStatus = s;
  document.getElementById('statusActiveBtn').classList.toggle('selected', s==='active');
  document.getElementById('statusInactiveBtn').classList.toggle('selected', s==='inactive');
}
function submitStudentForm(){
  const name = document.getElementById('f_name').value.trim();
  const email = document.getElementById('f_email').value.trim();
  if(!name || !email){ showToast('Please fill in name and email.', 'error'); return; }
  const payload = {
    name, email,
    phone: document.getElementById('f_phone').value.trim(),
    gender: document.getElementById('f_gender').value,
    cls: document.getElementById('f_class').value,
    section: document.getElementById('f_section').value,
    enrollDate: document.getElementById('f_enroll').value || todayISO(),
    status: state.currentStatus
  };
  if(state.editingId){
    const s = state.students.find(x=>x.id===state.editingId);
    Object.assign(s, payload);
    showToast('Student profile updated.', 'success');
  } else {
    state.students.unshift({
      id: uid(), ...payload,
      avatar: hashPick(AVATAR_GRADIENTS, name),
      grades: Object.fromEntries(SUBJECTS.map(s=>[s, 65+Math.floor(Math.random()*30)])),
      attendance: {}
    });
    showToast('New student added.', 'success');
  }
  closeStudentModal();
  refreshAll();
}

/* Delete */
function openDeleteModal(id){
  state.deletingId = id;
  const s = state.students.find(x=>x.id===id);
  document.getElementById('deleteModalText').textContent = `Remove ${s.name} from the system? This action can't be undone.`;
  document.getElementById('deleteModalBackdrop').classList.add('open');
}
function closeDeleteModal(){ document.getElementById('deleteModalBackdrop').classList.remove('open'); state.deletingId=null; }
function confirmDelete(){
  state.students = state.students.filter(s=>s.id!==state.deletingId);
  showToast('Student removed.', 'success');
  closeDeleteModal();
  refreshAll();
}

/* ============================================================
   ATTENDANCE VIEW
============================================================ */
function renderAttendanceView(){
  document.getElementById('attDate').value = state.attendanceDate;
  const cls = document.getElementById('attClassFilter').value;
  const list = state.students.filter(s=> !cls || s.cls===cls);
  const container = document.getElementById('attendanceList');
  container.innerHTML = list.map(s=>{
    const rec = s.attendance[state.attendanceDate] || 'present';
    return `
    <div class="person-row" data-att-id="${s.id}">
      <div class="avatar" style="background:${s.avatar}">${initials(s.name)}</div>
      <div class="person-info">
        <div class="person-name">${s.name}</div>
        <div class="person-meta">${s.cls} · ${s.section}</div>
      </div>
      <div class="att-toggle-group">
        <button class="att-toggle p ${rec==='present'?'selected':''}" onclick="setAttMark('${s.id}','present')">P</button>
        <button class="att-toggle l ${rec==='late'?'selected':''}" onclick="setAttMark('${s.id}','late')">L</button>
        <button class="att-toggle a ${rec==='absent'?'selected':''}" onclick="setAttMark('${s.id}','absent')">A</button>
      </div>
    </div>`;
  }).join('') || emptyRow();
  renderAttSummary(list);
}
function setAttMark(id, mark){
  const s = state.students.find(x=>x.id===id);
  s.attendance[state.attendanceDate] = mark;
  renderAttendanceView();
}
function renderAttSummary(list){
  let p=0,a=0,l=0;
  list.forEach(s=>{
    const rec = s.attendance[state.attendanceDate];
    if(rec==='present') p++; else if(rec==='absent') a++; else if(rec==='late') l++;
  });
  document.getElementById('attSummary').innerHTML = `
    <div class="att-chip"><span class="att-dot" style="background:#1fcfa8"></span>Present: ${p}</div>
    <div class="att-chip"><span class="att-dot" style="background:#ffb648"></span>Late: ${l}</div>
    <div class="att-chip"><span class="att-dot" style="background:#ff6b81"></span>Absent: ${a}</div>
    <div class="att-chip"><span class="att-dot" style="background:#6d5df6"></span>Total: ${list.length}</div>
  `;
}
document.getElementById('attDate').addEventListener('change', (e)=>{
  state.attendanceDate = e.target.value || todayISO();
  renderAttendanceView();
});
document.getElementById('attClassFilter').addEventListener('change', renderAttendanceView);
function saveAttendance(){ showToast('Attendance saved for ' + state.attendanceDate + '.', 'success'); renderDashboard(); }

/* ============================================================
   GRADES VIEW
============================================================ */
function renderGradesView(){
  const cls = document.getElementById('gradeClassFilter').value;
  const subj = document.getElementById('gradeSubjectFilter').value || SUBJECTS[0];
  const list = state.students.filter(s=> !cls || s.cls===cls);
  document.getElementById('gradeTableBody').innerHTML = list.map(s=>{
    const score = s.grades[subj];
    const letter = letterGrade(score);
    const avg = studentAvgGrade(s);
    return `
    <tr>
      <td><div style="display:flex;align-items:center;gap:10px;"><div class="avatar" style="width:32px;height:32px;font-size:11.5px;background:${s.avatar}">${initials(s.name)}</div>${s.name}</div></td>
      <td>${s.cls} · ${s.section}</td>
      <td><input type="number" min="0" max="100" class="grade-input" value="${score}" onchange="updateGrade('${s.id}','${subj}',this.value)"></td>
      <td><span class="grade-badge" style="background:${gradeColor(letter)};width:30px;height:30px;font-size:12px;">${letter}</span></td>
      <td class="avg-cell">${avg}%</td>
    </tr>`;
  }).join('') || `<tr><td colspan="5"><div class="empty-state"><p>No students found.</p></div></td></tr>`;
}
function updateGrade(id, subj, val){
  const s = state.students.find(x=>x.id===id);
  let v = parseInt(val,10); if(isNaN(v)) v=0; v = Math.max(0,Math.min(100,v));
  s.grades[subj] = v;
  showToast(`Updated ${subj} score for ${s.name}.`, 'success');
  renderGradesView();
  renderStatCards();
  renderGradeChart();
}
document.getElementById('gradeClassFilter').addEventListener('change', renderGradesView);
document.getElementById('gradeSubjectFilter').addEventListener('change', renderGradesView);

/* ============================================================
   REPORTS VIEW
============================================================ */
function renderReports(){
  const rows = CLASSES.map(cls=>{
    const list = state.students.filter(s=>s.cls===cls);
    if(!list.length) return {cls, count:0, avg:0, att:0};
    const avg = Math.round(list.reduce((a,s)=>a+studentAvgGrade(s),0)/list.length);
    const att = Math.round(list.reduce((a,s)=>a+studentAttendanceRate(s),0)/list.length);
    return {cls, count:list.length, avg, att};
  });
  document.getElementById('reportsList').innerHTML = rows.map(r=>`
    <div class="person-row">
      <div class="avatar" style="background:var(--grad-primary)">${r.cls.split(' ')[1]}</div>
      <div class="person-info">
        <div class="person-name">${r.cls}</div>
        <div class="person-meta">${r.count} students enrolled</div>
      </div>
      <span class="pill pill-class">Avg grade ${r.avg}%</span>
      <span class="pill ${r.att>=75?'pill-active':'pill-inactive'}">Attendance ${r.att}%</span>
    </div>
  `).join('');
}

/* ============================================================
   STUDENT DETAIL DRAWER
============================================================ */
function openDrawer(id){
  state.currentDrawerId = id;
  const s = state.students.find(x=>x.id===id);
  document.getElementById('drawerHeadContent').innerHTML = `
    <div class="drawer-head">
      <div>
        <div class="avatar" style="background:rgba(255,255,255,0.28)">${initials(s.name)}</div>
        <div class="drawer-name">${s.name}</div>
        <div class="drawer-meta">${s.cls} · Section ${s.section}</div>
      </div>
      <button class="modal-close" style="background:rgba(255,255,255,0.2);" onclick="closeDrawer()"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>`;
  document.getElementById('tab-profile').innerHTML = `
    <div class="info-line">${ICO.mail}<span class="lbl">Email</span>${s.email}</div>
    <div class="info-line">${ICO.phone}<span class="lbl">Phone</span>${s.phone||'—'}</div>
    <div class="info-line">${ICO.cal}<span class="lbl">Enrolled</span>${s.enrollDate}</div>
    <div class="info-line">${ICO.users}<span class="lbl">Gender</span>${s.gender}</div>
    <div class="info-line" style="border-bottom:none;"><span class="lbl">Status</span><span class="pill ${s.status==='active'?'pill-active':'pill-inactive'}">${s.status}</span></div>
    <div class="modal-actions" style="margin-top:18px;">
      <button class="btn btn-ghost btn-sm" onclick="closeDrawer(); openStudentModal('${s.id}')">${ICO.edit} Edit</button>
      <button class="btn btn-danger btn-sm" onclick="closeDrawer(); openDeleteModal('${s.id}')">${ICO.trash} Remove</button>
    </div>
  `;
  document.getElementById('tab-grades').innerHTML = SUBJECTS.map(su=>{
    const score = s.grades[su]; const letter = letterGrade(score);
    return `<div class="info-line"><span class="lbl">${su}</span><span style="flex:1">${score}%</span><span class="grade-badge" style="width:28px;height:28px;font-size:11px;background:${gradeColor(letter)}">${letter}</span></div>`;
  }).join('') + `<div class="info-line" style="border-bottom:none;font-weight:800;"><span class="lbl">Average</span>${studentAvgGrade(s)}%</div>`;
  const days = [];
  for(let i=13;i>=0;i--){ days.push(dateMinus(i)); }
  document.getElementById('tab-attendance').innerHTML = `
    <p class="card-sub" style="margin-bottom:10px;">Last 14 days · Attendance rate ${studentAttendanceRate(s)}%</p>
    <div class="mini-att-grid">${days.map(d=>{
      const r = s.attendance[d];
      const bg = r==='present'?'#1fcfa8':(r==='late'?'#ffb648':(r==='absent'?'#ff6b81':'#e4e6f2'));
      const lbl = r? r[0].toUpperCase() : '·';
      return `<div class="mini-att-cell" style="background:${bg}" title="${d}: ${r||'no record'}">${lbl}</div>`;
    }).join('')}</div>
  `;
  document.getElementById('studentDrawer').classList.add('open');
  document.getElementById('drawerBackdrop').classList.add('open');
}
function closeDrawer(){
  document.getElementById('studentDrawer').classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('open');
}
function switchTab(tab){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active', p.id==='tab-'+tab));
}

/* ============================================================
   TOAST
============================================================ */
function showToast(msg, type){
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = 'toast ' + (type||'success');
  el.innerHTML = (type==='error'? ICO.alert : ICO.check) + `<span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(8px)'; el.style.transition='all 0.3s ease'; setTimeout(()=>el.remove(),300); }, 2600);
}

/* ============================================================
   INIT / REFRESH
============================================================ */
function refreshAll(){
  populateClassFilters();
  renderDashboard();
  renderStudentsList();
  renderAttendanceView();
  renderGradesView();
}
function init(){
  state.students = seedData();
  populateClassFilters();
  refreshAll();
}
init();
