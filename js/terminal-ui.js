/**
 * Terminal UI Module - 右侧单面板版
 * v3.0 — 关怀升级 + TTS 修复（2077 Edition）
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
    _ttsTimer: null,

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

        this.elements.input.addEventListener('input', () => {
            if (_autoTimer) clearTimeout(_autoTimer);
            const val = this.elements.input.value.trim();
            if (!val) return;
            _autoTimer = setTimeout(() => {
                _autoTimer = null;
                submitInput();
            }, 800);
        });

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

        this.elements.input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (_autoTimer) { clearTimeout(_autoTimer); _autoTimer = null; }
                submitInput();
            }
        });

        this.elements.input.addEventListener('compositionend', () => {
            if (_autoTimer) clearTimeout(_autoTimer);
            const val = this.elements.input.value.trim();
            if (!val) return;
            _autoTimer = setTimeout(() => {
                _autoTimer = null;
                submitInput();
            }, 800);
        });

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
    
    getCities() {
        if (typeof C !== 'undefined' && Array.isArray(C)) {
            return C;
        }
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
            this.addOutput(`Locking on ${city.ne}...`, 'system');
            
            if (typeof ASCIIEarth !== 'undefined') {
                const found = ASCIIEarth.searchAndFocusCity(trimmed);
                if (found && typeof window.selectCity === 'function') {
                    window.selectCity(found);
                }
            }

            if (typeof window.MobilePanel !== 'undefined') {
                setTimeout(() => window.MobilePanel.close(), 300);
            }
        } else {
            this.addOutput(`Node not found: ${trimmed}`, 'error');
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

    // ══════════════════════════════════════════════════════
    //  getWeatherAdvice — 关怀数据纯函数（单一数据源）
    // ══════════════════════════════════════════════════════
    getWeatherAdvice(weather) {
        if (!weather) return { outfit: '', tips: [], level: 'comfort', voiceHint: '', voiceHintEn: '' };

        const temp      = weather.temp ?? 20;
        const feelsLike = weather.feels_like ?? temp;
        const main      = (weather.main || '').toLowerCase();
        const desc      = (weather.description || '').toLowerCase();
        const wind      = weather.wind_speed ?? 0;
        const hum       = weather.humidity ?? 50;

        // ── 1. 穿衣建议（5级温度分档）──
        let outfit = '';
        let level  = 'comfort';
        if (temp >= 30) {
            outfit = 'T恤短袖，轻薄透气';
            level  = 'hot';
        } else if (temp >= 20) {
            outfit = '衬衫或薄外套，舒适层叠';
            level  = 'warm';
        } else if (temp >= 10) {
            outfit = '卫衣或轻薄毛衣，外搭外套';
            level  = 'cool';
        } else if (temp >= 0) {
            outfit = '厚毛衣加羽绒背心或外套';
            level  = 'cold';
        } else {
            outfit = '羽绒服、围巾手套帽子全套';
            level  = 'freeze';
        }

        // ── 2. 生活提示（优先级链，最多 2 条）──
        const tips = [];

        const hasThunder = main.includes('thunder') || desc.includes('雷');
        const hasRain    = main.includes('rain')    || desc.includes('雨');
        const hasSnow    = main.includes('snow')    || desc.includes('雪');
        const hasFog     = main.includes('fog')     || main.includes('mist') || desc.includes('雾');
        const hasDust    = main.includes('dust')    || main.includes('haze') || desc.includes('霾') || desc.includes('沙尘');

        if (hasThunder)                  tips.push('雷暴预警，建议减少户外活动');
        else if (hasRain)                tips.push('有降雨，出门备好雨具');
        if (hasSnow)                     tips.push('路面积雪，出行注意防滑');
        if (hasFog || hasDust)           tips.push('能见度较低，外出建议佩戴口罩');
        if (temp >= 35 && tips.length < 2) tips.push('高温预警，注意防暑补水');
        if (temp >= 28 && temp < 35 && tips.length < 2) tips.push('紫外线较强，建议涂抹防晒');
        if (wind >= 10 && tips.length < 2)  tips.push('风力较大，注意固定随身物品');
        if (hum >= 85 && temp >= 20 && tips.length < 2) tips.push('湿度较高，注意通风透气');
        if (temp <= -5 && tips.length < 2)  tips.push('极寒天气，做好全面保暖');

        if (tips.length === 0) {
            if (temp >= 18 && temp <= 26 && !hasRain) {
                tips.push('天气宜人，适合户外活动');
            } else {
                tips.push('注意关注天气变化');
            }
        }

        const limitedTips = tips.slice(0, 2);

        // ── 3. 语音专用关怀短句 ──
        // 优先级：雷暴 > 雨 > 雪 > 霾 > 雾 > 温度分档
        // 雪和零下可叠加：先处理降水，再在句内补充温度信息
        let voiceHint   = '';
        let voiceHintEn = '';

        if (hasThunder) {
            // 雷暴：严肃，不加语气词
            voiceHint   = '今天有雷暴，请尽量留在室内，注意安全。';
            voiceHintEn = 'Thunderstorm warning today — please stay indoors and stay safe.';
        } else if (hasSnow && temp <= 0) {
            // 下雪 + 零下：路滑 + 保暖都要提
            voiceHint   = '今天有雪，气温零下，路面湿滑，出门全副武装，走路放慢些。';
            voiceHintEn = 'Snow and below freezing today — dress warmly and watch your step on icy roads.';
        } else if (hasSnow) {
            // 下雪但气温在零度以上（湿雪）
            voiceHint   = '今天有降雪，路面湿滑，出行放慢节奏，注意防滑。';
            voiceHintEn = 'Snowy today — roads may be slippery, take it slow and stay steady.';
        } else if (hasRain) {
            // 普通降雨
            voiceHint   = '今天有雨，出门记得带把伞，别淋湿了。';
            voiceHintEn = "Rainy day ahead — grab an umbrella before you head out.";
        } else if (hasDust) {
            // 霾/沙尘：污染物，强调口罩
            voiceHint   = '今天空气质量较差，外出记得戴上口罩，减少长时间户外活动。';
            voiceHintEn = 'Poor air quality today — wear a mask outdoors and limit prolonged exposure.';
        } else if (hasFog) {
            // 雾：能见度问题，强调驾车/行路
            voiceHint   = '今天有雾，能见度低，驾车出行保持车距，步行注意观察路况。';
            voiceHintEn = 'Foggy today — visibility is low, drive carefully and keep a safe distance.';
        } else if (temp >= 38) {
            // 极端高温
            voiceHint   = '今天高温预警，能不出门就不出门，出去一定做好防暑。';
            voiceHintEn = 'Extreme heat advisory today — avoid going out if possible, and stay well hydrated.';
        } else if (temp >= 35) {
            voiceHint   = '天气很热，多喝水，注意别中暑了。';
            voiceHintEn = "It's really hot out there — stay hydrated and avoid direct sunlight.";
        } else if (temp <= -10) {
            // 极寒
            voiceHint   = '今天极寒，出门羽绒服围巾手套帽子全部带上，做好全面保暖。';
            voiceHintEn = 'Extremely cold today — full winter gear is a must, cover every inch.';
        } else if (temp <= 0) {
            voiceHint   = '气温零下，出门羽绒服围巾手套都带好，别冻着。';
            voiceHintEn = 'Below freezing today — bundle up properly before heading out.';
        } else if (temp <= 8) {
            voiceHint   = '天有点凉，多穿一件出门，暖和一点更舒服。';
            voiceHintEn = "Chilly today — grab an extra layer before you go, you'll be glad you did.";
        } else if (temp >= 28) {
            voiceHint   = '天气挺热的，出门涂好防晒，多补补水。';
            voiceHintEn = 'Warm one today — apply sunscreen and keep your water bottle handy.';
        } else if (temp >= 18) {
            voiceHint   = '天气不错，适合出去走走，好好享受一下。';
            voiceHintEn = 'Nice weather today — perfect for a walk outside, enjoy it.';
        } else {
            // 10~18°C，早晚温差大
            voiceHint   = '早晚温差比较大，出门备件外套，随时加减。';
            voiceHintEn = 'Temperature varies throughout the day — keep a jacket handy just in case.';
        }

        return { outfit, tips: limitedTips, level, voiceHint, voiceHintEn };
    },

    // ══════════════════════════════════════════════════════
    //  _pickVoice — 智能选音
    //  优先级：Premium/Enhanced > Female > localService > 任意同语言
    // ══════════════════════════════════════════════════════
    _pickVoice(isZh) {
        const voices = (this._voices && this._voices.length)
            ? this._voices
            : (this.speechSynthesis ? this.speechSynthesis.getVoices() : []);
        if (!voices.length) return null;

        const langPrefix = isZh ? 'zh' : 'en';
        const sameLang = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
        if (!sameLang.length) return null;

        // 高品质关键词（各平台 Premium/Enhanced/Neural/Online 等）
        const premiumKeywords = ['premium', 'enhanced', 'neural', 'online', 'natural', 'siri'];
        // 女声关键词（通常更清晰）
        const femaleKeywords  = isZh
            ? ['xiaoxiao', 'xiaoyi', 'yunxi', 'xiao', 'ting', 'mei', 'li', 'fang', '丽', '梅', '婷', '晓']
            : ['zira', 'aria', 'jenny', 'samantha', 'victoria', 'karen', 'moira', 'fiona', 'female', 'woman'];

        const score = (v) => {
            let s = 0;
            const name = v.name.toLowerCase();
            if (premiumKeywords.some(k => name.includes(k))) s += 10;
            if (femaleKeywords.some(k => name.includes(k)))  s += 5;
            if (v.localService)                               s += 3;
            // zh-CN 优先（不要 zh-TW / zh-HK 粤语腔）
            if (isZh && v.lang === 'zh-CN') s += 2;
            return s;
        };

        sameLang.sort((a, b) => score(b) - score(a));
        return sameLang[0];
    },

    // ══════════════════════════════════════════════════════
    //  _speakSegments — 分句播报（解决粘连/吞字问题）
    //  把长文本切成短句，用 onend 回调依次播报
    //  每句之间加 pause（空白 utterance）制造自然停顿
    // ══════════════════════════════════════════════════════
    _speakSegments(segments, lang, voice) {
        if (!this.speechSynthesis || !segments.length) return;

        this.speechSynthesis.cancel();

        // 过滤空段
        const segs = segments.filter(s => s && s.trim());
        if (!segs.length) return;

        const isZh = lang.startsWith('zh');
        let index = 0;

        const speakNext = () => {
            if (index >= segs.length) return;
            const seg = segs[index++];

            const u = new SpeechSynthesisUtterance(seg);
            u.lang  = lang;
            // 中文稍慢（0.85）更清晰；英文正常（0.95）
            u.rate  = isZh ? 0.85 : 0.95;
            u.pitch = isZh ? 1.0  : 1.0;
            u.volume = 1.0;
            if (voice) u.voice = voice;

            u.onend = () => {
                if (index < segs.length) {
                    // 短暂间隔（50ms）让 AudioSession 重新调度，避免粘连
                    setTimeout(speakNext, 80);
                }
            };
            u.onerror = (e) => {
                console.warn('[TTS] segment error:', e.error, seg);
                setTimeout(speakNext, 100);
            };

            this.speechSynthesis.speak(u);
        };

        // iOS Safari 需要先激活 AudioSession
        if (this.speechSynthesis.paused) {
            this.speechSynthesis.resume();
        }

        speakNext();
    },

    // ══════════════════════════════════════════════════════
    //  speakWeather — 升级版语音播报（v3.0）
    //  中文：口语化 + 时段问候 + 关怀结尾
    //  英文：科技播报腔 + 关怀结尾
    // ══════════════════════════════════════════════════════
    speakWeather(city, weather) {
        if (!this.speechSynthesis || !weather) return;

        const lang  = city.lang || 'zh-CN';
        const isZh  = lang.startsWith('zh');
        const voice = this._pickVoice(isZh);

        const advice = this.getWeatherAdvice(weather);

        // 时间段问候
        const hour = new Date().getHours();
        let greeting = '';
        if (isZh) {
            if      (hour >= 5  && hour < 9)  greeting = '早上好';
            else if (hour >= 9  && hour < 12) greeting = '上午好';
            else if (hour >= 12 && hour < 14) greeting = '中午好';
            else if (hour >= 14 && hour < 18) greeting = '下午好';
            else if (hour >= 18 && hour < 22) greeting = '晚上好';
            else                               greeting = '夜深了，注意休息';
        } else {
            if      (hour >= 5  && hour < 12) greeting = 'Good morning';
            else if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
            else                               greeting = 'Good evening';
        }

        // 体感差异
        const feelsLike = weather.feels_like ?? weather.temp;
        const diff = feelsLike - weather.temp;
        let feelsStr = '';
        if (isZh) {
            if      (diff <= -3) feelsStr = `，但体感更冷，约${Math.round(feelsLike)}摄氏度`;
            else if (diff >= 3)  feelsStr = `，体感偏热，约${Math.round(feelsLike)}摄氏度`;
        } else {
            if      (diff <= -3) feelsStr = `, but feels like ${Math.round(feelsLike)} degrees`;
            else if (diff >= 3)  feelsStr = `, feels warmer at ${Math.round(feelsLike)} degrees`;
        }

        const cityName = isZh ? (city.n || city.ne) : city.ne;
        const temp     = Math.round(weather.temp);
        const desc     = weather.description || (isZh ? '晴朗' : 'clear sky');

        let segments = [];

        if (isZh) {
            // 中文分句：格式 = 问候 → 城市今日气温 → 天气状况 → 湿度风速 → 关怀结尾
            const tempWord = temp < 0 ? `零下${Math.abs(temp)}摄氏度` : `${temp}摄氏度`;
            segments = [
                `${greeting}。`,
                `${cityName}今日气温${tempWord}${feelsStr}。`,
                `天气状况：${desc}。`,
                `湿度百分之${weather.humidity}，风速每秒${Math.round(weather.wind_speed)}米。`,
                `${advice.voiceHint}`
            ];
        } else {
            segments = [
                `${greeting}.`,
                `${cityName}, temperature ${temp} degrees Celsius${feelsStr}.`,
                `Conditions: ${desc}.`,
                `Humidity ${weather.humidity} percent, wind ${Math.round(weather.wind_speed)} meters per second.`,
                `${advice.voiceHintEn}`
            ];
        }

        // 清除之前的延迟播报
        if (this._ttsTimer) {
            clearTimeout(this._ttsTimer);
            this._ttsTimer = null;
        }

        this._speakSegments(segments, lang, voice);
    },

    // ══════════════════════════════════════════════════════
    //  displayWeather — 更新天气面板 + 关怀区
    // ══════════════════════════════════════════════════════
    displayWeather(city, weather, opts = {}) {
        if (!weather) {
            this.addOutput(`> ERR: No weather data for ${city.n || city.name}`, 'error');
            return;
        }

        // 终端输出
        this.addOutput(`── ${(city.ne || city.n).toUpperCase()} ──`, 'success');
        this.addOutput(`Temp: ${weather.temp}°C  |  Humidity: ${weather.humidity}%`, 'system');
        this.addOutput(`Wind: ${weather.wind_speed} m/s  |  ${weather.description || '--'}`, 'system');

        // 天气面板基础字段
        const weatherCity = this.elements.weatherDisplay?.querySelector('.weather-city');
        const weatherTemp = this.elements.weatherDisplay?.querySelector('.weather-temp');

        if (weatherCity) weatherCity.textContent = (city.ne || city.n).toUpperCase();
        if (weatherTemp) weatherTemp.textContent = `${weather.temp}°C`;
        if (this.elements.weatherHumidity) this.elements.weatherHumidity.textContent = `${weather.humidity}%`;
        if (this.elements.weatherWind)     this.elements.weatherWind.textContent     = `${weather.wind_speed} m/s`;
        if (this.elements.weatherDesc)     this.elements.weatherDesc.textContent     = weather.description || '--';

        // ── 关怀区更新 ──
        const advice = this.getWeatherAdvice(weather);
        const careSection = document.getElementById('weather-care-section');
        if (careSection) {
            careSection.classList.remove('hidden');
            careSection.classList.add('care-animate');
            setTimeout(() => careSection.classList.remove('care-animate'), 800);
        }

        const outfitEl = document.getElementById('weather-outfit-text');
        if (outfitEl) {
            outfitEl.textContent = advice.outfit;
            // 根据温度级别设置颜色
            outfitEl.className = 'weather-advice-text care-level-' + advice.level;
        }

        const tipsEl = document.getElementById('weather-tips-list');
        if (tipsEl) {
            tipsEl.innerHTML = '';
            advice.tips.forEach(tip => {
                const span = document.createElement('div');
                span.className = 'weather-tip-item';
                span.textContent = '> ' + tip;
                tipsEl.appendChild(span);
            });
        }

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
            setTimeout(() => { toast.classList.add('hidden'); }, 3000);
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TerminalUI;
}
