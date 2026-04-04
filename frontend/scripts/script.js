document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Handle active page styles based on current URL
    const currentPath = window.location.pathname;
    const navLinksList = document.querySelectorAll('.nav-links a');
    
    navLinksList.forEach(link => {
        // Remove 'active' just in case, though it's set in HTML
        if (link.getAttribute('href') !== '#' && currentPath.includes(link.getAttribute('href'))) {
            navLinksList.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });

    // Add subtle entrance animation for cards
    const cards = document.querySelectorAll('.feature-card');
    
    // Only initialize IntersectionObserver if cards exist on the page
    if (cards.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeInObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Apply a staggered delay
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Initial state for animation
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeInObserver.observe(card);
        });
    }

    // Auth state and Sign Out logic
    const btnLogin = document.querySelector('.btn-login');
    if (btnLogin) {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        // Only run logic if we are logged in, otherwise let it be a normal Login link
        if (isLoggedIn) {
            btnLogin.textContent = 'Sign Out';
            btnLogin.style.backgroundColor = '#ef4444'; // Make signout button red visually
            btnLogin.setAttribute('href', '#');
            
            btnLogin.addEventListener('click', (e) => {
                e.preventDefault();
                // Clear all authentication data
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                
                // Detect whether we're on root index or inside /pages folder to redirect right
                const currentPath = window.location.pathname;
                if (currentPath.includes('/pages/')) {
                    window.location.href = 'login.html';
                } else {
                    window.location.href = 'pages/login.html';
                }
            });
        }
    }
});
