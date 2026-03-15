/**
 * Terminal UI Module - 右侧单面板版
 */

const TerminalUI = {
    elements: {
        output: null,
        input: null,
        timeDisplay: null,
        tickerTrack: null,
        weatherDisplay: null,
        weatherHumidity: null,
        weatherWind: null,
        weatherDesc: null
    },
    
    commandHistory: [],
    historyIndex: -1,
    speechSynthesis: window.speechSynthesis,
    _voices: [],

    init() {
        this.elements.output = document.getElementById('terminal-output');
        this.elements.input = document.getElementById('terminal-input');
        this.elements.timeDisplay = document.getElementById('header-time');
        this.elements.tickerTrack = document.getElementById('city-ticker-track');
        this.elements.weatherDisplay = document.getElementById('weather-display');
        this.elements.weatherHumidity = document.getElementById('weather-humidity');
        this.elements.weatherWind = document.getElementById('weather-wind');
        this.elements.weatherDesc = document.getElementById('weather-desc');

        // 预加载语音列表（部分浏览器异步加载）
        if (this.speechSynthesis) {
            const loadVoices = () => {
                this._voices = this.speechSynthesis.getVoices();
            };
            loadVoices();
            if (this.speechSynthesis.onvoiceschanged !== undefined) {
                this.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }

        this.bindEvents();
        this.startTime();
        this.bindTickerClicks();
    },
    
    bindEvents() {
        console.log('TerminalUI init, input element:', this.elements.input);
        if (!this.elements.input) {
            console.error('Input element NOT found!');
            return;
        }
        console.log('Input element found, adding event listeners');

        // ── 防抖 flag + 自动跳转计时器 ────────────────────────────
        let _submitLock = false;
        let _autoTimer  = null;

        const submitInput = () => {
            const val = this.elements.input.value;
            if (!val.trim()) return;
            if (_submitLock) return;
            _submitLock = true;
            setTimeout(() => { _submitLock = false; }, 50);
            if (_autoTimer) { clearTimeout(_autoTimer); _autoTimer = null; }
            this.handleCommand(val);
            this.elements.input.value = '';
        };

        // 1) input 事件：输入停顿 800ms 后自动跳转（移动端主触发方式）
        this.elements.input.addEventListener('input', () => {
            if (_autoTimer) clearTimeout(_autoTimer);
            const val = this.elements.input.value.trim();
            if (!val) return;
            _autoTimer = setTimeout(() => {
                _autoTimer = null;
                submitInput();
            }, 800);
        });

        // 2) keydown Enter：桌面端立即触发 + 方向键历史
        this.elements.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (_autoTimer) { clearTimeout(_autoTimer); _autoTimer = null; }
                submitInput();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });

        // 3) keyup Enter：兼容部分 Android 软键盘只触发 keyup 的情况
        this.elements.input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (_autoTimer) { clearTimeout(_autoTimer); _autoTimer = null; }
                submitInput();
            }
        });

        // 4) compositionend：中文输入法确认后重置计时器（不立即提交，防止字未输完触发）
        this.elements.input.addEventListener('compositionend', () => {
            if (_autoTimer) clearTimeout(_autoTimer);
            const val = this.elements.input.value.trim();
            if (!val) return;
            _autoTimer = setTimeout(() => {
                _autoTimer = null;
                submitInput();
            }, 800);
        });

        // 测试输入框是否可以获取焦点
        this.elements.input.addEventListener('focus', () => {
            console.log('Input focused!');
        });
    },
    
    bindTickerClicks() {
        if (this.elements.tickerTrack) {
            this.elements.tickerTrack.addEventListener('click', async (e) => {
                const item = e.target.closest('.city-ticker-item');
                if (item) {
                    const cityName = item.dataset.city || item.textContent;
                    const city = this.findCity(cityName);
                    if (city && typeof window.selectCity === 'function') {
                        await window.selectCity(city);
                    }
                }
            });
        }
    },
    
    // 使用全局城市数据 C（来自 cities.js）
    getCities() {
        console.log('getCities called, typeof C:', typeof C);
        if (typeof C !== 'undefined' && Array.isArray(C)) {
            console.log('Using C array, length:', C.length);
            return C;
        }
        console.warn('C is not defined or not an array, using fallback data');
        // 备用数据
        return [
            { n: "北京", ne: "Beijing", c: "CN", la: 39.9, lo: 116.4, lang: "zh-CN" },
            { n: "上海", ne: "Shanghai", c: "CN", la: 31.2, lo: 121.5, lang: "zh-CN" },
            { n: "东京", ne: "Tokyo", c: "JP", la: 35.7, lo: 139.7, lang: "ja-JP" },
            { n: "纽约", ne: "New York", c: "US", la: 40.7, lo: -74.0, lang: "en-US" },
            { n: "伦敦", ne: "London", c: "GB", la: 51.5, lo: -0.1, lang: "en-GB" }
        ];
    },
    
    findCity(name) {
        const cities = this.getCities();
        const searchName = name.toLowerCase().trim();
        
        return cities.find(c => 
            c.ne.toLowerCase() === searchName || 
            c.n === searchName ||
            c.ne.toLowerCase().includes(searchName) ||
            searchName.includes(c.ne.toLowerCase())
        );
    },
    
    handleCommand(cmd) {
        const trimmed = cmd.trim();
        if (!trimmed) return;
        
        this.commandHistory.unshift(trimmed);
        this.historyIndex = -1;
        
        const city = this.findCity(trimmed);
        if (city) {
            this.addOutput(`Searching ${city.ne}...`, 'system');
            
            // 调用地球跳转到该城市
            if (typeof ASCIIEarth !== 'undefined') {
                const found = ASCIIEarth.searchAndFocusCity(trimmed);
                if (found && typeof window.selectCity === 'function') {
                    window.selectCity(found);
                }
            }

            // 移动端：搜索成功后自动收起右侧抽屉
            if (typeof window.MobilePanel !== 'undefined') {
                setTimeout(() => window.MobilePanel.close(), 300);
            }
        } else {
            this.addOutput(`City not found: ${trimmed}`, 'error');
            this.addOutput('Try: Beijing, Tokyo, London, Paris...', 'system');
        }
    },
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        this.historyIndex = Math.max(-1, Math.min(this.commandHistory.length - 1, this.historyIndex));
        
        if (this.historyIndex === -1) {
            this.elements.input.value = '';
        } else {
            this.elements.input.value = this.commandHistory[this.historyIndex];
        }
    },
    
    addOutput(message, type = 'system') {
        if (!this.elements.output) return;
        
        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        line.innerHTML = `<span class="message">${message}</span>`;
        
        this.elements.output.appendChild(line);
        this.elements.output.scrollTop = this.elements.output.scrollHeight;
        
        while (this.elements.output.children.length > 30) {
            this.elements.output.removeChild(this.elements.output.firstChild);
        }
    },
    
    // 语音播报天气（延迟由调用方控制）
    speakWeather(city, weather) {
        if (!this.speechSynthesis || !weather) return;

        // ── iOS TTS 解锁序列 ──────────────────────────────────────
        // iOS Safari 要求 speechSynthesis 在用户手势后才能播报；
        // 此处先 cancel + resume，确保 AudioSession 激活
        this.speechSynthesis.cancel();
        if (this.speechSynthesis.paused) {
            this.speechSynthesis.resume();
        }

        const lang = city.lang || 'zh-CN';
        const isZh = lang.startsWith('zh');

        // 时间段问候
        const hour = new Date().getHours();
        let timeGreeting = '';
        if (isZh) {
            if (hour >= 5  && hour < 9)  timeGreeting = '早上好！';
            else if (hour >= 9  && hour < 12) timeGreeting = '上午好！';
            else if (hour >= 12 && hour < 14) timeGreeting = '中午好！';
            else if (hour >= 14 && hour < 18) timeGreeting = '下午好！';
            else if (hour >= 18 && hour < 22) timeGreeting = '晚上好！';
            else                               timeGreeting = '夜深了，注意休息。';
        } else {
            if (hour >= 5  && hour < 12) timeGreeting = 'Good morning!';
            else if (hour >= 12 && hour < 18) timeGreeting = 'Good afternoon!';
            else                               timeGreeting = 'Good evening!';
        }

        // 体感温度差异描述
        const feelsLike = weather.feels_like != null ? weather.feels_like : weather.temp;
        const diff = feelsLike - weather.temp;
        let feelsStr = '';
        if (isZh) {
            if (diff <= -3)       feelsStr = `，但体感更冷，约${feelsLike}度`;
            else if (diff >= 3)   feelsStr = `，体感较热，约${feelsLike}度`;
        } else {
            if (diff <= -3)       feelsStr = `, but feels like ${feelsLike}°C`;
            else if (diff >= 3)   feelsStr = `, feels like ${feelsLike}°C`;
        }

        // 天气生活建议
        const desc = (weather.description || '').toLowerCase();
        const main = (weather.main || '').toLowerCase();
        let advice = '';
        if (isZh) {
            if (main.includes('rain') || desc.includes('雨'))          advice = '出门请记得带伞。';
            else if (main.includes('snow') || desc.includes('雪'))     advice = '路面湿滑，注意出行安全。';
            else if (main.includes('thunder') || desc.includes('雷'))  advice = '有雷暴，尽量避免外出。';
            else if (weather.temp >= 35)                                advice = '天气炎热，注意防暑补水。';
            else if (weather.temp <= 0)                                 advice = '气温在零度以下，注意保暖。';
            else if (weather.temp <= 8)                                 advice = '天气较冷，适当添衣。';
            else if (main.includes('clear') || desc.includes('晴'))    advice = '天气晴好，适合外出。';
        } else {
            if (main.includes('rain'))       advice = 'Bring an umbrella.';
            else if (main.includes('snow'))  advice = 'Roads may be slippery.';
            else if (weather.temp >= 35)     advice = 'Stay hydrated in the heat.';
            else if (weather.temp <= 0)      advice = "It's freezing — bundle up!";
        }

        // 拼装完整播报文本
        let text = '';
        if (isZh) {
            text = `${timeGreeting}为您播报${city.n}当前天气：` +
                   `气温${weather.temp}摄氏度${feelsStr}，` +
                   `天气${weather.description || '晴朗'}，` +
                   `湿度${weather.humidity}%，` +
                   `风速每秒${weather.wind_speed}米。` +
                   (advice ? advice : '');
        } else {
            text = `${timeGreeting} Here's the weather in ${city.ne}: ` +
                   `Temperature ${weather.temp} degrees Celsius${feelsStr}, ` +
                   `${weather.description || 'clear sky'}, ` +
                   `humidity ${weather.humidity} percent, ` +
                   `wind speed ${weather.wind_speed} meters per second. ` +
                   (advice ? advice : '');
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang  = lang;
        utterance.rate  = 0.95;   // 稍慢，听得更清楚
        utterance.pitch = 1.05;   // 略高，更清晰

        // 选择更自然的语音（优先本地语音）
        const voices = (this._voices && this._voices.length)
            ? this._voices
            : this.speechSynthesis.getVoices();
        if (voices.length) {
            const preferred = voices.find(v =>
                v.lang.startsWith(isZh ? 'zh' : 'en') && v.localService
            ) || voices.find(v => v.lang.startsWith(isZh ? 'zh' : 'en'));
            if (preferred) utterance.voice = preferred;
        }

        this.speechSynthesis.speak(utterance);
    },

    displayWeather(city, weather, opts = {}) {
        if (!weather) {
            this.addOutput(`> ERR: No weather data for ${city.n || city.name}`, 'error');
            return;
        }

        // 终端输出
        this.addOutput(`── ${(city.ne || city.n).toUpperCase()} ──`, 'success');
        this.addOutput(`Temp: ${weather.temp}°C  |  Humidity: ${weather.humidity}%`, 'system');
        this.addOutput(`Wind: ${weather.wind_speed} m/s  |  ${weather.description || '--'}`, 'system');

        // 天气面板更新
        const weatherCity = this.elements.weatherDisplay?.querySelector('.weather-city');
        const weatherTemp = this.elements.weatherDisplay?.querySelector('.weather-temp');

        if (weatherCity) weatherCity.textContent = (city.ne || city.n).toUpperCase();
        if (weatherTemp) weatherTemp.textContent = `${weather.temp}°C`;
        if (this.elements.weatherHumidity) this.elements.weatherHumidity.textContent = `${weather.humidity}%`;
        if (this.elements.weatherWind)     this.elements.weatherWind.textContent     = `${weather.wind_speed} m/s`;
        if (this.elements.weatherDesc)     this.elements.weatherDesc.textContent     = weather.description || '--';

        // 默认立即播报；skipSpeak=true 时交由调用方延迟触发
        if (!opts.skipSpeak) {
            this.speakWeather(city, weather);
        }
    },
    
    showHoloCard(city, mouseX, mouseY) {
        const card = document.getElementById('holo-card');
        if (!card) return;
        
        const nameEl = document.getElementById('holo-city-name');
        const coordsEl = document.getElementById('holo-coords');
        const tempEl = document.getElementById('holo-temp');
        const condEl = document.getElementById('holo-condition');
        
        if (nameEl) nameEl.textContent = city.ne || city.name;
        if (coordsEl) coordsEl.textContent = `${city.la?.toFixed(1)}°, ${city.lo?.toFixed(1)}°`;
        if (tempEl) tempEl.textContent = '--°C';
        if (condEl) condEl.textContent = 'Loading...';
        
        card.classList.remove('hidden');
        card.style.left = Math.min(mouseX + 15, window.innerWidth - 200) + 'px';
        card.style.top = Math.min(mouseY + 15, window.innerHeight - 150) + 'px';
    },
    
    hideHoloCard() {
        const card = document.getElementById('holo-card');
        if (card) card.classList.add('hidden');
    },
    
    updateHoloCardWeather(weather) {
        if (!weather) return;
        
        const tempEl = document.getElementById('holo-temp');
        const condEl = document.getElementById('holo-condition');
        
        if (tempEl) tempEl.textContent = `${weather.temp}°C`;
        if (condEl) condEl.textContent = weather.description || '--';
    },
    
    startTime() {
        const update = () => {
            if (this.elements.timeDisplay) {
                this.elements.timeDisplay.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
            }
        };
        update();
        setInterval(update, 1000);
    },
    
    showError(message) {
        const toast = document.getElementById('error-toast');
        const msgEl = document.getElementById('error-message');
        
        if (toast && msgEl) {
            msgEl.textContent = message;
            toast.classList.remove('hidden');
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TerminalUI;
}
