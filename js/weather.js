// Weather API Module
const WeatherAPI = {
    cache: new Map(),
    cacheDuration: 60000, // 1分钟缓存，确保实时获取最新数据
    
    async getWeather(city, forceRefresh = false) {
        const cacheKey = `weather_${city.ne}_${city.c}`;
        const cached = this.cache.get(cacheKey);
        
        // 强制刷新或缓存过期时重新获取
        if (!forceRefresh && cached && Date.now() - cached.time < this.cacheDuration) {
            console.log(`使用缓存天气数据: ${city.n}`);
            return cached.data;
        }
        
        // 优先使用la/lo，否则使用lat/lng
        const lat = city.la || city.lat;
        const lon = city.lo || city.lng;
        
        console.log(`实时获取天气: ${city.n} (lat=${lat}, lon=${lon})`);
        
        const url = `${CONFIG.weather.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.weather.apiKey}&units=${CONFIG.weather.units}&lang=zh_CN`;
        
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            this.cache.set(cacheKey, { time: Date.now(), data });
            return data;
        } catch (e) {
            console.error('Weather fetch error:', e);
            // 如果有缓存数据，即使过期也返回
            if (cached) return cached.data;
            return null;
        }
    },
    
    async getAirQuality(city, forceRefresh = false) {
        const cacheKey = `aqi_${city.ne}_${city.c}`;
        const cached = this.cache.get(cacheKey);
        
        // 强制刷新或缓存过期时重新获取
        if (!forceRefresh && cached && Date.now() - cached.time < this.cacheDuration) {
            return cached.data;
        }
        
        // 优先使用la/lo，否则使用lat/lng
        const lat = city.la || city.lat;
        const lon = city.lo || city.lng;
        
        const url = `${CONFIG.airQuality.baseUrl}/air_pollution?lat=${lat}&lon=${lon}&appid=${CONFIG.weather.apiKey}`;
        try {
            const res = await fetch(url);
            if (!res.ok) return null;
            const data = await res.json();
            this.cache.set(cacheKey, { time: Date.now(), data });
            return data;
        } catch { 
            if (cached) return cached.data;
            return null; 
        }
    },
    
    formatWeather(data) {
        if (!data) return null;
        return {
            temp: Math.round(data.main.temp),
            feels_like: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            wind_speed: data.wind.speed,
            wind_deg: data.wind.deg,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            main: data.weather[0].main.toLowerCase(),
            city: data.name,
            country: data.sys.country,
            dt: data.dt
        };
    },
    
    formatAQI(data) {
        if (!data || !data.list || !data.list[0]) return null;
        const aqi = data.list[0].main.aqi;
        const labels = ['','优','良','轻度','中度','重度','严重'];
        return { aqi, label: labels[aqi] || '未知' };
    }
};