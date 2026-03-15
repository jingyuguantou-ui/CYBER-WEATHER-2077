/**
 * 配置文件 - 全球城市实时天气
 * Configuration for Global City Weather App
 */

// OpenWeatherMap API 配置
// 请替换为你自己的API Key，免费版足够个人使用
// Get your free API key at: https://openweathermap.org/api
const CONFIG = {
    // API 配置
    weather: {
        // 默认使用 Demo Key，仅供测试
        // 生产环境请替换为你自己的 key
        apiKey: '4d8fb5b93d4af21d66a2948710284366',
        baseUrl: 'https://api.openweathermap.org/data/2.5',
        units: 'metric', // 摄氏度
        lang: 'zh_cn' // 中文
    },
    
    // 空气质量 API
    airQuality: {
        baseUrl: 'https://api.openweathermap.org/data/2.5'
    },
    
    // 缓存配置
    cache: {
        enabled: true,
        duration: 5 * 60 * 1000 // 5分钟缓存
    },
    
    // 音频配置
    audio: {
        defaultVolume: 0.5,
        fadeInDuration: 2, // 秒
        fadeOutDuration: 1 // 秒
    },
    
    // 地球配置
    earth: {
        autoRotate: true,
        rotateSpeed: 0.2,
        initialLat: 35,
        initialLng: 105,
        initialZoom: 2.5,
        minZoom: 1.5,
        maxZoom: 5
    },
    
    // 昼夜配置
    dayNight: {
        dayStart: 6, // 早上6点
        dayEnd: 18    // 下午6点
    },
    
    // 城市配置
    cities: {
        // 默认显示的城市列表
        defaultCities: [
            { name: '北京', name_en: 'Beijing', country: 'CN', lat: 39.9042, lng: 116.4074 },
            { name: '上海', name_en: 'Shanghai', country: 'CN', lat: 31.2304, lng: 121.4737 },
            { name: '东京', name_en: 'Tokyo', country: 'JP', lat: 35.6762, lng: 139.6503 },
            { name: '纽约', name_en: 'New York', country: 'US', lat: 40.7128, lng: -74.0060 },
            { name: '伦敦', name_en: 'London', country: 'GB', lat: 51.5074, lng: -0.1278 },
            { name: '巴黎', name_en: 'Paris', country: 'FR', lat: 48.8566, lng: 2.3522 },
            { name: '悉尼', name_en: 'Sydney', country: 'AU', lat: -33.8688, lng: 151.2093 },
            { name: '迪拜', name_en: 'Dubai', country: 'AE', lat: 25.2048, lng: 55.2708 },
            { name: '新加坡', name_en: 'Singapore', country: 'SG', lat: 1.3521, lng: 103.8198 },
            { name: '首尔', name_en: 'Seoul', country: 'KR', lat: 37.5665, lng: 126.9780 },
            { name: '莫斯科', name_en: 'Moscow', country: 'RU', lat: 55.7558, lng: 37.6173 },
            { name: '洛杉矶', name_en: 'Los Angeles', country: 'US', lat: 34.0522, lng: -118.2437 },
            { name: '香港', name_en: 'Hong Kong', country: 'HK', lat: 22.3193, lng: 114.1694 },
            { name: '台北', name_en: 'Taipei', country: 'TW', lat: 25.0330, lng: 121.5654 },
            { name: '曼谷', name_en: 'Bangkok', country: 'TH', lat: 13.7563, lng: 100.5018 }
        ]
    },
    
    // 天气图标映射
    weatherIcons: {
        '01d': '☀️',
        '01n': '🌙',
        '02d': '⛅',
        '02n': '☁️',
        '03d': '☁️',
        '03n': '☁️',
        '04d': '☁️',
        '04n': '☁️',
        '09d': '🌧️',
        '09n': '🌧️',
        '10d': '🌦️',
        '10n': '🌧️',
        '11d': '⛈️',
        '11n': '⛈️',
        '13d': '❄️',
        '13n': '❄️',
        '50d': '🌫️',
        '50n': '🌫️'
    },
    
    // 天气音效映射
    weatherSounds: {
        'clear': 'clear',
        'clouds': 'cloudy',
        'rain': 'rain',
        'drizzle': 'rain',
        'thunderstorm': 'storm',
        'snow': 'snow',
        'mist': 'fog',
        'fog': 'fog',
        'haze': 'fog',
        'default': 'ambient'
    },
    
    // AQI 等级映射
    aqiLevels: {
        1: { label: '优', color: '#05d9e8' },
        2: { label: '良', color: '#39ff14' },
        3: { label: '轻度', color: '#f7f052' },
        4: { label: '中度', color: '#ff9f1c' },
        5: { label: '重度', color: '#ff073a' },
        6: { label: '严重', color: '#9d4edd' }
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
