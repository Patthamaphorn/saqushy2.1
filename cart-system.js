// Cart System using localStorage

function getCart() {
    return JSON.parse(localStorage.getItem('squishy_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('squishy_cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(product) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id && item.size === product.size);
    
    if (existingIndex > -1) {
        cart[existingIndex].qty += (product.qty || 1);
    } else {
        cart.push({
            id: product.id || Date.now().toString(),
            name: product.name,
            brand: product.brand,
            price: parseFloat(product.price),
            image: product.image,
            size: product.size || 'Jumbo',
            qty: product.qty || 1
        });
    }
    
    saveCart(cart);
    showToast(`เพิ่ม "${product.name}" ลงในตะกร้าเรียบร้อยแล้ว!`);
}

function updateCartBadge() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    
    document.querySelectorAll('.cart-badge').forEach(badge => {
        if (totalCount > 0) {
            badge.innerText = totalCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

function showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.className = 'fixed bottom-6 right-6 bg-brandBrown text-white px-5 py-3 rounded-2xl shadow-xl z-50 transition-all duration-300 transform translate-y-10 opacity-0 flex items-center space-x-2';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>${message}</span>`;
    
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
    }, 3000);
}

// Auto update badge on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});
