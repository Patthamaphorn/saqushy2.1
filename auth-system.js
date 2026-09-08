// Auth System for Squishy Boutique Shop (LocalStorage-backed mock auth)

const DEFAULT_USER = {
    fullname: 'คุณลูกค้า สกุชชี่',
    email: 'customer@example.com',
    phone: '081-234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    tier: 'VIP Gold Member',
    points: 540
};

// Check if user is logged in
function getLoggedInUser() {
    const userStr = localStorage.getItem('squishy_logged_in_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Save logged in user session
function setLoggedInUser(user) {
    localStorage.setItem('squishy_logged_in_user', JSON.stringify(user));
    // also sync profile info
    const existingProfile = localStorage.getItem('squishy_user_profile');
    if (!existingProfile) {
        localStorage.setItem('squishy_user_profile', JSON.stringify(user));
    }
    updateAuthUI();
}

// Logout
function logoutUser() {
    localStorage.removeItem('squishy_logged_in_user');
    updateAuthUI();
    if (typeof showToast === 'function') {
        showToast('ออกจากระบบเรียบร้อยแล้ว');
    }
    // If on profile page, redirect or reload
    if (window.location.pathname.includes('profile.html')) {
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    }
}

// Dynamically Inject Auth Modal into Document
function injectAuthModal() {
    if (document.getElementById('auth-modal')) return;

    const modalHTML = `
    <div id="auth-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4 transition-opacity duration-300">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative transform transition-all duration-300 scale-95 border border-gray-100">
            <!-- Close Button -->
            <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <!-- Modal Header / Tabs -->
            <div class="flex border-b border-gray-100 mb-6">
                <button id="auth-tab-login" onclick="switchAuthTab('login')" class="flex-1 pb-3 font-bold text-center border-b-2 border-[#8B5A58] text-[#8B5A58] transition">
                    เข้าสู่ระบบ
                </button>
                <button id="auth-tab-register" onclick="switchAuthTab('register')" class="flex-1 pb-3 font-bold text-center border-b-2 border-transparent text-gray-400 hover:text-gray-600 transition">
                    สมัครสมาชิก
                </button>
            </div>

            <!-- Login Form -->
            <form id="auth-form-login" onsubmit="submitLogin(event)" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">อีเมล หรือ เบอร์โทรศัพท์</label>
                    <input type="email" id="login-email" required placeholder="customer@example.com" class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none text-sm">
                </div>
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="block text-xs font-semibold text-gray-600">รหัสผ่าน</label>
                        <a href="#" onclick="alert('ระบบได้ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลของคุณแล้ว'); return false;" class="text-xs text-[#8B5A58] hover:underline">ลืมรหัสผ่าน?</a>
                    </div>
                    <input type="password" id="login-password" required placeholder="••••••••" class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none text-sm">
                </div>
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="remember-me" checked class="rounded text-[#8B5A58] focus:ring-[#8B5A58]">
                    <label for="remember-me" class="text-xs text-gray-500 cursor-pointer">จดจำการเข้าสู่ระบบ</label>
                </div>
                <button type="submit" class="w-full bg-[#8B5A58] text-white py-3 rounded-full font-bold hover:bg-opacity-90 transition shadow-md">
                    เข้าสู่ระบบ
                </button>
            </form>

            <!-- Register Form -->
            <form id="auth-form-register" onsubmit="submitRegister(event)" class="space-y-4 hidden">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">ชื่อ-นามสกุล</label>
                    <input type="text" id="reg-fullname" required placeholder="สมชาย นุ่มนิ่ม" class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none text-sm">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">อีเมล</label>
                    <input type="email" id="reg-email" required placeholder="yourname@example.com" class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none text-sm">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">เบอร์โทรศัพท์</label>
                    <input type="tel" id="reg-phone" required placeholder="081-234-5678" class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none text-sm">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">สร้างรหัสผ่าน</label>
                    <input type="password" id="reg-password" required placeholder="อย่างน้อย 6 หลัก" class="w-full px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#8B5A58] outline-none text-sm">
                </div>
                <button type="submit" class="w-full bg-[#8B5A58] text-white py-3 rounded-full font-bold hover:bg-opacity-90 transition shadow-md">
                    ลงทะเบียนสมาชิกใหม่
                </button>
            </form>

            <!-- Social Login Divider -->
            <div class="my-6 flex items-center justify-between">
                <span class="border-b border-gray-200 w-1/5"></span>
                <span class="text-xs text-gray-400 font-medium">หรือเข้าสู่ระบบด้วย</span>
                <span class="border-b border-gray-200 w-1/5"></span>
            </div>

            <!-- Social Buttons -->
            <div class="grid grid-cols-2 gap-3">
                <button onclick="socialLogin('Google')" class="flex items-center justify-center space-x-2 py-2.5 border border-gray-200 rounded-2xl text-xs font-semibold hover:bg-gray-50 transition">
                    <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                    <span>Google</span>
                </button>
                <button onclick="socialLogin('LINE')" class="flex items-center justify-center space-x-2 py-2.5 bg-[#00B900] text-white rounded-2xl text-xs font-semibold hover:bg-opacity-90 transition">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.412-.105-.531-.284l-2.074-2.825v2.449c0 .345-.282.629-.63.629-.345 0-.627-.284-.627-.629V8.108c0-.27.174-.51.432-.596.064-.021.133-.031.199-.031.211 0 .412.105.531.284l2.074 2.825V8.108c0-.345.282-.63.63-.63.345 0 .627.285.627.63v4.771zm-5.641 0c0 .345-.282.629-.63.629-.345 0-.627-.284-.627-.629V8.108c0-.345.282-.63.63-.63.345 0 .627.285.627.63v4.771zm-2.437.629H5.046c-.345 0-.627-.284-.627-.629V8.108c0-.345.282-.63.63-.63.345 0 .627.285.627.63v4.141h1.755c.348 0 .628.285.628.63 0 .346-.28.629-.628.629zM12 2C6.477 2 2 5.795 2 10.478c0 4.197 3.565 7.733 8.384 8.356.327.07.771.216.884.496.101.25.066.642.032.896-.07.514-.325 2.01-.37 2.222-.07.332.14.652.476.541.455-.152 4.908-2.89 6.703-4.949C19.98 16.273 22 13.568 22 10.478 22 5.795 17.523 2 12 2z"/></svg>
                    <span>LINE Login</span>
                </button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openAuthModal(tab = 'login') {
    injectAuthModal();
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('hidden');
    switchAuthTab(tab);
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
}

function switchAuthTab(tab) {
    const loginTab = document.getElementById('auth-tab-login');
    const regTab = document.getElementById('auth-tab-register');
    const loginForm = document.getElementById('auth-form-login');
    const regForm = document.getElementById('auth-form-register');

    if (tab === 'login') {
        loginTab.className = 'flex-1 pb-3 font-bold text-center border-b-2 border-[#8B5A58] text-[#8B5A58] transition';
        regTab.className = 'flex-1 pb-3 font-bold text-center border-b-2 border-transparent text-gray-400 hover:text-gray-600 transition';
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
    } else {
        regTab.className = 'flex-1 pb-3 font-bold text-center border-b-2 border-[#8B5A58] text-[#8B5A58] transition';
        loginTab.className = 'flex-1 pb-3 font-bold text-center border-b-2 border-transparent text-gray-400 hover:text-gray-600 transition';
        regForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

function submitLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const user = {
        ...DEFAULT_USER,
        email: email,
        fullname: email.split('@')[0] || 'คุณลูกค้า'
    };
    setLoggedInUser(user);
    closeAuthModal();
    if (typeof showToast === 'function') {
        showToast(`ยินดีต้อนรับกลับมา, ${user.fullname}!`);
    } else {
        alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ ${user.fullname}`);
    }
}

function submitRegister(e) {
    e.preventDefault();
    const fullname = document.getElementById('reg-fullname').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;

    const newUser = {
        ...DEFAULT_USER,
        fullname: fullname,
        email: email,
        phone: phone,
        tier: 'สมาชิกใหม่ (New Member)',
        points: 100 // Welcome points bonus
    };

    setLoggedInUser(newUser);
    closeAuthModal();
    if (typeof showToast === 'function') {
        showToast(`สมัครสมาชิกสำเร็จ! ได้รับโบนัสต้อนรับ 100 แต้ม`);
    } else {
        alert(`สมัครสมาชิกสำเร็จ! ยินดีต้อนรับคุณ ${fullname} รับโบนัสต้อนรับ 100 แต้ม`);
    }
}

function socialLogin(provider) {
    const socialUser = {
        ...DEFAULT_USER,
        fullname: `ผู้ใช้ ${provider}`,
        email: `user_${provider.toLowerCase()}@example.com`
    };
    setLoggedInUser(socialUser);
    closeAuthModal();
    if (typeof showToast === 'function') {
        showToast(`เข้าสู่ระบบผ่าน ${provider} สำเร็จ!`);
    } else {
        alert(`เข้าสู่ระบบผ่าน ${provider} สำเร็จ!`);
    }
}

// Update navbar user profile button/link depending on auth status
function updateAuthUI() {
    const user = getLoggedInUser();
    const profileBtns = document.querySelectorAll('.auth-profile-link, [href="profile.html"]');

    profileBtns.forEach(btn => {
        if (!user) {
            // Logged out: clicking profile icon opens Auth Modal instead of navigating
            btn.onclick = (e) => {
                e.preventDefault();
                openAuthModal('login');
            };
            btn.setAttribute('title', 'เข้าสู่ระบบ / สมัครสมาชิก');
        } else {
            // Logged in: normal link to profile.html
            btn.onclick = null;
            btn.setAttribute('title', `โปรไฟล์: ${user.fullname}`);
        }
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    injectAuthModal();
    updateAuthUI();
});
