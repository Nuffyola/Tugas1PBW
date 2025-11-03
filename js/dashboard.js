// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuth();
    
    // Load user data
    loadUserData();
    
    // Set greeting based on time
    setGreeting();
    
    // Load statistics
    loadStats();
    
    // Setup event listeners
    setupEventListeners();
});

// Check authentication
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
    }
}

// Load user data
function loadUserData() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userRole').textContent = currentUser.role;
        document.getElementById('greetingName').textContent = currentUser.name;
    }
}

// Set greeting based on time of day
function setGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greetingTitle = document.getElementById('greetingTitle');
    const greetingEmoji = document.getElementById('greetingEmoji');
    const greetingDate = document.getElementById('greetingDate');
    
    let greeting = '';
    let emoji = '';
    
    if (hour >= 5 && hour < 12) {
        greeting = 'Selamat Pagi';
        emoji = '☀️';
    } else if (hour >= 12 && hour < 17) {
        greeting = 'Selamat Siang';
        emoji = '🌤️';
    } else if (hour >= 17 && hour < 21) {
        greeting = 'Selamat Sore';
        emoji = '🌆';
    } else {
        greeting = 'Selamat Malam';
        emoji = '🌙';
    }
    
    greetingTitle.textContent = greeting;
    greetingEmoji.textContent = emoji;
    
    // Format date
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    greetingDate.textContent = now.toLocaleDateString('id-ID', options);
}

// Load statistics
function loadStats() {
    // Total materials from teachingMaterialsData
    const totalMaterials = teachingMaterialsData.length;
    document.getElementById('totalMaterials').textContent = totalMaterials;
    
    // Calculate total stock
    const totalStock = teachingMaterialsData.reduce((sum, item) => sum + item.stock, 0);
    document.getElementById('totalStock').textContent = totalStock.toLocaleString();
    
    // Count deliveries from trackingData
    let deliveredCount = 0;
    let inTransitCount = 0;
    
    for (let key in trackingData) {
        if (trackingData[key].status === 'Delivered') {
            deliveredCount++;
        } else if (trackingData[key].status === 'In Transit') {
            inTransitCount++;
        }
    }
    
    document.getElementById('deliveredCount').textContent = deliveredCount;
    document.getElementById('inTransitCount').textContent = inTransitCount;
    
    // Animate numbers
    animateNumbers();
}

// Animate number counters
function animateNumbers() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/,/g, ''));
        const duration = 1000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', logout);
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
    
    // Navigation items
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const page = this.getAttribute('data-page');
            
            // If it's a placeholder page (not a real link)
            if (page) {
                e.preventDefault();
                showComingSoon(this.querySelector('span:not(.nav-icon)').textContent);
            }
            
            // Close mobile menu
            if (window.innerWidth <= 1024) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
    
    // Dashboard cards click handlers
    const cards = document.querySelectorAll('.card[data-page]');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            const title = this.querySelector('h3').textContent;
            showComingSoon(title);
        });
    });
}

// Logout function
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

// Show coming soon message
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

// Update time periodically
setInterval(setGreeting, 60000); // Update every minute
