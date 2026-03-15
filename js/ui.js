// UI Module - 增强版
const UI = {
    elements: {},
    currentCity: null,
    easterEggCount: 0,
    easterEggTimer: null,
    secretCode: '',
    
    init() {
        this.elements = {
            searchInput: document.getElementById('city-search'),
            searchResults: document.getElementById('search-results'),
            weatherPanel: document.getElementById('weather-panel'),
            closePanel: document.getElementById('close-panel'),
            daynightToggle: document.getElementById('daynight-toggle'),
            volumeSlider: document.getElementById('volume-slider'),
            muteBtn: document.getElementById('mute-btn'),
            loading: document.getElementById('loading'),
            errorToast: document.getElementById('error-toast'),
            errorMessage: document.getElementById('error-message'),
            // Display elements
            displayCity: document.getElementById('display-city'),
            displayTemp: document.getElementById('display-temp'),
            displayCondition: document.getElementById('display-condition'),
            displayConditionText: document.getElementById('display-condition-text'),
            displayHumidity: document.getElementById('display-humidity'),
            displayWind: document.getElementById('display-wind'),
            displayAqi: document.getElementById('display-aqi'),
            displayAqiText: document.getElementById('display-aqi-text'),
            displayTime: document.getElementById('display-time'),
            // Status bar
            statusCity: document.getElementById('status-city'),
            statusTime: document.getElementById('status-time'),
            // 全息卡片
            holoCard: document.getElementById('holo-card'),
            holoCityName: document.getElementById('holo-city-name'),
            holoCoords: document.getElementById('holo-coords'),
            holoTemp: document.getElementById('holo-temp'),
            holoTempFill: document.getElementById('holo-temp-fill'),
            holoCondition: document.getElementById('holo-condition'),
            holoTime: document.getElementById('holo-time'),
            holoTimezone: document.getElementById('holo-timezone'),
            // 搜索弹窗
            searchPopup: document.getElementById('search-popup'),
            popupOverlay: document.getElementById('popup-overlay'),
            popupCity: document.getElementById('popup-city'),
            popupCountry: document.getElementById('popup-country'),
            popupCoords: document.getElementById('popup-coords'),
            popupTemp: document.getElementById('popup-temp'),
            popupCondition: document.getElementById('popup-condition'),
            popupTime: document.getElementById('popup-time'),
            popupCancel: document.getElementById('popup-cancel'),
            popupConfirm: document.getElementById('popup-confirm'),
            // 彩蛋
            easterEggOverlay: document.getElementById('easter-egg-overlay'),
            easterEggText: document.getElementById('easter-egg-text')
        };
        
        this.bindEvents();
        this.startTimeUpdate();
    },
    
    bindEvents() {
        // Search
        this.elements.searchInput.addEventListener('input', (e) => this.onSearch(e.target.value));
        this.elements.searchInput.addEventListener('focus', () => this.showSearchResults());
        this.elements.searchInput.addEventListener('keydown', (e) => this.onSecretCode(e));
        
        // Panel
        this.elements.closePanel.addEventListener('click', () => this.hidePanel());
        
        // Day/Night
        this.elements.daynightToggle.addEventListener('click', () => this.toggleDayNight());
        
        // Volume
        this.elements.volumeSlider.addEventListener('input', (e) => this.onVolumeChange(e.target.value));
        this.elements.muteBtn.addEventListener('click', () => this.onMuteToggle());
        
        // Click outside to close search
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });
        
        // 搜索弹窗事件
        if (this.elements.popupCancel) {
            this.elements.popupCancel.addEventListener('click', () => this.closeSearchPopup());
        }
        if (this.elements.popupConfirm) {
            this.elements.popupConfirm.addEventListener('click', () => this.confirmSearchPopup());
        }
        if (this.elements.popupOverlay) {
            this.elements.popupOverlay.addEventListener('click', () => this.closeSearchPopup());
        }
        
        // 彩蛋：点击地球中心
        document.getElementById('earth-container')?.addEventListener('dblclick', () => this.triggerEasterEgg('SYSTEM ERROR'));
    },
    
    // 键盘输入检测（密码彩蛋）
    onSecretCode(e) {
        this.secretCode += e.key.toLowerCase();
        if (this.secretCode.length > 10) {
            this.secretCode = this.secretCode.slice(-10);
        }
        
        if (this.secretCode === '2077') {
            this.triggerEasterEgg('CYBERPUNK 2077');
            this.secretCode = '';
        }
    },
    
    // 触发彩蛋 - ASCII艺术风格
    triggerEasterEgg(text) {
        if (!this.elements.easterEggOverlay) return;

        const asciiArt = document.getElementById('ascii-art');
        const easterText = this.elements.easterEggText;
        const matrixRain = document.getElementById('matrix-rain');

        // 显示遮罩
        this.elements.easterEggOverlay.classList.add('active');

        // 创建矩阵雨效果
        if (matrixRain) {
            matrixRain.innerHTML = '';
            for (let i = 0; i < 20; i++) {
                const column = document.createElement('div');
                column.className = 'matrix-column';
                column.style.left = `${Math.random() * 100}%`;
                column.style.animationDelay = `${Math.random() * 2}s`;
                column.style.animationDuration = `${2 + Math.random() * 2}s`;
                
                // 生成随机字符
                let chars = '';
                for (let j = 0; j < 20; j++) {
                    chars += String.fromCharCode(0x30A0 + Math.random() * 96) + '<br>';
                }
                column.innerHTML = chars;
                matrixRain.appendChild(column);
            }
        }

        // 根据触发类型显示不同效果
        if (text === 'SYSTEM ERROR') {
            // 系统错误 - 简单故障效果
            if (asciiArt) {
                asciiArt.textContent = this.generateASCIIArt('error');
            }
            if (easterText) {
                easterText.textContent = text;
                easterText.setAttribute('data-text', text);
            }
        } else if (text === 'CYBERPUNK 2077') {
            // 赛博朋克2077 - 华丽ASCII艺术
            if (asciiArt) {
                asciiArt.textContent = this.generateASCIIArt('cyberpunk');
            }
            if (easterText) {
                easterText.textContent = text;
                easterText.setAttribute('data-text', text);
            }
        }

        // 2秒后隐藏
        setTimeout(() => {
            this.elements.easterEggOverlay.classList.remove('active');
            if (matrixRain) {
                matrixRain.innerHTML = '';
            }
        }, 2500);
    },

    // 生成ASCII艺术
    generateASCIIArt(type) {
        const arts = {
            error: `
    ╔══════════════════════════════════════╗
    ║                                      ║
    ║   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄   ║
    ║   █ CRITICAL SYSTEM FAILURE █       ║
    ║   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀   ║
    ║                                      ║
    ║   [ERROR CODE: 0x2077]              ║
    ║   [STATUS: CRITICAL]                ║
    ║   [MEMORY: CORRUPTED]               ║
    ║                                      ║
    ║   > REBOOTING SYSTEM...             ║
    ║   > PLEASE WAIT...                  ║
    ║                                      ║
    ╚══════════════════════════════════════╝
            `,
            cyberpunk: `
    ██████╗ ██████╗ ██╗     ██████╗ ██╗  ██╗██╗   ██╗
    ██╔════╝██╔═══██╗██║     ██╔══██╗██║  ██║╚██╗ ██╔╝
    ██║     ██║   ██║██║     ██║  ██║███████║ ╚████╔╝ 
    ██║     ██║   ██║██║     ██║  ██║██╔══██║  ╚██╔╝  
    ╚██████╗╚██████╔╝███████╗██████╔╝██║  ██║   ██║   
     ╚═════╝ ╚═════╝ ╚══════╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   
                                                     
    ██████╗  ██████╗ ██████╗     ██████╗ ██████╗  ██████╗ 
    ██╔════╝ ██╔═══██╗██╔══██╗   ██╔═══██╗██╔══██╗██╔═══██╗
    ███████╗ ██║   ██║██████╔╝   ██║   ██║██████╔╝██║   ██║
    ██╔═══██╗██║   ██║██╔══██╗   ██║   ██║██╔══██╗██║   ██║
    ╚██████╔╝╚██████╔╝██║  ██║   ╚██████╔╝██║  ██║╚██████╔╝
     ╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ 
                                                         
    ╔══════════════════════════════════════════════════╗
    ║  "The city of dreams. I'd gladly be a nightmare." ║
    ║                                    - Johnny Silverhand  ║
    ╚══════════════════════════════════════════════════╝
            `
        };
        return arts[type] || arts.error;
    },
    
    // 全息卡片显示
    showHoloCard(city, mouseX, mouseY) {
        if (!this.elements.holoCard) return;
        
        // 优先使用la/lo，否则使用lat/lng
        const lat = city.la || city.lat;
        const lon = city.lo || city.lng;
        const { n, ne } = city;
        
        // 更新卡片内容
        this.elements.holoCityName.textContent = `${n} / ${ne}`;
        this.elements.holoCoords.textContent = `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
        this.elements.holoTemp.textContent = '--°C';
        this.elements.holoTempFill.style.width = '50%';
        this.elements.holoCondition.textContent = '加载中...';
        
        // 获取时区时间
        const timezone = city.tz || 'UTC';
        try {
            const now = new Date();
            const options = { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false };
            const timeStr = now.toLocaleTimeString('zh-CN', options);
            const tzAbbr = timezone.split('/').pop();
            this.elements.holoTime.textContent = timeStr;
            this.elements.holoTimezone.textContent = tzAbbr;
        } catch (e) {
            this.elements.holoTime.textContent = '--:--';
            this.elements.holoTimezone.textContent = 'UTC';
        }
        
        // 定位卡片（避免超出屏幕）
        const card = this.elements.holoCard;
        card.classList.remove('hidden');
        
        const container = document.getElementById('earth-container');
        const containerRect = container.getBoundingClientRect();
        
        let left = mouseX - containerRect.left + 20;
        let top = mouseY - containerRect.top - 100;
        
        // 边界检测
        if (left + 300 > containerRect.width) {
            left = containerRect.width - 320;
        }
        if (top < 10) {
            top = mouseY - containerRect.top + 20;
        }
        
        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
        
        // 点击卡片查看详情
        card.onclick = () => {
            this.closeHoloCard();
            this.showSearchPopup(city);
        };
    },
    
    // 关闭全息卡片
    closeHoloCard() {
        if (this.elements.holoCard) {
            this.elements.holoCard.classList.add('hidden');
        }
    },
    
    // 更新全息卡片天气数据
    updateHoloCard(data) {
        if (!this.elements.holoCard || this.elements.holoCard.classList.contains('hidden')) return;
        
        if (data) {
            this.elements.holoTemp.textContent = `${data.temp}°C`;
            this.elements.holoCondition.textContent = data.description;
            
            // 温度条（-20°C = 0%, 40°C = 100%）
            const tempPercent = Math.max(0, Math.min(100, ((data.temp + 20) / 60) * 100));
            this.elements.holoTempFill.style.width = `${tempPercent}%`;
        }
    },
    
    // 搜索弹窗显示（n10风格）- 简化版
    showSearchPopup(city) {
        this.currentCity = city;
        
        // 优先使用la/lo，否则使用lat/lng
        const lat = city.la || city.lat;
        const lon = city.lo || city.lng;
        const { n, ne, tz } = city;
        
        // 显示弹窗
        if (this.elements.searchPopup) this.elements.searchPopup.classList.remove('hidden');
        if (this.elements.popupOverlay) this.elements.popupOverlay.classList.remove('hidden');
        
        // 更新基本信息
        if (this.elements.popupCity) this.elements.popupCity.textContent = n.toUpperCase();
        if (this.elements.popupCountry) this.elements.popupCountry.textContent = ne;
        if (this.elements.popupCoords) this.elements.popupCoords.textContent = `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
        
        // 时间
        if (this.elements.popupTime) {
            try {
                const now = new Date();
                const options = { timeZone: tz || 'UTC', hour: '2-digit', minute: '2-digit', hour12: false };
                const timeStr = now.toLocaleTimeString('zh-CN', options);
                const tzAbbr = (tz || 'UTC').split('/').pop();
                this.elements.popupTime.textContent = `${timeStr} ${tzAbbr}`;
            } catch (e) {
                this.elements.popupTime.textContent = '--:--';
            }
        }
        
        // 默认显示
        if (this.elements.popupTemp) this.elements.popupTemp.textContent = '---';
        if (this.elements.popupCondition) this.elements.popupCondition.textContent = '点击确认查看';
    },
    
    // 更新搜索弹窗天气数据
    updateSearchPopup(data) {
        if (!data) return;
        if (this.elements.popupTemp) this.elements.popupTemp.textContent = `${data.temp}°C`;
        if (this.elements.popupCondition) this.elements.popupCondition.textContent = data.description;
    },
    
    // 关闭搜索弹窗
    closeSearchPopup() {
        console.log('closeSearchPopup called');
        if (this.elements.searchPopup) {
            this.elements.searchPopup.classList.add('hidden');
            console.log('hiding popup');
        }
        if (this.elements.popupOverlay) {
            this.elements.popupOverlay.classList.add('hidden');
            console.log('hiding overlay');
        }
        this.currentCity = null;
    },
    
    // 确认搜索弹窗 - 立即关闭+执行
    confirmSearchPopup() {
        console.log('confirmSearchPopup called');
        const city = this.currentCity;
        this.closeSearchPopup();
        if (city && window.selectCity) {
            window.selectCity(city);
        }
    },
    
    onSearch(query) {
        if (!query || query.length < 1) {
            this.hideSearchResults();
            return;
        }
        
        const results = C.filter(c => 
            c.n.toLowerCase().includes(query.toLowerCase()) || 
            c.ne.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);
        
        if (results.length > 0) {
            this.showSearchResults(results);
        } else {
            this.hideSearchResults();
        }
    },
    
    showSearchResults(results) {
        if (!results) {
            results = C.slice(0, 6);
        }
        
        this.elements.searchResults.innerHTML = results.map(c => `
            <div class="search-result-item" data-city='${JSON.stringify(c)}'>
                <span class="search-result-name">${c.n}</span>
                <span class="search-result-country">${c.ne}</span>
            </div>
        `).join('');
        
        this.elements.searchResults.classList.add('show');
        
        // 点击后直接加载天气（使用onclick确保触发）
        const items = this.elements.searchResults.querySelectorAll('.search-result-item');
        items.forEach(item => {
            item.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const city = JSON.parse(item.dataset.city);
                UI.hideSearchResults();
                UI.elements.searchInput.value = city.n;
                if (window.selectCity) {
                    window.selectCity(city);
                }
                return false;
            };
        });
    },
    
    hideSearchResults() {
        this.elements.searchResults.classList.remove('show');
    },
    
    onCitySelect(city) {
        this.hideSearchResults();
        this.elements.searchInput.value = city.n;
        if (window.selectCity) window.selectCity(city);
    },
    
    showPanel() {
        this.elements.weatherPanel.classList.add('active');
    },
    
    hidePanel() {
        this.elements.weatherPanel.classList.remove('active');
    },
    
    updateWeather(data, aqi) {
        if (!data) return;
        
        this.showPanel();
        
        // 更新状态栏
        if (this.elements.statusCity) {
            this.elements.statusCity.textContent = `◈ ${data.city}`;
        }
        
        // City
        this.elements.displayCity.textContent = data.city;
        
        // Temperature
        this.elements.displayTemp.textContent = `${data.temp}°`;
        
        // Condition
        const icon = CONFIG.weatherIcons[data.icon] || '☁️';
        this.elements.displayCondition.querySelector('.weather-icon').textContent = icon;
        this.elements.displayConditionText.textContent = data.description;
        
        // Humidity
        this.elements.displayHumidity.textContent = `${data.humidity}%`;
        
        // Wind
        this.elements.displayWind.textContent = `${data.wind_speed} m/s`;
        
        // AQI
        if (aqi) {
            this.elements.displayAqi.textContent = aqi.aqi;
            this.elements.displayAqiText.textContent = aqi.label;
            
            const aqiEl = this.elements.displayAqi.parentElement;
            aqiEl.className = 'lcd-row lcd-aqi';
            if (aqi.aqi <= 2) aqiEl.classList.add('aqi-good');
            else if (aqi.aqi <= 3) aqiEl.classList.add('aqi-moderate');
            else aqiEl.classList.add('aqi-unhealthy');
        }
        
        // Time
        this.updateTime();
        
        // 更新全息卡片
        this.updateHoloCard(data);
        this.updateSearchPopup(data);
        
        // 更新移动端四角天气信息
        this.updateMobileCorners(data);
    },
    
    // 更新移动端四角天气信息
    updateMobileCorners(data) {
        const cornerTemp = document.getElementById('corner-temp');
        const cornerCondition = document.getElementById('corner-condition');
        const cornerHumidity = document.getElementById('corner-humidity');
        const cornerWind = document.getElementById('corner-wind');
        
        if (cornerTemp) {
            cornerTemp.querySelector('.corner-value').textContent = `${data.temp}°`;
        }
        if (cornerCondition) {
            const icon = CONFIG.weatherIcons[data.icon] || '☁';
            cornerCondition.querySelector('.corner-icon').textContent = icon;
            cornerCondition.querySelector('.corner-value').textContent = data.description;
        }
        if (cornerHumidity) {
            cornerHumidity.querySelector('.corner-value').textContent = `${data.humidity}%`;
        }
        if (cornerWind) {
            cornerWind.querySelector('.corner-value').textContent = `${data.wind_speed}`;
        }
    },
    
    updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-GB');
        this.elements.displayTime.textContent = timeStr;
        
        if (this.elements.statusTime) {
            this.elements.statusTime.textContent = timeStr;
        }
    },
    
    startTimeUpdate() {
        setInterval(() => this.updateTime(), 1000);
    },
    
    toggleDayNight() {
        const isDay = document.body.classList.contains('day-theme');
        
        if (isDay) {
            document.body.classList.remove('day-theme');
            document.body.classList.add('night-theme');
        } else {
            document.body.classList.remove('night-theme');
            document.body.classList.add('day-theme');
        }
        
        const newIsDay = !isDay;
        
        const sunIcon = this.elements.daynightToggle.querySelector('.icon-sun');
        const moonIcon = this.elements.daynightToggle.querySelector('.icon-moon');
        
        if (newIsDay) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
        
        if (window.setDayNight) window.setDayNight(newIsDay);
    },
    
    onVolumeChange(value) {
        const v = value / 100;
        if (window.setVolume) window.setVolume(v);
    },
    
    onMuteToggle() {
        if (window.toggleMute) {
            const isMuted = window.toggleMute();
            const soundIcon = this.elements.muteBtn.querySelector('.icon-sound');
            const mutedIcon = this.elements.muteBtn.querySelector('.icon-muted');
            
            if (isMuted) {
                soundIcon.classList.add('hidden');
                mutedIcon.classList.remove('hidden');
            } else {
                soundIcon.classList.remove('hidden');
                mutedIcon.classList.add('hidden');
            }
        }
    },
    
    hideLoading() {
        this.elements.loading.classList.add('hidden');
    },
    
    showError(msg) {
        this.elements.errorMessage.textContent = msg;
        this.elements.errorToast.classList.remove('hidden');
        this.elements.errorToast.classList.add('show');
        setTimeout(() => {
            this.elements.errorToast.classList.remove('show');
        }, 3000);
    },
    
    // 显示城市问候语
    showGreeting(city, timeGreeting) {
        // 创建问候语提示
        const existingGreeting = document.getElementById('greeting-toast');
        if (existingGreeting) existingGreeting.remove();
        
        const greeting = document.createElement('div');
        greeting.id = 'greeting-toast';
        greeting.className = 'greeting-toast';
        // 使用时间问候语，如果没有则显示城市名
        const displayGreeting = timeGreeting || city.greeting || city.n;
        greeting.innerHTML = `
            <span class="greeting-city">${city.n}</span>
            <span class="greeting-text">${displayGreeting}</span>
        `;
        
        document.body.appendChild(greeting);
        
        // 动画显示
        setTimeout(() => greeting.classList.add('show'), 50);
        
        // 2.5秒后消失
        setTimeout(() => {
            greeting.classList.remove('show');
            setTimeout(() => greeting.remove(), 500);
        }, 2500);
    },
    
    getCurrentTheme() {
        return document.body.classList.contains('day-theme');
    }
};
