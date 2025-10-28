// DomainFinder Frontend JavaScript
// Comprehensive functionality for domain search, dashboard, and interactive features

class DomainFinder {
    constructor() {
        this.apiBaseUrl = 'http://127.0.0.1:5000';
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.initializeCharts();
        this.loadSavedData();
        this.startParticleSystem();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Domain search functionality
        const searchBtn = document.getElementById('search-btn');
        const domainInput = document.getElementById('domain-search');
        const extensionSelect = document.getElementById('domain-extension');

        if (searchBtn && domainInput) {
            searchBtn.addEventListener('click', this.performDomainSearch.bind(this));
            domainInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performDomainSearch();
            });
        }

        // Suggestion buttons
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const domain = e.target.dataset.domain;
                if (domainInput) {
                    domainInput.value = domain;
                    this.performDomainSearch();
                }
            });
        });

        // Dashboard tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', this.switchDashboardTab.bind(this));
        });

        // Pricing calculator
        this.initializePricingCalculator();

        // TLD search
        const tldSearch = document.getElementById('tld-search');
        if (tldSearch) {
            tldSearch.addEventListener('input', this.filterTLDTable.bind(this));
        }

        // Scroll animations
        this.initializeScrollAnimations();

        // Counter animations
        this.animateCounters();
    }

    async performDomainSearch() {
        const domainInput = document.getElementById('domain-search');
        const extensionSelect = document.getElementById('domain-extension');
        const searchBtn = document.getElementById('search-btn');
        const searchText = document.getElementById('search-text');
        const searchSpinner = document.getElementById('search-spinner');
        const resultsContainer = document.getElementById('search-results');

        if (!domainInput || !domainInput.value.trim()) {
            this.showNotification('Please enter a domain name', 'warning');
            return;
        }

        const domainName = domainInput.value.trim();
        const extension = extensionSelect ? extensionSelect.value : '.com';
        const fullDomain = domainName + extension;

        // --- loading UI ---
        if (searchBtn) searchBtn.disabled = true;
        if (searchText) searchText.textContent = 'Searching...';
        if (searchSpinner) searchSpinner.classList.remove('hidden');

        try {
            const res = await fetch(`${this.apiBaseUrl}/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain: fullDomain })
            });

            if (!res.ok) throw new Error('Network error');
            const data = await res.json();

            // build a single-result array to reuse the existing UI
            const results = [{
                domain: data.domain,
                available: data.available,
                price: data.available ? this.getDomainPrice(data.domain) : null,
                type: data.available ? 'available' : 'taken'
            }];

            this.displaySearchResults(results);
            this.addToSearchHistory(data.domain, data.available);

            if (resultsContainer) {
                resultsContainer.classList.remove('hidden');
                this.animateElement(resultsContainer, 'fadeInUp');
            }

        } catch (err) {
            console.error(err);
            this.showNotification('Search failed – is the backend running?', 'error');
        } finally {
            if (searchBtn) searchBtn.disabled = false;
            if (searchText) searchText.textContent = 'Search Domain';
            if (searchSpinner) searchSpinner.classList.add('hidden');
        }
    }

    async mockDomainSearch(domain) {
        // Mock domain search results
        const extensions = ['.com', '.net', '.org', '.io', '.ai', '.dev'];
        const results = [];

        // Primary domain
        const isAvailable = Math.random() > 0.3; // 70% chance of being available
        results.push({
            domain: domain,
            available: isAvailable,
            price: isAvailable ? this.getDomainPrice(domain) : null,
            type: isAvailable ? 'available' : 'taken'
        });

        // Alternative suggestions
        const alternatives = extensions
            .filter(ext => !domain.includes(ext))
            .slice(0, 5)
            .map(ext => {
                const altDomain = domain.split('.')[0] + ext;
                const altAvailable = Math.random() > 0.4;
                return {
                    domain: altDomain,
                    available: altAvailable,
                    price: altAvailable ? this.getDomainPrice(altDomain) : null,
                    type: altAvailable ? 'available' : 'taken'
                };
            });

        return [...results, ...alternatives];
    }

    getDomainPrice(domain) {
        const extension = domain.substring(domain.lastIndexOf('.'));
        const prices = {
            '.com': 12.99,
            '.net': 14.99,
            '.org': 13.99,
            '.io': 39.99,
            '.ai': 79.99,
            '.dev': 12.99,
            '.app': 16.99,
            '.co': 29.99
        };
        return prices[extension] || 12.99;
    }

    displaySearchResults(results) {
        const resultsGrid = document.getElementById('results-grid');
        if (!resultsGrid) return;

        resultsGrid.innerHTML = '';

        results.forEach((result, index) => {
            const resultCard = this.createResultCard(result, index);
            resultsGrid.appendChild(resultCard);
        });

        // Animate results
        this.animateStagger(resultsGrid.children, 'fadeInUp', 100);
    }

    createResultCard(result, index) {
        const card = document.createElement('div');
        card.className = `domain-card ${result.type} p-6 rounded-xl bg-white cursor-pointer`;

        const statusColor = result.available ? 'text-green-600' : 'text-red-600';
        const statusText = result.available ? 'Available' : 'Taken';
        const statusBg = result.available ? 'bg-green-100' : 'bg-red-100';

        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h3 class="domain-font font-bold text-lg text-slate-800">${result.domain}</h3>
                <span class="px-3 py-1 ${statusBg} ${statusColor} text-sm rounded-full font-medium">
                    ${statusText}
                </span>
            </div>
            ${result.available ? `
                <div class="flex items-center justify-between mb-4">
                    <span class="text-gray-600">Price:</span>
                    <span class="font-bold text-slate-800">$${result.price}</span>
                </div>
                <div class="flex space-x-2">
                    <button class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors" 
                            onclick="domainFinder.addToCart('${result.domain}', ${result.price})">
                        Add to Cart
                    </button>
                    <button class="flex-1 border border-gray-300 hover:bg-gray-50 text-slate-700 py-2 px-4 rounded-lg font-medium transition-colors"
                            onclick="domainFinder.toggleFavorite('${result.domain}')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
            ` : `
                <p class="text-gray-600 text-sm">This domain is not available for registration.</p>
                <button class="w-full mt-4 border border-gray-300 hover:bg-gray-50 text-slate-700 py-2 px-4 rounded-lg font-medium transition-colors"
                        onclick="domainFinder.showAlternativeSuggestions('${result.domain}')">
                    Show Alternatives
                </button>
            `}
        `;

        return card;
    }

    addToCart(domain, price) {
        const existingItem = this.cart.find(item => item.domain === domain);
        if (existingItem) {
            this.showNotification('Domain already in cart', 'warning');
            return;
        }

        this.cart.push({ domain, price, addedAt: new Date().toISOString() });
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.showNotification(`${domain} added to cart`, 'success');
        this.updateCartDisplay();
    }

    toggleFavorite(domain) {
        const existingIndex = this.favorites.findIndex(fav => fav.domain === domain);

        if (existingIndex > -1) {
            this.favorites.splice(existingIndex, 1);
            this.showNotification(`${domain} removed from favorites`, 'info');
        } else {
            this.favorites.push({ domain, addedAt: new Date().toISOString() });
            this.showNotification(`${domain} added to favorites`, 'success');
        }

        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateFavoritesDisplay();
    }

    addToSearchHistory(domain, available) {
        const existingIndex = this.searchHistory.findIndex(item => item.domain === domain);
        const searchItem = {
            domain,
            available,
            searchedAt: new Date().toISOString()
        };

        if (existingIndex > -1) {
            this.searchHistory[existingIndex] = searchItem;
        } else {
            this.searchHistory.unshift(searchItem);
            if (this.searchHistory.length > 20) {
                this.searchHistory = this.searchHistory.slice(0, 20);
            }
        }

        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    switchDashboardTab(e) {
        const tabName = e.target.dataset.tab;
        if (!tabName) return;

        // Update tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Hide all tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.add('hidden'));

        // Show selected tab content
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.remove('hidden');
            this.animateElement(selectedTab, 'fadeIn');
        }

        // Initialize tab-specific content
        if (tabName === 'analytics' && typeof echarts !== 'undefined') {
            setTimeout(() => this.initializeAnalyticsChart(), 100);
        }
    }

    initializePricingCalculator() {
        const calcDomain = document.getElementById('calc-domain');
        const calcExtension = document.getElementById('calc-extension');
        const calcPeriod = document.getElementById('calc-period');
        const calcQuantity = document.getElementById('calc-quantity');

        if (!calcDomain || !calcExtension || !calcPeriod || !calcQuantity) return;

        const updateCalculation = () => {
            const domain = calcDomain.value || 'example';
            const extension = calcExtension.options[calcExtension.selectedIndex];
            const period = parseInt(calcPeriod.value);
            const quantity = parseInt(calcQuantity.value);
            const basePrice = parseFloat(extension.dataset.price || '12.99');

            const domainCost = basePrice;
            const subtotal = domainCost * period * quantity;
            const discount = period > 1 ? subtotal * 0.1 : 0;
            const total = subtotal - discount;

            // Update display
            document.getElementById('calc-domain-cost').textContent = `$${domainCost.toFixed(2)}`;
            document.getElementById('calc-period-display').textContent = `${period} Year${period > 1 ? 's' : ''}`;
            document.getElementById('calc-quantity-display').textContent = quantity;
            document.getElementById('calc-subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('calc-discount').textContent = `-$${discount.toFixed(2)}`;
            document.getElementById('calc-total').textContent = `$${total.toFixed(2)}`;
        };

        [calcDomain, calcExtension, calcPeriod, calcQuantity].forEach(element => {
            element.addEventListener('input', updateCalculation);
            element.addEventListener('change', updateCalculation);
        });

        updateCalculation(); // Initial calculation
    }

    filterTLDTable() {
        const searchInput = document.getElementById('tld-search');
        const tableRows = document.querySelectorAll('.tld-price');

        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase();

        tableRows.forEach(row => {
            const extension = row.querySelector('.domain-font').textContent.toLowerCase();
            const category = row.cells[4].textContent.toLowerCase();

            if (extension.includes(searchTerm) || category.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    initializeAnimations() {
        // Initialize text splitting for animations
        if (typeof Splitting !== 'undefined') {
            Splitting();
        }

        // Animate hero text
        const heroTitle = document.querySelector('[data-splitting]');
        if (heroTitle) {
            anime({
                targets: heroTitle.querySelectorAll('.char'),
                translateY: [100, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 1400,
                delay: (el, i) => 30 * i
            });
        }

        // Animate stats counters
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-counter], [data-target]');

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.dataset.counter || counter.dataset.target);
                    this.animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current >= target) {
                current = target;
                element.textContent = target % 1 === 0 ? target.toString() : target.toFixed(1);
                return;
            }
            element.textContent = target % 1 === 0 ? Math.floor(current).toString() : current.toFixed(1);
            requestAnimationFrame(updateCounter);
        };

        updateCounter();
    }

    initializeScrollAnimations() {
        const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .team-card, .timeline-item');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target, 'fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateElements.forEach(el => observer.observe(el));
    }

    animateElement(element, animationType = 'fadeInUp') {
        const animations = {
            fadeInUp: {
                translateY: [50, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 800
            },
            fadeIn: {
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 600
            }
        };

        anime({
            targets: element,
            ...animations[animationType]
        });
    }

    animateStagger(elements, animationType = 'fadeInUp', delay = 100) {
        anime({
            targets: elements,
            ...this.getAnimationConfig(animationType),
            delay: anime.stagger(delay)
        });
    }

    getAnimationConfig(type) {
        const configs = {
            fadeInUp: {
                translateY: [30, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 600
            },
            fadeIn: {
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 400
            }
        };
        return configs[type] || configs.fadeInUp;
    }

    initializeCharts() {
        // Initialize ECharts for analytics and market data
        if (typeof echarts === 'undefined') return;

        this.initializeExtensionsChart();
        this.initializeTrendsChart();
        this.initializeAnalyticsChart();
    }

    initializeExtensionsChart() {
        const chartElement = document.getElementById('extensions-chart');
        if (!chartElement) return;

        const chart = echarts.init(chartElement);
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}% ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                textStyle: { color: '#64748b' }
            },
            series: [{
                name: 'Domain Extensions',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 45, name: '.com', itemStyle: { color: '#0ea5e9' } },
                    { value: 20, name: '.io', itemStyle: { color: '#10b981' } },
                    { value: 15, name: '.ai', itemStyle: { color: '#f59e0b' } },
                    { value: 10, name: '.dev', itemStyle: { color: '#8b5cf6' } },
                    { value: 10, name: 'Others', itemStyle: { color: '#64748b' } }
                ]
            }]
        };

        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    initializeTrendsChart() {
        const chartElement = document.getElementById('trends-chart');
        if (!chartElement) return;

        const chart = echarts.init(chartElement);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['Registrations', 'Searches'],
                textStyle: { color: '#64748b' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                axisLabel: { color: '#64748b' }
            }],
            yAxis: [{
                type: 'value',
                axisLabel: { color: '#64748b' }
            }],
            series: [
                {
                    name: 'Registrations',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 3,
                        color: '#0ea5e9'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(14, 165, 233, 0.3)' },
                                { offset: 1, color: 'rgba(14, 165, 233, 0.1)' }
                            ]
                        }
                    },
                    data: [1200, 1400, 1600, 1800, 2000, 2200, 2400]
                },
                {
                    name: 'Searches',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 3,
                        color: '#10b981'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                                { offset: 1, color: 'rgba(16, 185, 129, 0.1)' }
                            ]
                        }
                    },
                    data: [5000, 5500, 6000, 6500, 7000, 7500, 8000]
                }
            ]
        };

        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    initializeAnalyticsChart() {
        const chartElement = document.getElementById('analytics-chart');
        if (!chartElement) return;

        const chart = echarts.init(chartElement);
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Searches', 'Favorites', 'Cart Additions'],
                textStyle: { color: '#64748b' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisLabel: { color: '#64748b' }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#64748b' }
            },
            series: [
                {
                    name: 'Searches',
                    type: 'line',
                    data: [12, 19, 15, 22, 18, 8, 14],
                    smooth: true,
                    lineStyle: { color: '#0ea5e9', width: 3 }
                },
                {
                    name: 'Favorites',
                    type: 'line',
                    data: [3, 7, 4, 8, 6, 2, 5],
                    smooth: true,
                    lineStyle: { color: '#10b981', width: 3 }
                },
                {
                    name: 'Cart Additions',
                    type: 'line',
                    data: [1, 4, 2, 5, 3, 1, 2],
                    smooth: true,
                    lineStyle: { color: '#f59e0b', width: 3 }
                }
            ]
        };

        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    startParticleSystem() {
        // Simple particle system for background effect
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        // Create canvas context and setup particle system
        // This is a simplified version - in production, you'd use a proper particle library
        this.createParticleEffect(canvas);
    }

    createParticleEffect(container) {
        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(14, 165, 233, 0.3);
                border-radius: 50%;
                pointer-events: none;
            `;

            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            container.appendChild(particle);
            particles.push(particle);
        }

        // Animate particles
        particles.forEach((particle, index) => {
            anime({
                targets: particle,
                translateY: [0, -100],
                translateX: [0, Math.random() * 100 - 50],
                opacity: [0.3, 0],
                scale: [1, 0],
                duration: 8000 + Math.random() * 4000,
                delay: Math.random() * 2000,
                loop: true,
                easing: 'linear'
            });
        });
    }

    loadSavedData() {
        this.updateFavoritesDisplay();
        this.updateCartDisplay();
        this.updateSearchHistoryDisplay();
    }

    updateFavoritesDisplay() {
        // Update favorites display in dashboard
        const favoritesContainer = document.getElementById('favorite-domains');
        if (!favoritesContainer) return;

        if (this.favorites.length === 0) {
            favoritesContainer.innerHTML = `
                <div class="empty-state text-center py-8">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <p class="text-gray-500">No favorite domains yet</p>
                    <p class="text-sm text-gray-400 mt-2">Start searching to add domains to your favorites</p>
                </div>
            `;
            return;
        }

        favoritesContainer.innerHTML = this.favorites.map(fav => `
            <div class="domain-item available p-4 rounded-lg border bg-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="domain-font font-semibold text-lg text-slate-800">${fav.domain}</p>
                        <p class="text-sm text-gray-600">Added ${this.formatDate(fav.addedAt)}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">Available</span>
                        <span class="text-lg font-bold text-slate-800">$${this.getDomainPrice(fav.domain)}</span>
                        <button class="text-red-500 hover:text-red-600" onclick="domainFinder.toggleFavorite('${fav.domain}')">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateCartDisplay() {
        // Update cart display and total
        const cartContainer = document.getElementById('cart-domains');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-state text-center py-8">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"></path>
                    </svg>
                    <p class="text-gray-500">Your cart is empty</p>
                    <p class="text-sm text-gray-400 mt-2">Add domains to cart to see them here</p>
                </div>
            `;
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + item.price, 0);

        cartContainer.innerHTML = this.cart.map(item => `
            <div class="domain-item available p-4 rounded-lg border bg-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="domain-font font-semibold text-lg text-slate-800">${item.domain}</p>
                        <p class="text-sm text-gray-600">1 year registration</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="text-lg font-bold text-slate-800">$${item.price}</span>
                        <button class="text-red-500 hover:text-red-600" onclick="domainFinder.removeFromCart('${item.domain}')">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Update total
        const totalElement = cartContainer.parentElement.querySelector('.text-lg.font-bold.text-slate-800');
        if (totalElement) {
            totalElement.textContent = `Total: $${total.toFixed(2)}`;
        }
    }

    updateSearchHistoryDisplay() {
        const historyContainer = document.getElementById('recent-searches');
        if (!historyContainer) return;

        if (this.searchHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state text-center py-8">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-gray-500">No search history</p>
                    <p class="text-sm text-gray-400 mt-2">Your recent searches will appear here</p>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = this.searchHistory.slice(0, 10).map(item => `
            <div class="domain-item ${item.available ? 'available' : 'taken'} p-4 rounded-lg border bg-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="domain-font font-semibold text-lg text-slate-800">${item.domain}</p>
                        <p class="text-sm text-gray-600">Searched ${this.formatDate(item.searchedAt)}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="px-3 py-1 ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-sm rounded-full font-medium">
                            ${item.available ? 'Available' : 'Taken'}
                        </span>
                        ${item.available ? `<span class="text-lg font-bold text-slate-800">$${this.getDomainPrice(item.domain)}</span>` : ''}
                        <button class="text-gray-400 hover:text-blue-500" onclick="domainFinder.researchDomain('${item.domain}')">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    removeFromCart(domain) {
        this.cart = this.cart.filter(item => item.domain !== domain);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
        this.showNotification(`${domain} removed from cart`, 'info');
    }

    researchDomain(domain) {
        const domainInput = document.getElementById('domain-search');
        if (domainInput) {
            domainInput.value = domain.split('.')[0];
            const extensionSelect = document.getElementById('domain-extension');
            if (extensionSelect) {
                const extension = '.' + domain.split('.').slice(1).join('.');
                extensionSelect.value = extension;
            }
            this.performDomainSearch();
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    }

    toggleMobileMenu() {
        // Mobile menu toggle functionality
        console.log('Mobile menu toggled');
    }

    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;

        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-amber-500 text-white',
            info: 'bg-blue-500 text-white'
        };

        notification.className += ` ${colors[type]}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="flex-1">${message}</div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.domainFinder = new DomainFinder();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DomainFinder;
}