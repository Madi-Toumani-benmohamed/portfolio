/**
 * Portfolio - JavaScript principal
 * Fonctionnalités : Theme toggle, animations, filtres, navigation mobile
 */

// Ajouter la classe js à l'html pour activer les animations
document.documentElement.classList.add('js');

// Initialiser AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: 'ease-in-out-sine',
  delay: 100,
  once: true,
  mirror: false,
  anchorPlacement: 'top-bottom'
});

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // Main Navigation - Scroll Spy
    // ========================================
    
    const mainNavLinks = document.querySelectorAll('.main-nav__link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    // Fonction pour mettre à jour le lien actif
    function updateActiveNavLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        mainNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Écouteur de scroll
    window.addEventListener('scroll', function() {
        updateActiveNavLink();
        
        // Ajouter/supprimer la classe 'scrolled' pour l'effet semi-transparent
        const mainNav = document.querySelector('.main-nav');
        const sideNav = document.querySelector('.side-nav');
        
        if (window.pageYOffset > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
        
        // Afficher/cacher le menu latéral au scroll
        if (window.pageYOffset > 300) {
            sideNav.classList.add('visible');
        } else {
            sideNav.classList.remove('visible');
        }
    });
    
    // Initialiser au chargement
    updateActiveNavLink();
    
    // ========================================
    // Mobile Menu for Main Navigation
    // ========================================
    
    const mainNav = document.querySelector('.main-nav');
    const mainNavContainer = document.querySelector('.main-nav__container');
    const mobileMenuBtn = document.querySelector('.main-nav .mobile-menu-btn');
    const mainNavItems = document.querySelector('.main-nav__items');
    
    if (mobileMenuBtn && mainNavItems) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNavItems.classList.toggle('active');
            mainNav.classList.toggle('menu-open');
            const isExpanded = mainNavItems.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        
        // Fermer le menu quand on clique sur un lien (mobile)
        document.querySelectorAll('.main-nav__link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mainNavItems.classList.remove('active');
                    mainNav.classList.remove('menu-open');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
    
    // ========================================
    // Theme Toggle Functionality
    // ========================================
    
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Récupérer la préférence de thème sauvegardée ou utiliser la préférence système
    let currentTheme = localStorage.getItem('theme') || 
                      (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Appliquer le thème au chargement
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Mettre à jour l'icône du toggle
    updateThemeIcon(currentTheme);
    
    // Fonction pour basculer le thème
    function toggleTheme() {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        currentTheme = newTheme;
        return newTheme;
    }
    
    // Mettre à jour l'icône en fonction du thème actuel
    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        
        const sunIcon = themeToggle.querySelector('.sun');
        const moonIcon = themeToggle.querySelector('.moon');
        
        if (theme === 'dark') {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        } else {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        }
    }
    
    // Écouteurs d'événements pour le toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            toggleTheme();
        });
        
        // Accessibilité clavier
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }
    
    // Écouter les changements de thème système
    prefersDarkScheme.addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
            currentTheme = newTheme;
        }
    });

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile si ouvert
                const navItems = document.querySelector('.nav__items, .main-nav__items');
                if (navItems && navItems.classList.contains('active')) {
                    navItems.classList.remove('active');
                    document.querySelector('.nav, .main-nav').classList.remove('active', 'menu-open');
                    document.querySelector('.mobile-menu-btn').setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // ========================================
    // Work Filters Functionality
    // ========================================
    
    const filterButtons = document.querySelectorAll('.work__filter');
    const workBoxes = document.querySelectorAll('.work__box');
    
    if (filterButtons.length > 0 && workBoxes.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Retirer la classe active de tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('work__filter--active'));
                
                // Ajouter la classe active au bouton cliqué
                this.classList.add('work__filter--active');
                
                // Récupérer la valeur du filtre
                const filter = this.getAttribute('data-filter');
                
                // Afficher/masquer les boîtes de travail
                workBoxes.forEach(box => {
                    if (filter === 'all' || box.getAttribute('data-category') === filter) {
                        box.style.display = 'flex';
                        // Réappliquer l'animation
                        setTimeout(() => {
                            box.classList.add('visible');
                        }, 10);
                    } else {
                        box.style.display = 'none';
                        box.classList.remove('visible');
                    }
                });
            });
        });
        
        // Initialiser le premier filtre comme actif
        filterButtons[0].classList.add('work__filter--active');
    }

    // ========================================
    // Mobile Menu Functionality (for old nav if exists)
    // ========================================
    
    const nav = document.querySelector('.nav');
    const navItems = document.querySelector('.nav__items');
    const mobileMenuBtnOld = document.querySelector('.nav .mobile-menu-btn');
    
    if (nav && navItems && mobileMenuBtnOld) {
        mobileMenuBtnOld.addEventListener('click', function() {
            navItems.classList.toggle('active');
            nav.classList.toggle('active');
            const isExpanded = navItems.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        
        // Fermer le menu quand on clique sur un lien (mobile)
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navItems.classList.remove('active');
                    nav.classList.remove('active');
                    mobileMenuBtnOld.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ========================================
    // Progress Bar on Scroll
    // ========================================
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollProgress + '%';
        });
    }

    // ========================================
    // Scroll Indicators
    // ========================================
    
    const mainSections = document.querySelectorAll('section[id]');
    const scrollIndicatorsContainer = document.querySelector('.scroll-indicators');
    
    if (mainSections.length > 0 && scrollIndicatorsContainer) {
        // Créer les indicateurs
        mainSections.forEach((section, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            indicator.dataset.target = section.id;
            scrollIndicatorsContainer.appendChild(indicator);
            
            indicator.addEventListener('click', () => {
                const headerOffset = 80;
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
        
        // Mettre à jour l'indicateur actif lors du scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.scroll-indicator').forEach(ind => {
                        ind.classList.remove('active');
                        if (ind.dataset.target === entry.target.id) {
                            ind.classList.add('active');
                        }
                    });
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '-80px 0px -50% 0px'
        });
        
        mainSections.forEach(section => {
            observer.observe(section);
        });
        
        // Activer le premier indicateur au chargement
        const firstIndicator = scrollIndicatorsContainer.querySelector('.scroll-indicator');
        if (firstIndicator) {
            firstIndicator.classList.add('active');
        }
    }

    // ========================================
    // Intersection Observer for Animations
    // ========================================
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animation décalée pour les work boxes
                if (entry.target.classList.contains('work__box')) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observer tous les éléments animés
    document.querySelectorAll('.work__box, section').forEach((el, index) => {
        if (el.classList.contains('work__box')) {
            el.dataset.delay = index * 100;
        }
        animateOnScroll.observe(el);
    });

    // ========================================
    // Parallax Effect for Header
    // ========================================
    
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            header.style.transform = `translateY(${rate}px)`;
            header.style.backgroundPositionY = `${rate}px`;
        });
    }

    // ========================================
    // Animate Header Text on Load
    // ========================================
    
    const headerTextElements = document.querySelectorAll('.header__text > *');
    headerTextElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // ========================================
    // Keyboard Navigation Accessibility
    // ========================================
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('user-is-tabbing');
    });

    // ========================================
    // Scroll to Top on Page Load
    // ========================================
    
    window.onload = function() {
        // Rendre visibles les sections déjà en vue
        const visibleSections = document.querySelectorAll('section');
        visibleSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('visible');
            }
        });
    };

    // ========================================
    // Initialize First Section as Visible
    // ========================================
    
    const firstSection = document.querySelector('section');
    if (firstSection) {
        firstSection.classList.add('visible');
    }
});

// ========================================
// Service Worker Registration (Optional)
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js').then(
        //     function(registration) {
        //         console.log('ServiceWorker registration successful');
        //     },
        //     function(err) {
        //         console.log('ServiceWorker registration failed: ', err);
        //     }
        // );
    });
}

// ========================================
// Performance: Lazy Load Images
// ========================================

if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}
