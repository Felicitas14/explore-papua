import i18n from './i18n.js';
import papuaAudio from './audio.js';
import papuaMap from './map.js';
import papuaVirtualTour from './virtual-tour.js';
import papuaQuiz from './game.js';

class PapuaApp {
    constructor() {
        this.currentLang = localStorage.getItem('papua_lang') || 'id';
        this.darkMode = localStorage.getItem('papua_dark_mode') !== 'false'; // default true
        this.activePage = 'home';
        
        // Data arrays
        this.destinations = [];
        this.cultureList = [];
        this.foodList = [];

        // Hero slideshow
        this.heroSlides = [];
        this.currentSlideIdx = 0;
        this.slideTimer = null;
    }

    async init() {
        this.setupPreloader();
        this.setupTheme();
        this.setupAudioControls();
        this.setupLanguageSwitcher();
        this.setupSPARouting();
        this.setupLightbox();

        // Fetch data from Flask API
        await this.fetchAppData();

        // Finish Loading
        this.hidePreloader();

        // Initialize Home elements
        this.startHeroSlideshow();
        this.renderFeaturedDestinations();
    }

    // --- 1. PRELOADER SCREEN ---
    setupPreloader() {
        let percent = 0;
        const progressNum = document.getElementById('loader-percentage');
        const fill = document.getElementById('loader-progress-fill');

        const interval = setInterval(() => {
            percent += Math.floor(Math.random() * 15) + 5;
            if (percent >= 100) {
                percent = 100;
                clearInterval(interval);
            }
            if (progressNum) progressNum.innerText = `${percent}%`;
            if (fill) fill.style.width = `${percent}%`;
        }, 100);
    }

    hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        setTimeout(() => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 1.0,
                ease: "power2.out",
                onComplete: () => {
                    preloader.style.display = 'none';
                    // Trigger Hero entry animations
                    this.animateHeroEntry();
                }
            });
        }, 800);
    }

    animateHeroEntry() {
        // Text slide ups and button fades
        gsap.from('.hero-content h1', {
            y: 80,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });

        gsap.from('.hero-content p', {
            y: 40,
            opacity: 0,
            duration: 1.2,
            delay: 0.3,
            ease: "power3.out"
        });

        gsap.from('.hero-actions', {
            y: 30,
            opacity: 0,
            duration: 1.0,
            delay: 0.6,
            ease: "power3.out"
        });
        
        gsap.from('.stats-container', {
            y: 50,
            opacity: 0,
            duration: 1.2,
            delay: 0.8,
            ease: "power3.out"
        });
    }

    // --- 2. THEME CONTROLLER ---
    setupTheme() {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (!toggleBtn) return;

        // Apply saved mode
        if (this.darkMode) {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }
        this.updateThemeButtonIcon();

        toggleBtn.addEventListener('click', () => {
            this.darkMode = !this.darkMode;
            if (this.darkMode) {
                document.body.classList.remove('light-mode');
            } else {
                document.body.classList.add('light-mode');
            }
            localStorage.setItem('papua_dark_mode', this.darkMode);
            this.updateThemeButtonIcon();
        });
    }

    updateThemeButtonIcon() {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (!toggleBtn) return;
        
        const label = toggleBtn.querySelector('.theme-label');
        if (this.darkMode) {
            toggleBtn.innerHTML = `☀️ <span class="theme-label">${this.currentLang === 'id' ? 'Mode Terang' : 'Light Mode'}</span>`;
        } else {
            toggleBtn.innerHTML = `🌙 <span class="theme-label">${this.currentLang === 'id' ? 'Mode Gelap' : 'Dark Mode'}</span>`;
        }
    }

    // --- 3. MUSIC & AMBIENT SYNTH ---
    setupAudioControls() {
        const musicBtn = document.getElementById('music-toggle-btn');
        const ambientBtn = document.getElementById('ambient-toggle-btn');
        const volSlider = document.getElementById('volume-slider');

        if (musicBtn) {
            musicBtn.addEventListener('click', () => {
                const playing = papuaAudio.toggleMusic();
                musicBtn.classList.toggle('active', playing);
                musicBtn.querySelector('.audio-status').innerText = playing ? 'ON' : 'OFF';
            });
        }

        if (ambientBtn) {
            ambientBtn.addEventListener('click', () => {
                const playing = papuaAudio.toggleAmbient();
                ambientBtn.classList.toggle('active', playing);
                ambientBtn.querySelector('.audio-status').innerText = playing ? 'ON' : 'OFF';
            });
        }

        if (volSlider) {
            volSlider.addEventListener('input', (e) => {
                papuaAudio.setVolume(parseFloat(e.target.value));
            });
        }
    }

    // --- 4. LOCALIZATION (i18n) ---
    setupLanguageSwitcher() {
        const idBtn = document.getElementById('lang-id');
        const enBtn = document.getElementById('lang-en');

        const updateLangButtons = () => {
            if (this.currentLang === 'id') {
                idBtn.classList.add('active');
                enBtn.classList.remove('active');
            } else {
                enBtn.classList.add('active');
                idBtn.classList.remove('active');
            }
        };

        const changeLanguage = (lang) => {
            this.currentLang = lang;
            localStorage.setItem('papua_lang', lang);
            updateLangButtons();
            this.translatePage();
            
            // Update child systems
            papuaMap.setLanguage(lang);
            papuaQuiz.setLanguage(lang);
            this.updateThemeButtonIcon();
            
            // Re-render variable listings
            this.renderDestinations();
            this.renderCulture();
            this.renderFood();
        };

        if (idBtn && enBtn) {
            idBtn.addEventListener('click', () => changeLanguage('id'));
            enBtn.addEventListener('click', () => changeLanguage('en'));
            updateLangButtons();
            this.translatePage();
        }
    }

    translatePage() {
        const catalog = i18n[this.currentLang];
        
        // Find all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (catalog[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = catalog[key];
                } else {
                    el.innerText = catalog[key];
                }
            }
        });
    }

    // --- 5. DATA LOADING ---
    async fetchAppData() {
        try {
            const [destRes, cultRes, foodRes] = await Promise.all([
                fetch('/api/destinations'),
                fetch('/api/culture'),
                fetch('/api/food')
            ]);

            this.destinations = await destRes.json();
            this.cultureList = await cultRes.json();
            this.foodList = await foodRes.json();

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // --- 6. HERO SLIDESHOW (Ken Burns) ---
    startHeroSlideshow() {
        this.heroSlides = document.querySelectorAll('.hero-slide');
        if (this.heroSlides.length === 0) return;

        // Reset all classes
        this.heroSlides.forEach((slide, idx) => {
            if (idx === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        const nextSlide = () => {
            const current = this.heroSlides[this.currentSlideIdx];
            this.currentSlideIdx = (this.currentSlideIdx + 1) % this.heroSlides.length;
            const next = this.heroSlides[this.currentSlideIdx];

            // Transition using GSAP
            gsap.killTweensOf([current, next]);

            // Outgoing
            gsap.to(current, {
                opacity: 0,
                scale: 1.0,
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => current.classList.remove('active')
            });

            // Incoming (Reset scale first to make it grow slowly)
            next.classList.add('active');
            gsap.fromTo(next, {
                opacity: 0,
                scale: 1.15
            }, {
                opacity: 1,
                scale: 1.05,
                duration: 1.8,
                ease: "power2.inOut"
            });
        };

        this.slideTimer = setInterval(nextSlide, 6000);
        
        // Manual triggers
        const prevArrow = document.querySelector('.hero-arrow.prev');
        const nextArrow = document.querySelector('.hero-arrow.next');

        if (prevArrow && nextArrow) {
            prevArrow.addEventListener('click', () => {
                clearInterval(this.slideTimer);
                const current = this.heroSlides[this.currentSlideIdx];
                this.currentSlideIdx = (this.currentSlideIdx - 1 + this.heroSlides.length) % this.heroSlides.length;
                const next = this.heroSlides[this.currentSlideIdx];

                gsap.to(current, { opacity: 0, duration: 1.0 });
                next.classList.add('active');
                gsap.fromTo(next, { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1.05, duration: 1.2 });
                this.slideTimer = setInterval(nextSlide, 6000);
            });

            nextArrow.addEventListener('click', () => {
                clearInterval(this.slideTimer);
                nextSlide();
                this.slideTimer = setInterval(nextSlide, 6000);
            });
        }
    }

    // --- 7. SPA ROUTER & TRANSITIONS ---
    setupSPARouting() {
        const navLinks = document.querySelectorAll('.nav-link, .spa-trigger');
        const transitionOverlay = document.getElementById('transition-overlay');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-target');
                if (!targetPage || targetPage === this.activePage) return;

                // Stop virtual tour if active
                if (this.activePage === 'virtual-tour') {
                    papuaVirtualTour.destroy();
                }

                // Premium Swoosh transition
                gsap.timeline()
                    // Slide sweep in
                    .to(transitionOverlay, {
                        x: '0%',
                        duration: 0.6,
                        ease: "power3.inOut",
                        onComplete: () => {
                            // Switch visible screens
                            this.switchPage(targetPage);
                            
                            // Highlight active navbar link
                            document.querySelectorAll('.nav-link').forEach(nl => {
                                nl.classList.toggle('active', nl.getAttribute('data-target') === targetPage);
                            });
                        }
                    })
                    // Slide sweep out
                    .to(transitionOverlay, {
                        x: '100%',
                        duration: 0.6,
                        delay: 0.1,
                        ease: "power3.inOut",
                        onComplete: () => {
                            // Reset position
                            gsap.set(transitionOverlay, { x: '-100%' });
                        }
                    });
            });
        });
    }

    switchPage(pageId) {
        // Toggle screen classes
        const currentScreen = document.getElementById(`${this.activePage}-screen`);
        const nextScreen = document.getElementById(`${pageId}-screen`);

        if (currentScreen) currentScreen.classList.remove('active');
        if (nextScreen) nextScreen.classList.add('active');

        this.activePage = pageId;
        window.scrollTo(0, 0);

        // Specific page initializations
        if (pageId === 'destinations') {
            this.renderDestinations();
            papuaMap.init('indonesia-map-container', this.destinations, this.currentLang);
        } else if (pageId === 'culture') {
            this.renderCulture();
            AOS.refresh();
        } else if (pageId === 'food') {
            this.renderFood();
            AOS.refresh();
        } else if (pageId === 'mini-game') {
            papuaQuiz.init(this.currentLang);
        } else if (pageId === 'virtual-tour') {
            // Default virtual tour photo: Raja Ampat
            document.getElementById('vt-overlay-btn').classList.remove('d-none');
            const panoramaContainer = document.getElementById('panorama-canvas-container');
            if (panoramaContainer) panoramaContainer.innerHTML = '';
        }
        
        // Trigger AOS animations
        AOS.refresh();
    }

    // --- 8. CARD RENDERING AND CONTENT GENERATION ---
    renderFeaturedDestinations() {
        const container = document.getElementById('featured-destinations-grid');
        if (!container) return;

        container.innerHTML = '';
        const featured = this.destinations.slice(0, 3); // Take first 3 as featured

        featured.forEach(dest => {
            const name = this.currentLang === 'id' ? dest.name_id : dest.name_en;
            const desc = this.currentLang === 'id' ? dest.description_id : dest.description_en;
            
            const card = document.createElement('div');
            card.className = 'dest-card glass-card';
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${dest.image_url}" alt="${name}">
                    <span class="region-badge">${dest.region}</span>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h4>${name}</h4>
                        <span class="rating">⭐ ${dest.rating.toFixed(1)}</span>
                    </div>
                    <p class="card-desc">${desc.substring(0, 95)}...</p>
                    <div class="card-footer">
                        <button class="glass-btn small-btn spa-trigger" data-target="destinations">${this.currentLang === 'id' ? 'Selengkapnya' : 'Explore'}</button>
                    </div>
                </div>
            `;
            
            // Re-hook SPA trigger inside the card
            card.querySelector('.spa-trigger').addEventListener('click', (e) => {
                e.preventDefault();
                this.switchPage('destinations');
                // Highlight navbar
                document.querySelectorAll('.nav-link').forEach(nl => {
                    nl.classList.toggle('active', nl.getAttribute('data-target') === 'destinations');
                });
            });

            container.appendChild(card);
        });
    }

    renderDestinations() {
        const grid = document.getElementById('destinations-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        // Apply filter/search if any
        const searchInput = document.getElementById('dest-search-input');
        const regionFilter = document.getElementById('region-filter-select');

        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const region = regionFilter ? regionFilter.value : '';

        const filtered = this.destinations.filter(dest => {
            const name = (this.currentLang === 'id' ? dest.name_id : dest.name_en).toLowerCase();
            const desc = (this.currentLang === 'id' ? dest.description_id : dest.description_en).toLowerCase();
            const matchesSearch = name.includes(query) || desc.includes(query) || dest.region.toLowerCase().includes(query);
            const matchesRegion = region === '' || dest.region === region;
            return matchesSearch && matchesRegion;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-10 text-muted">${i18n[this.currentLang].noDestinations}</div>`;
            return;
        }

        filtered.forEach(dest => {
            const name = this.currentLang === 'id' ? dest.name_id : dest.name_en;
            const desc = this.currentLang === 'id' ? dest.description_id : dest.description_en;

            const card = document.createElement('div');
            card.className = 'dest-card glass-card';
            card.id = `dest-card-${dest.id}`;
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${dest.image_url}" alt="${name}">
                    <span class="region-badge">${dest.region}</span>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h4>${name}</h4>
                        <span class="rating">⭐ ${dest.rating.toFixed(1)}</span>
                    </div>
                    <p class="card-desc">${desc}</p>
                    <div class="card-footer mt-4 flex gap-2">
                        <button class="glass-btn flex-1 py-2 text-sm vt-btn">${this.currentLang === 'id' ? 'Tur Virtual' : 'Virtual Tour'}</button>
                    </div>
                </div>
            `;

            // Virtual Tour action
            card.querySelector('.vt-btn').addEventListener('click', () => {
                this.switchPage('virtual-tour');
                document.getElementById('vt-overlay-btn').classList.add('d-none');
                papuaVirtualTour.init('panorama-canvas-container', dest.image_url);
                // Turn on environmental sound automatically
                if (!papuaAudio.ambientPlaying) {
                    const ambientBtn = document.getElementById('ambient-toggle-btn');
                    const playing = papuaAudio.toggleAmbient();
                    if (ambientBtn) {
                        ambientBtn.classList.toggle('active', playing);
                        ambientBtn.querySelector('.audio-status').innerText = playing ? 'ON' : 'OFF';
                    }
                }
            });

            grid.appendChild(card);
        });

        // Search inputs hookup
        if (searchInput && !searchInput.dataset.hooked) {
            searchInput.dataset.hooked = 'true';
            searchInput.addEventListener('input', () => this.renderDestinations());
        }
        if (regionFilter && !regionFilter.dataset.hooked) {
            regionFilter.dataset.hooked = 'true';
            regionFilter.addEventListener('change', () => this.renderDestinations());
        }
    }

    renderCulture() {
        const container = document.getElementById('culture-gallery-container');
        if (!container) return;

        container.innerHTML = '';

        this.cultureList.forEach(cult => {
            const name = this.currentLang === 'id' ? cult.name_id : cult.name_en;
            const desc = this.currentLang === 'id' ? cult.description_id : cult.description_en;

            const card = document.createElement('div');
            card.className = 'culture-card-wrapper';
            card.setAttribute('data-aos', 'fade-up');
            card.innerHTML = `
                <div class="culture-card-inner">
                    <!-- Front -->
                    <div class="culture-card-front glass-card">
                        <div class="front-image-wrap">
                            <img src="${cult.image_url}" alt="${name}">
                            <span class="category-tag">${cult.category}</span>
                        </div>
                        <div class="front-info">
                            <h4>${name}</h4>
                            <span class="flip-hint">${i18n[this.currentLang].flipHint}</span>
                        </div>
                    </div>
                    <!-- Back -->
                    <div class="culture-card-back glass-card">
                        <h4>${name}</h4>
                        <span class="category-tag mb-4 inline-block">${cult.category}</span>
                        <p>${desc.substring(0, 140)}...</p>
                        <button class="glass-btn small-btn mt-auto lightbox-trigger">${i18n[this.currentLang].readMore}</button>
                    </div>
                </div>
            `;

            // Modal/Lightbox trigger on back card button click
            card.querySelector('.lightbox-trigger').addEventListener('click', (e) => {
                e.stopPropagation();
                this.openLightbox(name, cult.image_url, desc);
            });

            container.appendChild(card);
        });
    }

    renderFood() {
        const container = document.getElementById('food-slider-container');
        if (!container) return;

        container.innerHTML = '';

        this.foodList.forEach((food, idx) => {
            const name = this.currentLang === 'id' ? food.name_id : food.name_en;
            const desc = this.currentLang === 'id' ? food.description_id : food.description_en;
            const story = this.currentLang === 'id' ? food.story_id : food.story_en;

            const card = document.createElement('div');
            card.className = 'food-card glass-card';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', `${idx * 100}`);
            card.innerHTML = `
                <div class="food-img-container">
                    <img src="${food.image_url}" alt="${name}" class="food-img">
                </div>
                <div class="food-details">
                    <h3>${name}</h3>
                    <p class="food-desc">${desc}</p>
                    <div class="food-story-box">
                        <h5>📖 ${i18n[this.currentLang].culturalStory}</h5>
                        <p>${story}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // --- 9. LIGHTBOX COMPONENT ---
    setupLightbox() {
        const closeBtn = document.getElementById('lightbox-close');
        const backdrop = document.getElementById('lightbox-overlay');

        const close = () => {
            gsap.to(backdrop, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => backdrop.classList.add('d-none')
            });
        };

        if (closeBtn && backdrop) {
            closeBtn.addEventListener('click', close);
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) close();
            });
        }
    }

    openLightbox(title, imgUrl, description) {
        const overlay = document.getElementById('lightbox-overlay');
        const lTitle = document.getElementById('lightbox-title');
        const lImg = document.getElementById('lightbox-img');
        const lDesc = document.getElementById('lightbox-desc');

        if (!overlay || !lTitle || !lImg || !lDesc) return;

        lTitle.innerText = title;
        lImg.src = imgUrl;
        lDesc.innerText = description;

        overlay.classList.remove('d-none');
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo('.lightbox-content', { scale: 0.8, y: 50 }, { scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" });
    }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
    // Expose functions globally for simple inline triggers
    window.startQuiz = () => papuaQuiz.startGame();
    window.nextQuestion = () => papuaQuiz.nextQuestion();
    window.submitScore = () => papuaQuiz.submitScore();
    window.resetGame = () => papuaQuiz.resetGame();

    window.zoomTourIn = () => papuaVirtualTour.zoomIn();
    window.zoomTourOut = () => papuaVirtualTour.zoomOut();
    window.toggleTourAutoRotate = () => {
        const rotating = papuaVirtualTour.toggleAutoRotate();
        const btn = document.getElementById('vt-rotate-btn');
        if (btn) btn.classList.toggle('active', rotating);
    };

    window.startMainVirtualTour = () => {
        document.getElementById('vt-overlay-btn').classList.add('d-none');
        // Start tour with Raja Ampat
        papuaVirtualTour.init('panorama-canvas-container', '/static/images/raja_ampat_hero.png');
        
        // Trigger ambient sound
        if (!papuaAudio.ambientPlaying) {
            const ambientBtn = document.getElementById('ambient-toggle-btn');
            const playing = papuaAudio.toggleAmbient();
            if (ambientBtn) {
                ambientBtn.classList.toggle('active', playing);
                ambientBtn.querySelector('.audio-status').innerText = playing ? 'ON' : 'OFF';
            }
        }
    };

    const app = new PapuaApp();
    app.init();
});
export { PapuaApp };
export default PapuaApp;
