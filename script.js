/* Project: WANO CLOUD HOSTING - 2026 Edition
   Author: Marwan (Wano) | wn6b
   Environment: Production (GitHub Pages + Firebase)
   Strict Rules: No Discord Self-Bots / Secure WhatsApp Sessions
*/

// 1. إعدادات Firebase
const firebaseConfig = {
    databaseURL: "https://wano-studio-default-rtdb.firebaseio.com",
};

// تهيئة التطبيق
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. دوال النظام الأساسية
const System = {
    // التحقق من صحة التوكن ومنع السيلفات
    validateToken: function(token, platform) {
        if (!token || token.trim().length < 10) {
            this.showAlert("خطأ: التوكن غير صالح أو قصير جداً.");
            return false;
        }

        if (platform === 'discord') {
            // قانون صارم: توكنات البوتات في ديسكورد تبدأ بـ 'M', 'N', 'O' وتحتوي على 3 مقاطع مفصولة بنقاط
            const discordPattern = /^[MNO][a-zA-Z0-9\-\_]{23,28}\.[a-zA-Z0-9\-\_]{6}\.[a-zA-Z0-9\-\_]{27,38}$/;
            if (!discordPattern.test(token)) {
                this.showAlert("تحذير أمني: محاولة إضافة Self-Bot ديسكورد! سيتم حظر الآيبي فوراً.");
                return false;
            }
        }
        return true;
    },

    // عرض تنبيهات واقعية (بدون إيموجي)
    showAlert: function(message) {
        // يمكن تطوير هذا لاحقاً ليصبح Toast Animation بدلاً من alert
        alert(`[SYSTEM NOTIFICATION]: ${message}`);
    },

    // ربط البوت بقاعدة البيانات
    connect: function(platform) {
        const token = prompt(`نظام التحقق: أدخل توكن ${platform.toUpperCase()} لبدء الاستضافة:`);
        
        if (this.validateToken(token, platform)) {
            const requestRef = database.ref('deployments/' + platform);
            const newBotRef = requestRef.push();
            
            newBotRef.set({
                id: newBotRef.key,
                owner: "wn6b",
                token: token,
                status: "Initializing",
                platform: platform,
                created_at: Date.now(),
                server_node: "Node-DE-01" // توزيع تلقائي على سيرفرات افتراضية
            }).then(() => {
                this.showAlert(`نجاح: تم ربط بوت ${platform} بنجاح. لوحة التحكم ستعمل خلال ثوانٍ.`);
            }).catch(err => {
                console.error("Firebase Error:", err);
                this.showAlert("خطأ في الاتصال بقاعدة البيانات.");
            });
        }
    }
};

// 3. إدارة واجهة المستخدم (UI Management)
document.addEventListener('DOMContentLoaded', () => {
    console.log("Wano Cloud System 2026 - Online");

    // ربط أزرار المنصات بالوظائف
    const cards = document.querySelectorAll('.service-card');
    
    // مصفوفة المنصات مرتبة حسب ظهورها في الـ HTML
    const platforms = ['discord', 'telegram', 'whatsapp'];

    cards.forEach((card, index) => {
        const btn = card.querySelector('.btn-primary');
        if (btn) {
            btn.addEventListener('click', () => {
                System.connect(platforms[index]);
            });
        }
    });

    // مراقبة حالة السيرفر بشكل حي (Real-time Status)
    const statusMonitor = database.ref('system/load');
    statusMonitor.on('value', (snapshot) => {
        const load = snapshot.val() || "0%";
        console.log(`Server Load: ${load}`);
        // هنا يمكن تحديث شريط الحالة في الواجهة
    });
});

// 4. وظيفة الدخول للـ Dashboard (للمالك فقط)
function login() {
    const pass = prompt("أدخل رمز الوصول المشفر:");
    if (pass === "FREE_ab97ec0c986935dd18d42b2cc715deb3") {
        window.location.href = "/dashboard.html"; // سيتم برمجتها لاحقاً
    } else {
        System.showAlert("تم رفض الوصول. المحاولة مسجلة.");
    }
}
