// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    // Modal elements
    const signupModal = document.getElementById('signupModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const signupLink = document.getElementById('signupLink');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const closeSignup = document.getElementById('closeSignup');
    const closeForgot = document.getElementById('closeForgot');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('.btn-login');
        
        // Add loading state
        submitBtn.classList.add('loading');
        errorMessage.classList.remove('show');
        
        // Simulate API call delay
        setTimeout(() => {
            // Find user in userData
            const user = userData.find(u => u.email === email);
            
            if (!user) {
                showError('Email tidak ditemukan. Silakan periksa email Anda atau daftar.');
                submitBtn.classList.remove('loading');
                return;
            }
            
            if (user.password !== password) {
                showError('Kata sandi salah. Silakan coba lagi.');
                submitBtn.classList.remove('loading');
                
                // Shake animation for password field
                passwordInput.style.animation = 'none';
                setTimeout(() => {
                    passwordInput.style.animation = 'shake 0.5s ease';
                }, 10);
                
                return;
            }
            
            // Login successful
            // Store user data in sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Show success and redirect
            errorMessage.style.background = '#fffde7';
            errorMessage.style.color = '#f57f17';
            errorMessage.style.borderLeft = '3px solid #FFC107';
            errorMessage.textContent = '✓ Login berhasil! Mengalihkan...';
            errorMessage.classList.add('show');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }, 1000);
    });
    
    // Show error message
    function showError(message) {
        errorMessage.style.background = '#fff3e0';
        errorMessage.style.color = '#e65100';
        errorMessage.style.borderLeft = '3px solid #ff6f00';
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
    
    // Modal functions
    function openModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // Signup modal
    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(signupModal);
    });
    
    closeSignup.addEventListener('click', function() {
        closeModal(signupModal);
    });
    
    // Forgot password modal
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(forgotPasswordModal);
    });
    
    closeForgot.addEventListener('click', function() {
        closeModal(forgotPasswordModal);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === signupModal) {
            closeModal(signupModal);
        }
        if (e.target === forgotPasswordModal) {
            closeModal(forgotPasswordModal);
        }
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const role = document.getElementById('signupRole').value;
        const submitBtn = signupForm.querySelector('.btn-login');
        
        // Check if email already exists
        const existingUser = userData.find(u => u.email === email);
        if (existingUser) {
            alert('Email sudah terdaftar. Silakan gunakan email lain atau masuk.');
            return;
        }
        
        // Add loading state
        submitBtn.classList.add('loading');
        
        setTimeout(() => {
            // Create new user
            const newUser = {
                id: userData.length + 1,
                name: name,
                email: email,
                password: password,
                role: role,
                location: role === 'UPBJJ-UT' ? 'UPBJJ Jakarta' : 'Central'
            };
            
            // Add to userData
            userData.push(newUser);
            
            // Show success message
            alert('Akun berhasil dibuat! Anda sekarang bisa masuk.');
            
            // Reset form and close modal
            signupForm.reset();
            submitBtn.classList.remove('loading');
            closeModal(signupModal);
        }, 1000);
    });
    
    // Forgot password form submission
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail').value;
        const submitBtn = forgotPasswordForm.querySelector('.btn-login');
        const forgotMessage = document.getElementById('forgotMessage');
        
        // Check if email exists
        const user = userData.find(u => u.email === email);
        
        // Add loading state
        submitBtn.classList.add('loading');
        
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            
            if (user) {
                forgotMessage.textContent = `✓ Instruksi reset kata sandi telah dikirim ke ${email}. Kata sandi Anda adalah: ${user.password}`;
                forgotMessage.classList.add('show');
                
                // Hide message after 8 seconds
                setTimeout(() => {
                    forgotMessage.classList.remove('show');
                    forgotPasswordForm.reset();
                    closeModal(forgotPasswordModal);
                }, 8000);
            } else {
                alert('Email tidak ditemukan. Silakan periksa email Anda atau daftar.');
            }
        }, 1000);
    });
    
    // Add smooth input animations
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});
