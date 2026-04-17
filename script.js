/* WANO CLOUD ENGINE v2.0
   Owner: wn6b | Pass: f!2HgJv#)"E"y^i
*/

const firebaseConfig = { databaseURL: "https://wano-studio-default-rtdb.firebaseio.com" };
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const OWNER_KEY = 'f!2HgJv#)"E"y^i';

// تسجيل الدخول
function login() {
    const access = prompt("SECURITY: ENTER ENCRYPTION KEY");
    if (access === OWNER_KEY) {
        alert("ACCESS GRANTED. WELCOME MARWAN.");
    } else {
        alert("ACCESS DENIED.");
    }
}

// إنشاء هوست جديد
function createNewHost() {
    const name = prompt("أدخل اسم الهوست (HOST NAME):");
    if (name && name.length >= 3) {
        const id = "WANO-" + Math.random().toString(36).substr(2, 4).toUpperCase();
        database.ref('hosts/' + id).set({
            name: name,
            status: "ONLINE",
            cpu: "0.2%",
            ram: "12MB / 512MB",
            owner: "wn6b",
            created_at: Date.now()
        }).then(() => {
            alert(`تم إنشاء الهوست ${name} بنجاح.`);
        });
    }
}

// عرض وتحديث الهوستات
function loadHosts() {
    const grid = document.getElementById('hostsGrid');
    database.ref('hosts').on('value', (snapshot) => {
        grid.innerHTML = '';
        
        // كارت إضافة هوست (ثابت)
        const addCard = document.createElement('div');
        addCard.className = 'service-card';
        addCard.style.borderStyle = 'dashed';
        addCard.style.justifyContent = 'center';
        addCard.style.alignItems = 'center';
        addCard.style.cursor = 'pointer';
        addCard.onclick = createNewHost;
        addCard.innerHTML = `<h3 style="color: var(--accent-color)">+ إضافة هوست جديد</h3>`;
        grid.appendChild(addCard);

        snapshot.forEach((child) => {
            const host = child.val();
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div>
                    <div class="status-tag">${host.status}</div>
                    <h3>${host.name}</h3>
                    <p style="font-size: 0.7rem; color: var(--text-dim)">ID: ${child.key}</p>
                </div>
                <div class="host-stats">
                    CPU: ${host.cpu} <br> RAM: ${host.ram}
                </div>
                <button class="btn-primary" onclick="alert('فتح إعدادات الهوست: ${child.key}')">الإعدادات</button>
            `;
            grid.appendChild(card);
        });
    });
}

// التشغيل الأولي
document.addEventListener('DOMContentLoaded', loadHosts);
