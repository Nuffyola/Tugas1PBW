// Tracking page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    loadUserData();
    setupEventListeners();
    loadAllOrders();
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
    // Logout button
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
    
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('trackingInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Navigation links
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showComingSoon(this.querySelector('span:not(.nav-icon)').textContent);
        });
    });
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

function performSearch() {
    const searchTerm = document.getElementById('trackingInput').value.trim();
    const trackingResult = document.getElementById('trackingResult');
    const noResults = document.getElementById('noResults');
    
    if (!searchTerm) {
        alert('Silakan masukkan nomor pelacakan atau nama');
        return;
    }
    
    // Search in trackingData
    let foundOrder = null;
    
    // Search by order number
    if (trackingData[searchTerm]) {
        foundOrder = trackingData[searchTerm];
    } else {
        // Search by name
        for (let key in trackingData) {
            if (trackingData[key].name.toLowerCase().includes(searchTerm.toLowerCase())) {
                foundOrder = trackingData[key];
                break;
            }
        }
    }
    
    if (foundOrder) {
        displayTrackingResult(foundOrder);
        trackingResult.style.display = 'block';
        noResults.style.display = 'none';
        
        // Scroll to result
        trackingResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        trackingResult.style.display = 'none';
        noResults.style.display = 'block';
        noResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function displayTrackingResult(order) {
    document.getElementById('resultOrderNumber').textContent = `DO #${order.deliveryOrderNumber}`;
    document.getElementById('resultName').textContent = `Penerima: ${order.name}`;
    document.getElementById('resultCourier').textContent = order.courier;
    document.getElementById('resultDate').textContent = order.shippingDate;
    document.getElementById('resultPackage').textContent = order.package;
    document.getElementById('resultTotal').textContent = order.total;
    
    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = order.status === 'In Transit' ? 'Dalam Perjalanan' : order.status === 'Delivered' ? 'Terkirim' : order.status;
    statusBadge.className = 'status-badge';
    if (order.status === 'In Transit') {
        statusBadge.classList.add('in-transit');
    } else if (order.status === 'Delivered') {
        statusBadge.classList.add('delivered');
    }
    
    // Display timeline
    displayTimeline(order.journey, order.status);
}

function displayTimeline(journey, status) {
    const timeline = document.getElementById('trackingTimeline');
    timeline.innerHTML = '<h3 style="font-size: 18px; margin-bottom: 24px; color: #1a1a1a;">Riwayat Pelacakan</h3>';
    
    journey.forEach((item, index) => {
        const isCompleted = status === 'Delivered' || index < journey.length - 1;
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${isCompleted ? 'completed' : ''}`;
        timelineItem.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-time">${item.time}</div>
            <div class="timeline-description">${item.description}</div>
        `;
        timeline.appendChild(timelineItem);
    });
}

function loadAllOrders() {
    const ordersGrid = document.getElementById('ordersGrid');
    ordersGrid.innerHTML = '';
    
    for (let key in trackingData) {
        const order = trackingData[key];
        const orderCard = createOrderCard(order);
        ordersGrid.appendChild(orderCard);
    }
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.onclick = function() {
        document.getElementById('trackingInput').value = order.deliveryOrderNumber;
        performSearch();
    };
    
    const statusClass = order.status === 'In Transit' ? 'in-transit' : 'delivered';
    const statusText = order.status === 'In Transit' ? 'Dalam Perjalanan' : order.status === 'Delivered' ? 'Terkirim' : order.status;
    
    card.innerHTML = `
        <div class="order-header">
            <div class="order-number">DO #${order.deliveryOrderNumber}</div>
            <div class="order-status ${statusClass}">${statusText}</div>
        </div>
        <div class="order-details">
            <div class="order-detail-row">
                <span class="order-detail-label">Penerima</span>
                <span class="order-detail-value">${order.name}</span>
            </div>
            <div class="order-detail-row">
                <span class="order-detail-label">Kurir</span>
                <span class="order-detail-value">${order.courier}</span>
            </div>
            <div class="order-detail-row">
                <span class="order-detail-label">Tanggal</span>
                <span class="order-detail-value">${order.shippingDate}</span>
            </div>
            <div class="order-detail-row">
                <span class="order-detail-label">Total</span>
                <span class="order-detail-value">${order.total}</span>
            </div>
        </div>
    `;
    
    return card;
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
