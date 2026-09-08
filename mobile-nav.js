// Mobile Navigation & Responsive Helper for Squishy Boutique Shop

function injectMobileNav() {
    // 1. Ensure viewport meta tag exists and is optimized for all mobile screens
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
        metaViewport = document.createElement('meta');
        metaViewport.name = 'viewport';
        document.head.appendChild(metaViewport);
    }
    metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';

    // 2. Add overflow-x protection to body
    document.body.classList.add('overflow-x-hidden');

    // 3. Inject Mobile Drawer HTML if not already created
    if (document.getElementById('mobile-drawer')) return;

    const drawerHTML = `
    <!-- Mobile Drawer Overlay -->
    <div id="mobile-drawer-overlay" onclick="closeMobileDrawer()" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300"></div>

    <!-- Mobile Drawer Menu -->
    <div id="mobile-drawer" class="fixed top-0 right-0 w-4/5 max-w-xs h-full bg-white z-50 transform translate-x-full transition-transform duration-300 ease-in-out shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
        <div>
            <!-- Header inside Drawer -->
            <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <a href="index.html" class="text-2xl font-bold text-[#5C433B]">สกุชชี่ Boutique</a>
                <button onclick="closeMobileDrawer()" class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- Mobile Search Bar -->
            <div class="relative mb-6">
                <input type="text" id="mobile-search-input" onkeydown="if(event.key==='Enter') handleMobileSearch()" placeholder="ค้นหาสกุชชี่..." class="w-full pl-4 pr-10 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5A58]">
                <button onclick="handleMobileSearch()" class="absolute right-3 top-2.5 text-gray-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
            </div>

            <!-- Mobile Nav Links -->
            <div class="space-y-3 font-medium">
                <a href="index.html" class="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-pink-50 hover:text-[#8B5A58] transition">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span>หน้าแรก</span>
                </a>
                <a href="products.html" class="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-pink-50 hover:text-[#8B5A58] transition">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                    <span>สินค้าทั้งหมด</span>
                </a>
                <a href="ibloom.html" class="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-pink-50 hover:text-[#8B5A58] transition">
                    <span class="w-2 h-2 rounded-full bg-pink-500"></span>
                    <span>iBloom</span>
                </a>
                <a href="punimaru.html" class="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-pink-50 hover:text-[#8B5A58] transition">
                    <span class="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span>Puni Maru</span>
                </a>
                <a href="creamiicandy.html" class="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-pink-50 hover:text-[#8B5A58] transition">
                    <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Creamiicandy</span>
                </a>
                <a href="cart.html" class="flex items-center justify-between px-4 py-3 rounded-2xl text-gray-700 hover:bg-pink-50 hover:text-[#8B5A58] transition">
                    <div class="flex items-center space-x-3">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span>ตะกร้าสินค้า</span>
                    </div>
                    <span class="cart-badge hidden bg-[#8B5A58] text-white text-xs font-bold px-2 py-0.5 rounded-full">0</span>
                </a>
                <a href="profile.html" class="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-pink-50 hover:text-[#8B5A58] transition">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span>โปรไฟล์ผู้ใช้งาน</span>
                </a>
            </div>
        </div>

        <!-- Footer inside Drawer -->
        <div class="border-t border-gray-100 pt-4 mt-6">
            <p class="text-xs text-gray-400 text-center">&copy; 2024 สกุชชี่ Boutique<br>ร้านสกุชชี่พรีเมียมอันดับ 1</p>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', drawerHTML);

    // 4. Attach Hamburger Button to Navbar if not existing
    const navContainers = document.querySelectorAll('nav .container');
    navContainers.forEach(nav => {
        if (nav.querySelector('.mobile-hamburger-btn')) return;

        const rightIconsGroup = nav.querySelector('.flex.space-x-4, .flex.space-x-4.items-center');
        if (rightIconsGroup) {
            const hamburgerBtn = document.createElement('button');
            hamburgerBtn.className = 'mobile-hamburger-btn md:hidden text-gray-700 hover:text-[#8B5A58] p-1.5 focus:outline-none';
            hamburgerBtn.setAttribute('aria-label', 'Open Menu');
            hamburgerBtn.onclick = openMobileDrawer;
            hamburgerBtn.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            `;
            rightIconsGroup.prepend(hamburgerBtn);
        }
    });

    // 5. Wrap tables in responsive overflow wrappers
    document.querySelectorAll('table').forEach(table => {
        if (!table.parentElement.classList.contains('overflow-x-auto')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'overflow-x-auto w-full -mx-2 sm:mx-0 px-2 sm:px-0';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

function openMobileDrawer() {
    injectMobileNav();
    const overlay = document.getElementById('mobile-drawer-overlay');
    const drawer = document.getElementById('mobile-drawer');
    if (overlay && drawer) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        drawer.classList.remove('translate-x-full');
    }
}

function closeMobileDrawer() {
    const overlay = document.getElementById('mobile-drawer-overlay');
    const drawer = document.getElementById('mobile-drawer');
    if (overlay && drawer) {
        overlay.classList.add('opacity-0');
        drawer.classList.add('translate-x-full');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

function handleMobileSearch() {
    const input = document.getElementById('mobile-search-input');
    if (input && input.value.trim()) {
        window.location.href = `products.html?search=${encodeURIComponent(input.value.trim())}`;
    }
}

// Auto init on DOM load
document.addEventListener('DOMContentLoaded', injectMobileNav);
