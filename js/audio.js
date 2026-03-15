// Audio Controller Module
const AudioCtrl = {
    ctx: null,
    weatherGain: null,
    cityGain: null,
    weatherSrc: null,
    citySrc: null,
    isMuted: false,
    volume: 0.5,
    currentWeather: null,
    currentCity: null,
    speechDucking = false, // 语音播报时降低环境音
    
    init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.weatherGain = this.ctx.createGain();
        this.cityGain = this.ctx.createGain();
        this.weatherGain.connect(this.ctx.destination);
        this.cityGain.connect(this.ctx.destination);
        this.setVolume(this.volume);
    },
    
    resume() {
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    
    setVolume(v) {
        this.volume = v;
        this.updateGainValues();
    },
    
    updateGainValues() {
        let weatherVol = this.isMuted ? 0 : this.volume;
        let cityVol = this.isMuted ? 0 : this.volume * 0.3;
        
        // 语音播报时降低环境音（ducking）
        if (this.speechDucking) {
            weatherVol *= 0.2;
            cityVol *= 0.1;
        }
        
        if (this.weatherGain) this.weatherGain.gain.value = weatherVol;
        if (this.cityGain) this.cityGain.gain.value = cityVol;
    },
    
    // 语音播报开始时降低环境音
    startSpeechDucking() {
        this.speechDucking = true;
        this.updateGainValues();
    },
    
    // 语音播报结束后停止环境音
    endSpeechDucking() {
        this.speechDucking = false;
        // 停止所有环境音
        this.stopWeather();
        this.stopCity();
    },
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateGainValues();
        return this.isMuted;
    },
    
    // 使用Web Audio API生成白噪音
    playWhiteNoise(type = 'rain') {
        // 如果已经在播放同类型，不重新播放
        if (this.weatherSrc && this.currentWeather === type) return;
        
        this.stopWeather();
        if (!this.ctx) this.init();
        this.resume();
        
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        
        // 根据类型生成不同噪音
        for (let i = 0; i < bufferSize; i++) {
            let noise = Math.random() * 2 - 1;
            if (type === 'rain') {
                noise *= 0.5;
                if (Math.random() > 0.997) noise *= 3; // 雨滴声
            } else if (type === 'wind') {
                noise *= 0.3;
                noise *= Math.sin(i / 5000) * 0.5 + 0.5;
            } else if (type === 'storm') {
                noise *= 0.6;
                if (Math.random() > 0.998) noise *= 4;
            } else if (type === 'clear') {
                noise *= 0.1;
            } else {
                noise *= 0.2;
            }
            output[i] = noise;
        }
        
        this.weatherSrc = this.ctx.createBufferSource();
        this.weatherSrc.buffer = buffer;
        this.weatherSrc.loop = true;
        
        // 添加低通滤波使声音更自然
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = type === 'wind' ? 800 : 2000;
        
        this.weatherSrc.connect(filter);
        filter.connect(this.weatherGain);
        this.weatherSrc.start();
        this.currentWeather = type;
    },
    
    stopWeather() {
        if (this.weatherSrc) {
            try { this.weatherSrc.stop(); } catch {}
            this.weatherSrc = null;
        }
        this.currentWeather = null;
    },
    
    // 城市特色音效（简化版，用不同频率的噪音模拟）
    playCityAmbience(country) {
        // 如果已经在播放同国家，不重新播放
        if (this.citySrc && this.currentCity === country) return;
        
        this.stopCity();
        if (!this.ctx) this.init();
        this.resume();
        
        const bufferSize = 2 * this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        
        const freq = country === 'CN' ? 200 : country === 'JP' ? 300 : country === 'US' ? 250 : 150;
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.sin(i / (this.ctx.sampleRate / freq)) * 0.05 * Math.random();
        }
        
        this.citySrc = this.ctx.createBufferSource();
        this.citySrc.buffer = buffer;
        this.citySrc.loop = true;
        this.citySrc.connect(this.cityGain);
        this.citySrc.start();
        this.currentCity = country;
    },
    
    stopCity() {
        if (this.citySrc) {
            try { this.citySrc.stop(); } catch {}
            this.citySrc = null;
        }
        this.currentCity = null;
    },
    
    updateForWeather(weatherMain, cityCountry) {
        const soundMap = {
            'clear': 'clear', 'clouds': 'clear', 'rain': 'rain',
            'drizzle': 'rain', 'thunderstorm': 'storm', 'snow': 'wind',
            'mist': 'wind', 'fog': 'wind', 'haze': 'wind'
        };
        const sound = soundMap[weatherMain] || 'clear';
        this.playWhiteNoise(sound);
        this.playCityAmbience(cityCountry);
    }
};