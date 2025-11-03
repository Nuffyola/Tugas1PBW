// Stock page functionality
let currentEditIndex = -1;
let filteredMaterials = [...teachingMaterialsData];
let currentOrderMaterial = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    setupEventListeners();
    loadLocationFilter();
    displayMaterials();
});

function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
    }
}

function loadUserData() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = currentUser.role;
    }
}

function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Mobile menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
    
    // Navigation links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showComingSoon(this.querySelector('span:not(.nav-icon)').textContent);
        });
    });
    
    // Add material button
    document.getElementById('btnAddMaterial').addEventListener('click', () => openDialog());
    
    // Dialog controls
    document.getElementById('dialogClose').addEventListener('click', closeDialog);
    document.getElementById('btnCancel').addEventListener('click', closeDialog);
    document.getElementById('dialogOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeDialog();
    });
    
    // Delete dialog controls
    document.getElementById('deleteDialogClose').addEventListener('click', closeDeleteDialog);
    document.getElementById('btnCancelDelete').addEventListener('click', closeDeleteDialog);
    document.getElementById('deleteDialogOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeDeleteDialog();
    });
    
    // Order dialog controls
    document.getElementById('orderDialogClose').addEventListener('click', closeOrderDialog);
    document.getElementById('btnCancelOrder').addEventListener('click', closeOrderDialog);
    document.getElementById('orderDialogOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeOrderDialog();
    });
    
    // Form submission
    document.getElementById('materialForm').addEventListener('submit', handleSubmit);
    document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);
    
    // Search and filter
    document.getElementById('searchInput').addEventListener('input', filterMaterials);
    document.getElementById('filterLocation').addEventListener('change', filterMaterials);
}

function logout() {
    // Create a custom confirmation dialog
    const confirmDialog = document.createElement('div');
    confirmDialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    `;
    
    confirmDialog.innerHTML = `
        <div style="
            background: white;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            text-align: center;
            min-width: 320px;
            border-top: 4px solid #FFC107;
            animation: slideDown 0.3s ease;
        ">
            <div style="font-size: 48px; margin-bottom: 16px;">👋</div>
            <h3 style="color: #1a1a1a; margin-bottom: 8px; font-size: 20px; font-weight: 600;">Konfirmasi Keluar</h3>
            <p style="color: #757575; margin-bottom: 24px; font-size: 14px;">Apakah Anda yakin ingin keluar?</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="cancelLogout" style="
                    padding: 10px 24px;
                    background: #f5f5f5;
                    color: #424242;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                ">
                    Batal
                </button>
                <button id="confirmLogout" style="
                    padding: 10px 24px;
                    background: #FFC107;
                    color: #1a1a1a;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                ">
                    Ya, Keluar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmDialog);
    
    document.getElementById('cancelLogout').onclick = function() {
        confirmDialog.remove();
    };
    
    document.getElementById('confirmLogout').onclick = function() {
        sessionStorage.removeItem('currentUser');
        
        // Show logout message
        confirmDialog.innerHTML = `
            <div style="
                background: white;
                padding: 32px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                text-align: center;
                min-width: 320px;
                border-top: 4px solid #4caf50;
            ">
                <div style="font-size: 48px; margin-bottom: 16px;">✓</div>
                <h3 style="color: #1a1a1a; margin-bottom: 8px; font-size: 20px; font-weight: 600;">Berhasil Keluar</h3>
                <p style="color: #757575; font-size: 14px;">Mengalihkan ke halaman login...</p>
            </div>
        `;
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    };
    
    confirmDialog.onclick = function(e) {
        if (e.target === confirmDialog) {
            confirmDialog.remove();
        }
    };
}

function loadLocationFilter() {
    const locations = [...new Set(teachingMaterialsData.map(m => m.locationCode))];
    const filterSelect = document.getElementById('filterLocation');
    
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        filterSelect.appendChild(option);
    });
}

function displayMaterials() {
    const grid = document.getElementById('materialsGrid');
    const noMaterials = document.getElementById('noMaterials');
    
    grid.innerHTML = '';
    
    if (filteredMaterials.length === 0) {
        grid.style.display = 'none';
        noMaterials.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noMaterials.style.display = 'none';
    
    filteredMaterials.forEach((material, index) => {
        const card = createMaterialCard(material, index);
        grid.appendChild(card);
    });
}

function createMaterialCard(material, index) {
    const card = document.createElement('div');
    card.className = 'material-card';
    
    // Determine stock level
    let stockClass = 'high';
    if (material.stock < 100) stockClass = 'low';
    else if (material.stock < 300) stockClass = 'medium';
    
    // Check if image exists and create cover element
    const coverHTML = material.cover && material.cover !== 'img/default.jpg' 
        ? `<div class="material-cover"><img src="${material.cover}" alt="${material.itemName}" onerror="this.parentElement.classList.add('no-image'); this.style.display='none'; this.parentElement.innerHTML='📚';"></div>`
        : `<div class="material-cover no-image">📚</div>`;
    
    card.innerHTML = `
        ${coverHTML}
        <div class="material-info">
            <div class="material-code">${material.itemCode} • ${material.locationCode}</div>
            <div class="material-name">${material.itemName}</div>
            <div class="material-details">
                <div class="detail-row">
                    <span class="detail-label">Tipe</span>
                    <span class="detail-value">${material.itemType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Edisi</span>
                    <span class="detail-value">${material.edition}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Stok</span>
                    <span class="stock-badge ${stockClass}">${material.stock}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Lokasi</span>
                    <span class="detail-value">${material.locationCode}</span>
                </div>
            </div>
            <div class="material-actions">
                <button class="btn-action btn-edit" onclick="editMaterial(${index})">✏️ Edit</button>
                <button class="btn-action btn-delete" onclick="deleteMaterial(${index})">🗑️ Hapus</button>
                <button class="btn-action btn-order" onclick="openOrderDialog(${index})">📦 Buat Pesanan</button>
            </div>
        </div>
    `;
    
    return card;
}

function filterMaterials() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const locationFilter = document.getElementById('filterLocation').value;
    
    filteredMaterials = teachingMaterialsData.filter(material => {
        const matchesSearch = 
            material.itemName.toLowerCase().includes(searchTerm) ||
            material.itemCode.toLowerCase().includes(searchTerm) ||
            material.locationCode.toLowerCase().includes(searchTerm);
        
        const matchesLocation = !locationFilter || material.locationCode === locationFilter;
        
        return matchesSearch && matchesLocation;
    });
    
    displayMaterials();
}

function openDialog(material = null, index = -1) {
    const dialog = document.getElementById('dialogOverlay');
    const form = document.getElementById('materialForm');
    const title = document.getElementById('dialogTitle');
    const submitText = document.getElementById('submitText');
    
    form.reset();
    currentEditIndex = index;
    
    if (material) {
        // Edit mode
        title.textContent = 'Edit Materi';
        submitText.textContent = 'Perbarui Materi';
        
        document.getElementById('itemCode').value = material.itemCode;
        document.getElementById('locationCode').value = material.locationCode;
        document.getElementById('itemName').value = material.itemName;
        document.getElementById('itemType').value = material.itemType;
        document.getElementById('edition').value = material.edition;
        document.getElementById('stock').value = material.stock;
        document.getElementById('cover').value = material.cover || '';
    } else {
        // Add mode
        title.textContent = 'Tambah Materi Baru';
        submitText.textContent = 'Tambah Materi';
    }
    
    dialog.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDialog() {
    const dialog = document.getElementById('dialogOverlay');
    dialog.classList.remove('show');
    document.body.style.overflow = 'auto';
    currentEditIndex = -1;
}

function handleSubmit(e) {
    e.preventDefault();
    
    const materialData = {
        locationCode: document.getElementById('locationCode').value,
        itemCode: document.getElementById('itemCode').value,
        itemName: document.getElementById('itemName').value,
        itemType: document.getElementById('itemType').value,
        edition: document.getElementById('edition').value,
        stock: parseInt(document.getElementById('stock').value),
        cover: document.getElementById('cover').value || 'img/default.jpg'
    };
    
    if (currentEditIndex >= 0) {
        // Update existing material
        teachingMaterialsData[currentEditIndex] = materialData;
        showNotification('Materi berhasil diperbarui!', 'success');
    } else {
        // Add new material
        teachingMaterialsData.push(materialData);
        showNotification('Materi berhasil ditambahkan!', 'success');
        loadLocationFilter(); // Reload locations if new one was added
    }
    
    closeDialog();
    filterMaterials();
}

function editMaterial(index) {
    const actualIndex = teachingMaterialsData.findIndex(m => 
        m.itemCode === filteredMaterials[index].itemCode &&
        m.locationCode === filteredMaterials[index].locationCode
    );
    openDialog(teachingMaterialsData[actualIndex], actualIndex);
}

let deleteIndex = -1;

function deleteMaterial(index) {
    const actualIndex = teachingMaterialsData.findIndex(m => 
        m.itemCode === filteredMaterials[index].itemCode &&
        m.locationCode === filteredMaterials[index].locationCode
    );
    
    const material = teachingMaterialsData[actualIndex];
    deleteIndex = actualIndex;
    
    document.getElementById('deleteDetails').textContent = 
        `${material.itemCode} - ${material.itemName}`;
    
    document.getElementById('deleteDialogOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Setup confirm delete
    document.getElementById('btnConfirmDelete').onclick = function() {
        teachingMaterialsData.splice(deleteIndex, 1);
        showNotification('Materi berhasil dihapus!', 'success');
        closeDeleteDialog();
        filterMaterials();
    };
}

function closeDeleteDialog() {
    document.getElementById('deleteDialogOverlay').classList.remove('show');
    document.body.style.overflow = 'auto';
    deleteIndex = -1;
}

function openOrderDialog(index) {
    const material = filteredMaterials[index];
    currentOrderMaterial = material;
    
    const orderMaterialInfo = document.getElementById('orderMaterialInfo');
    orderMaterialInfo.innerHTML = `
        <h3>📚 ${material.itemName}</h3>
        <p><strong>Kode:</strong> ${material.itemCode}</p>
        <p><strong>Lokasi:</strong> ${material.locationCode}</p>
        <p><strong>Tipe:</strong> ${material.itemType} | <strong>Edisi:</strong> ${material.edition}</p>
        <p><strong>Stok Tersedia:</strong> <span style="color: #2196f3; font-weight: 700;">${material.stock}</span> unit</p>
    `;
    
    // Reset form
    document.getElementById('orderForm').reset();
    
    // Set max quantity to available stock
    document.getElementById('orderQuantity').max = material.stock;
    
    document.getElementById('orderDialogOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeOrderDialog() {
    document.getElementById('orderDialogOverlay').classList.remove('show');
    document.body.style.overflow = 'auto';
    currentOrderMaterial = null;
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    const orderData = {
        material: currentOrderMaterial,
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        customerPhone: document.getElementById('customerPhone').value,
        quantity: parseInt(document.getElementById('orderQuantity').value),
        deliveryAddress: document.getElementById('deliveryAddress').value,
        notes: document.getElementById('orderNotes').value,
        orderId: 'ORD-' + Date.now(),
        status: 'Pending'
    };
    
    // Validate quantity
    if (orderData.quantity > currentOrderMaterial.stock) {
        showToast('error', 'Jumlah Tidak Valid', `Hanya ${currentOrderMaterial.stock} unit tersedia di stok.`);
        return;
    }
    
    // Here you would typically send this to a backend
    console.log('Order placed:', orderData);
    
    // Show success toast
    showToast('success', 'Pesanan Berhasil Dibuat!', 
        `Pesanan #${orderData.orderId} untuk ${orderData.quantity} unit telah dikirim.`);
    
    // Close dialog
    closeOrderDialog();
    
    // Optional: Update stock (if you want to reserve the stock)
    // updateMaterialStock(currentOrderMaterial, orderData.quantity);
}

function showToast(type = 'success', title, message) {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function showNotification(message, type = 'info') {
    const bgColor = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#FFC107';
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        font-size: 14px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showComingSoon(featureName) {
    const message = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 1000;
            text-align: center;
            min-width: 300px;
            border-top: 4px solid #FFC107;
        ">
            <div style="font-size: 48px; margin-bottom: 16px;">🚧</div>
            <h3 style="color: #1a1a1a; margin-bottom: 8px; font-size: 20px;">${featureName}</h3>
            <p style="color: #757575; margin-bottom: 20px; font-size: 14px;">Fitur ini segera hadir!</p>
            <button onclick="this.parentElement.remove(); document.getElementById('overlay').remove()" 
                style="
                    padding: 10px 24px;
                    background: #FFC107;
                    color: #1a1a1a;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                ">
                OK
            </button>
        </div>
        <div id="overlay" onclick="this.previousElementSibling.remove(); this.remove()" 
            style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 999;
            ">
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', message);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
