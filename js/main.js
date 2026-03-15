/**
 * Main Entry Point
 * Ruben Marcus 风格天气终端
 */

// 时间问候语
function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 9) return "早上好";
    if (hour >= 9 && hour < 11) return "上午好";
    if (hour >= 11 && hour < 13) return "中午好";
    if (hour >= 13 && hour < 18) return "下午好";
    if (hour >= 18 && hour < 21) return "晚上好";
    return "晚安";
}

// 初始化欢迎界面
document.addEventListener('DOMContentLoaded', async function() {
    initWelcomeScreen();
    initWelcomeMap();
});

// 初始化欢迎界面 ASCII 地图
function initWelcomeMap() {
    const welcomeAsciiMap = document.getElementById('welcome-ascii-map');
    if (!welcomeAsciiMap) return;
    
    welcomeAsciiMap.textContent = getASCIIWorldMap();
}

// ASCII 世界地图
function getASCIIWorldMap() {
    return `
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║      ▓▓▓▓▓     ▓▓▓▓▓▓▓     ▓▓▓▓▓▓▓▓▓     ▓▓▓▓▓▓          ║
    ║     ▓░░░░░░▓  ▓░░░░░░░░▓  ▓░░░░░░░░░░▓  ▓░░░░░░░▓         ║
    ║    ▓░░░░░░░░▓▓░░░░░░░░░░▓▓░░░░░░░░░░░░▓▓░░░░░░░░▓        ║
    ║    ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓        ║
    ║     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          ║
    ║                                                           ║
    ║  ───────────────────────────────────────────────────────  ║
    ║                                                           ║
    ║   ★ BEIJING    ★ TOKYO     ★ SYDNEY    ★ DUBAI           ║
    ║   ★ NEW YORK   ★ LONDON    ★ PARIS     ★ MOSCOW          ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    `;
}

// 欢迎界面初始化
function initWelcomeScreen() {
    document.addEventListener('keydown', (e) => {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (e.key === 'Enter' && welcomeScreen && !welcomeScreen.classList.contains('hidden')) {
            window.handleStartClick();
        }
    });
}

// ──────────────────────────────────────────────
//  代码雨过渡动画（加载界面）
//  参考风格：统一主题色、Consolas字体、全列同时从顶落下
//  每列落到底后不重置，所有列到底立即触发 onDone
// ──────────────────────────────────────────────


function runLoadingRain(canvas, onDone) {
    const ctx = canvas.getContext('2d');

    const W = canvas.width  = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    // 动态读代码雨字符色（每帧读取，独立于顶部文字色）
    const getAccent = () => {
        const s = getComputedStyle(document.documentElement);
        return s.getPropertyValue('--code-rain-color').trim() || '#00FF00';
    };

    // 读主题背景实色（用于第一帧初始化，保证 canvas 底色正确）
    const getBgSolid = () => {
        const s = getComputedStyle(document.documentElement);
        return s.getPropertyValue('--bg-primary').trim() || '#000000';
    };

    // 读拖影半透明色（每帧叠加，形成字符消退拖尾，颜色跟主题背景走）
    const getRainBg = () => {
        const s   = getComputedStyle(document.documentElement);
        const raw = s.getPropertyValue('--code-rain-bg').trim();
        return raw || 'rgba(0,0,0,0.05)';
    };

    // 第一帧：用不透明背景色填满 canvas，确保底色正确
    ctx.fillStyle = getBgSolid();
    ctx.fillRect(0, 0, W, H);

    // 字符集：仅使用开发者名 jingyuguantou 的字母
    const CHARS = 'jingyuguantou';
    const FS   = 14;                        // 字体大小，与参考一致
    const COLS = Math.floor(W / FS);

    // 全列从第 1 行同时起落（参考：drops.fill(1)）
    // 加一点微小的随机初始偏移，避免所有列像素级完全同步——视觉更自然
    const drops = Array.from({length: COLS}, () => 1 + (Math.random() * 4 | 0));

    // 记录每列是否已落到底
    const finished = new Array(COLS).fill(false);
    let finishedCount = 0;
    let done = false;
    let rafId;

    // 用 setInterval 模拟参考的 35ms 帧率
    const timer = setInterval(() => {
        if (done) return;

        const accent = getAccent();

        // 叠极淡拖影（颜色跟主题背景，形成字符消退感）
        ctx.fillStyle = getRainBg();
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur  = 6;           // 发光效果，与主题色一致
        ctx.font = `${FS}px Consolas, 'Courier New', monospace`;

        for (let i = 0; i < COLS; i++) {
            if (finished[i]) continue;

            // 字符集限定为 jingyuguantou，随机取字形成乱码错位感
            const text = CHARS[Math.random() * CHARS.length | 0];
            ctx.fillText(text, i * FS, drops[i] * FS);

            // 到底后标记完成，不重置
            if (drops[i] * FS > H) {
                finished[i] = true;
                finishedCount++;
                // 所有列都落到底 → 触发淡出
                if (finishedCount >= COLS && !done) {
                    done = true;
                    ctx.shadowBlur = 0; // 清除发光状态
                    clearInterval(timer);
                    onDone();
                }
                continue;
            }

            drops[i]++;
        }

        rafId = null; // setInterval 模式，不用 raf
    }, 35);

    // 保底超时（屏幕超高时最慢约 4s，这里给 5s）
    const guard = setTimeout(() => {
        if (!done) { done = true; clearInterval(timer); onDone(); }
    }, 5000);

    // 返回清理函数（供外部强制中止）
    return () => { clearInterval(timer); clearTimeout(guard); };
}

// 全局函数：开始按钮点击
window.handleStartClick = async function() {
    const welcomeScreen  = document.getElementById('welcome-screen');
    const startBtn       = document.getElementById('start-btn');
    const loadingOverlay = document.getElementById('loading');
    const rainCanvas     = document.getElementById('loading-rain-canvas');

    // 按钮微弹
    if (startBtn) {
        startBtn.style.transform = 'scale(0.95)';
        setTimeout(() => { startBtn.style.transform = 'scale(1)'; }, 100);
    }

    // 隐藏欢迎界面
    if (welcomeScreen) welcomeScreen.classList.add('hidden');

    // ⚡ 提前初始化主题（让 --bg-primary 等变量在加载页显示前就生效，避免背景变灰）
    const savedTheme = localStorage.getItem('weather-theme');
    if (savedTheme === 'aurora') {
        document.documentElement.setAttribute('data-theme', 'aurora');
    } else if (savedTheme === 'void') {
        document.documentElement.setAttribute('data-theme', 'void');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    // 显示加载界面（代码雨）
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');

    // ── 并行：代码雨动画 + 应用初始化（含默认定位）──────────
    const appInitPromise = (async () => {
        await new Promise(r => setTimeout(r, 80)); // 让 canvas 先渲染一帧
        await initMainApp();

        // iOS/Android 权限解锁
        if (window.speechSynthesis) {
            try { window.speechSynthesis.speak(new SpeechSynthesisUtterance('')); }
            catch (_) { /* 忽略 */ }
        }
        // 默认自动请求地理位置
        await locateAndReportWeather();
    })();

    // 代码雨落满后 resolve
    const rainDonePromise = new Promise(resolve => {
        if (!rainCanvas) { resolve(); return; }
        runLoadingRain(rainCanvas, resolve);
    });

    // 两者都完成后再淡出（代码雨落满优先，应用如果更慢则稍等）
    await Promise.all([rainDonePromise, appInitPromise]);

    // 淡出加载界面，无停顿直接进入内容页
    if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            loadingOverlay.classList.remove('fade-out');
            // 加载层完全隐藏后才加 app-ready，FAB 此时才出现（地球页）
            document.body.classList.add('app-ready');
        }, 550);
    } else {
        document.body.classList.add('app-ready');
    }
};

// 主应用初始化
async function initMainApp() {
    console.log('Initializing main app...');
    
    // 显示主应用
    const mainApp = document.getElementById('main-app');
    if (mainApp) {
        mainApp.classList.remove('hidden');
    }
    
    // 初始化 ASCII 地球
    if (typeof Earth3D !== 'undefined') {
        Earth3D.init();
        
        // 设置城市点击回调
        Earth3D.onCityClick = async function(city) {
            if (typeof Earth3D.focusOnCity === 'function') {
                Earth3D.focusOnCity(city);
            }
            await loadCityWeather(city);
        };
        
        // 设置城市悬停回调
        Earth3D.onCityHover = function(city, mouseX, mouseY) {
            if (typeof TerminalUI !== 'undefined') {
                if (city) {
                    TerminalUI.showHoloCard(city, mouseX, mouseY);
                    // 异步加载天气数据
                    loadCityWeatherForCard(city);
                } else {
                    TerminalUI.hideHoloCard();
                }
            }
        };
    }
    
    // app-ready 由 handleStartClick 在加载层完全隐藏后统一添加，此处不加
    
    // 初始化终端 UI
    if (typeof TerminalUI !== 'undefined') {
        TerminalUI.init();
    }
}

// 定位用户位置并播报天气
async function locateAndReportWeather() {
    if (typeof TerminalUI !== 'undefined') {
        TerminalUI.addOutput('> INITIALIZING GPS MODULE...', 'system');
    }

    try {
        const position = await getUserLocation();
        const { latitude, longitude, accuracy } = position.coords;

        // 精度评级
        const accM  = accuracy || 99999;
        const accKm = (accM / 1000).toFixed(1);
        let accLabel = '';
        if      (accM <= 50)    accLabel = '★★★ 高精度(GPS)';
        else if (accM <= 500)   accLabel = '★★☆ 较高精度(Wi-Fi)';
        else if (accM <= 5000)  accLabel = '★☆☆ 中精度(基站)';
        else                    accLabel = '☆☆☆ 低精度(IP定位)';

        if (typeof TerminalUI !== 'undefined') {
            TerminalUI.addOutput(`> LOCATION FIXED: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}° ±${accKm}km  [${accLabel}]`, 'success');
            if (accM > 5000) {
                TerminalUI.addOutput('> WARN: 精度不足，建议在手机/带GPS的设备上使用', 'error');
            }
        }

        // 查找最近城市
        const nearestCity = findNearestCity(latitude, longitude);
        const distKm = nearestCity
            ? getDistance(latitude, longitude, nearestCity.la, nearestCity.lo).toFixed(1)
            : null;

        // 构造"精确位置"虚拟城市对象（用真实坐标查天气，精度更高）
        const gpsCity = {
            n:    nearestCity ? nearestCity.n    : '当前位置',
            ne:   nearestCity ? nearestCity.ne   : 'Current Location',
            c:    nearestCity ? nearestCity.c    : 'CN',
            la:   latitude,
            lo:   longitude,
            lang: nearestCity ? (nearestCity.lang || 'zh-CN') : 'zh-CN',
            tier: nearestCity ? nearestCity.tier : 1,
            _gpsCity: nearestCity   // 保留原始城市对象供高亮用
        };

        if (nearestCity && typeof TerminalUI !== 'undefined') {
            TerminalUI.addOutput(`> NEAREST CITY: ${nearestCity.n} (${distKm}km away)`, 'system');
        }

        // 地球仪旋转聚焦到该城市
        if (typeof Earth3D !== 'undefined' && Earth3D.focusOnCity) {
            Earth3D.focusOnCity(nearestCity || gpsCity);
        }

        // 加载天气（用真实GPS坐标，精度≈5km）
        await loadCityWeather(gpsCity, { speakDelay: 1000 });

    } catch (error) {
        console.log('定位失败:', error.message);

        const errMsg = {
            1: '位置权限被拒绝',
            2: '无法获取位置信号',
            3: '定位超时'
        }[error.code] || error.message;

        if (typeof TerminalUI !== 'undefined') {
            TerminalUI.addOutput(`> GPS ERROR: ${errMsg} — 使用默认城市`, 'error');
        }

        // 定位失败，使用北京
        const defaultCity = { n: "北京", ne: "Beijing", c: "CN", la: 39.9042, lo: 116.4074, lang: "zh-CN" };

        if (typeof Earth3D !== 'undefined' && Earth3D.focusOnCity) {
            Earth3D.focusOnCity(defaultCity);
        }

        await loadCityWeather(defaultCity, { speakDelay: 1000 });
    }
}

// ─────────────────────────────────────────────
//  欢迎页代码雨
// ─────────────────────────────────────────────
const WelcomeRain = (() => {
    const FONT_SIZE   = 13;   // px，字符格子尺寸（中文字符适配）
    const INTERVAL_MS = 35;   // 帧间隔（ms），与参考文件一致

    // 两套字符集
    const CHARS_HACKER = '0123456789天地风云雨雪雷电山海水火气温湿压速光波数据流码网系统终端字节信息密码科技未来宇宙星空';
    const CHARS_AURORA  = '0123456789ABCDEF';
    const CHARS_VOID    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.?/~`';

    let canvas = null;
    let ctx    = null;
    let drops  = [];          // 每列当前下落行号
    let timerId = null;       // setInterval id
    let isRunning = false;

    /** 判断当前是否 AURORA 主题 */
    function isAurora() {
        return document.documentElement.getAttribute('data-theme') === 'aurora';
    }

    /** 判断当前是否 VOID 主题 */
    function isVoid() {
        return document.documentElement.getAttribute('data-theme') === 'void';
    }

    /** 根据窗口宽度重建列数组 */
    function initDrops() {
        if (!canvas) return;
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        const cols = Math.floor(canvas.width / FONT_SIZE);
        drops = Array.from({ length: cols }, () => Math.random() * (canvas.height / FONT_SIZE) | 0);
    }

    /** 单帧绘制 */
    function draw() {
        if (!canvas || !ctx) return;

        const aurora  = isAurora();
        const void_   = isVoid();
        const chars   = aurora ? CHARS_AURORA : void_ ? CHARS_VOID : CHARS_HACKER;
        const w = canvas.width, h = canvas.height;

        // 重置 filter（非 VOID 帧确保无残留）
        if (!void_) ctx.filter = 'none';

        // 拖影：HACKER 用纯黑，AURORA 用赛博蓝，VOID 用磷光暖黄烧屏底色（alpha 更大，余晖更深）
        ctx.fillStyle = aurora ? 'rgba(22, 93, 255, 0.05)'
                      : void_  ? 'rgba(10, 6, 0, 0.15)'   // 磷光余晖：暖黄叠淡，alpha 0.15 → 烧屏感
                      : 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, w, h);

        // 字符颜色：按主题分支
        ctx.fillStyle = aurora ? '#ffffff'
                      : void_  ? '#cc00ff'
                      : '#00FF00';
        ctx.font      = `${FONT_SIZE}px Consolas, monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

            // 到达底部后随机概率重置到顶
            if (drops[i] * FONT_SIZE > h && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        // ── VOID 专属：帧末噪点撒布 ──────────────────────────────
        if (void_) {
            // 随机撒 80~120 个单像素亮点，模拟 CRT 磷光颗粒噪点
            const noiseCount = 80 + Math.floor(Math.random() * 40);
            for (let n = 0; n < noiseCount; n++) {
                const nx = Math.random() * w;
                const ny = Math.random() * h;
                const alpha = 0.03 + Math.random() * 0.05; // 0.03 ~ 0.08
                ctx.fillStyle = `rgba(204, 0, 255, ${alpha.toFixed(3)})`;
                ctx.fillRect(nx | 0, ny | 0, 1, 1);
            }
            // 帧末滤镜：轻微增强对比度与亮度，强化磷光颗粒感
            ctx.filter = 'contrast(1.1) brightness(1.05)';
        }
    }

    /** 启动动画 */
    function start() {
        if (isRunning) return;
        canvas = document.getElementById('welcome-code-rain');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        initDrops();
        isRunning = true;
        timerId = setInterval(draw, INTERVAL_MS);
    }

    /** 停止并清理 */
    function stop() {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
        isRunning = false;
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // 监听窗口 resize 重建列
    window.addEventListener('resize', () => {
        if (isRunning) initDrops();
    });

    return { start, stop };
})();

// ─────────────────────────────────────────────
//  VOID 专属 CRT 扫描线模块
//  职责：在 #void-scanlines canvas 上每 2px 画一条 rgba(0,0,0,0.2) 横线
//  仅在 data-theme="void" 时激活，主题切换时自动重绘/清除
// ─────────────────────────────────────────────
const VoidCRT = (() => {
    let _canvas = null;
    let _ctx    = null;

    /** 静态绘制全屏扫描线 */
    function _draw() {
        if (!_canvas || !_ctx) return;
        _canvas.width  = window.innerWidth;
        _canvas.height = window.innerHeight;
        _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        // 每 2px 一条横线，模拟 CRT 电子束行间黑带
        for (let y = 0; y < _canvas.height; y += 2) {
            _ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
            _ctx.fillRect(0, y, _canvas.width, 1);
        }
    }

    /** 清除 canvas（非 VOID 主题时调用） */
    function _clear() {
        if (_canvas && _ctx) {
            _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        }
        if (_canvas) _canvas.style.display = 'none';
    }

    /** 激活：显示并绘制 */
    function _activate() {
        if (!_canvas) return;
        _canvas.style.display = 'block';
        _draw();
    }

    /** 初始化（DOMContentLoaded 后调用） */
    function init() {
        _canvas = document.getElementById('void-scanlines');
        if (!_canvas) return;
        _ctx = _canvas.getContext('2d');

        // 根据当前主题决定初始状态
        const isVoidNow = document.documentElement.getAttribute('data-theme') === 'void';
        if (isVoidNow) {
            _activate();
        } else {
            _canvas.style.display = 'none';
        }

        // 监听主题切换（ThemeToggle 修改 data-theme 属性）
        const observer = new MutationObserver(() => {
            const isVoid = document.documentElement.getAttribute('data-theme') === 'void';
            if (isVoid) {
                _activate();
            } else {
                _clear();
            }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        // 窗口 resize 时重绘
        window.addEventListener('resize', () => {
            const isVoid = document.documentElement.getAttribute('data-theme') === 'void';
            if (isVoid) _draw();
        });
    }

    return { init };
})();

// DOMContentLoaded 时启动欢迎页代码雨
document.addEventListener('DOMContentLoaded', () => {
    WelcomeRain.start();
    VoidCRT.init();
});

// 点击"初始化系统"后停止代码雨（节省性能）
const _origHandleStart = window.handleStartClick;
window.handleStartClick = async function () {
    WelcomeRain.stop();
    await _origHandleStart();
};

// 获取用户地理位置（高精度模式，精度约5km）
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('浏览器不支持地理定位'));
            return;
        }

        // 先用高精度定位（GPS），超时后降级到网络定位
        const tryHighAccuracy = () => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                (err) => {
                    // 高精度失败 → 降级到网络定位（更快但精度略低）
                    console.log('高精度定位失败，降级到网络定位', err.message);
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
                    );
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        };

        tryHighAccuracy();
    });
}

// 查找最近的城市
function findNearestCity(lat, lng) {
    const cities = typeof C !== 'undefined' ? C : [];
    
    if (cities.length === 0) return null;
    
    let nearest = null;
    let minDistance = Infinity;
    
    for (const city of cities) {
        const distance = getDistance(lat, lng, city.la, city.lo);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = city;
        }
    }
    
    return nearest;
}

// 计算两点距离（Haversine公式）
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// 为全息卡片加载天气
async function loadCityWeatherForCard(city) {
    try {
        if (typeof WeatherAPI !== 'undefined') {
            const weatherData = await WeatherAPI.getWeather(city);
            if (weatherData && weatherData.cod === 200) {
                const weather = WeatherAPI.formatWeather(weatherData);
                if (typeof TerminalUI !== 'undefined') {
                    TerminalUI.updateHoloCardWeather(weather);
                }
            }
        }
    } catch (e) {
        console.log('Weather load error for card:', e);
    }
}

// 加载城市天气
// options: { speakDelay: number }  speakDelay>0 时延迟N毫秒后播报，0或undefined立即播报
async function loadCityWeather(city, options = {}) {
    const speakDelay = options.speakDelay != null ? options.speakDelay : 0;

    // 用于播报的城市对象（如果是GPS虚拟城市，取原始城市名）
    const speakCity = city._gpsCity || city;

    try {
        if (typeof TerminalUI !== 'undefined') {
            TerminalUI.addOutput(`> QUERYING WEATHER: ${city.n || city.name}`, 'system');
        }

        let weather = null;

        if (typeof WeatherAPI !== 'undefined') {
            try {
                const weatherData = await WeatherAPI.getWeather(city);
                if (weatherData && (weatherData.cod === 200 || weatherData.cod === '200')) {
                    weather = WeatherAPI.formatWeather(weatherData);
                }
            } catch (e) {
                console.log('Weather API error:', e);
            }
        }

        if (weather) {
            // 显示天气数据到终端面板
            if (typeof TerminalUI !== 'undefined') {
                TerminalUI.displayWeather(speakCity, weather, { skipSpeak: true });
            }
            // 更新全息卡片
            if (typeof TerminalUI !== 'undefined') {
                TerminalUI.updateHoloCardWeather(weather);
            }
            // 延迟播报
            setTimeout(() => {
                if (typeof TerminalUI !== 'undefined') {
                    TerminalUI.speakWeather(speakCity, weather);
                }
            }, speakDelay);

        } else {
            // 无API数据，使用模拟数据（不播报）
            weather = {
                temp: Math.round(15 + Math.random() * 15),
                humidity: Math.round(40 + Math.random() * 40),
                wind_speed: parseFloat((1 + Math.random() * 5).toFixed(1)),
                description: '天气数据获取中',
                main: 'clear'
            };
            if (typeof TerminalUI !== 'undefined') {
                TerminalUI.displayWeather(speakCity, weather, { skipSpeak: true });
            }
        }

    } catch (e) {
        console.error('Error loading weather:', e);
        if (typeof TerminalUI !== 'undefined') {
            TerminalUI.addOutput(`> ERROR: ${e.message}`, 'error');
        }
    }
}

// 全局函数
window.selectCity = async function(city) {
    if (typeof Earth3D !== 'undefined' && Earth3D.focusOnCity) {
        Earth3D.focusOnCity(city);
    }
    await loadCityWeather(city);
};

// ============================================
// 主题切换系统
// ============================================
const ThemeManager = {
    currentTheme: 'hacker', // 默认黑客模式
    
    themes: {
        hacker: {
            name: 'HACKER',
            label: '黑客模式',
            description: '绿黑配色'
        },
        aurora: {
            name: 'AURORA',
            label: '极光模式',
            description: '蓝白配色'
        },
        void: {
            name: 'VOID',
            label: '虚空模式',
            description: '紫黑配色'
        }
    },
    
    init() {
        // 从 localStorage 读取主题偏好
        const saved = localStorage.getItem('weather-theme');
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        }
        
        // 应用主题
        this.applyTheme(this.currentTheme);
        
        // 绑定切换按钮
        this.bindToggleButton();
    },
    
    applyTheme(themeName) {
        const root = document.documentElement;
        
        if (themeName === 'aurora') {
            root.setAttribute('data-theme', 'aurora');
        } else if (themeName === 'void') {
            root.setAttribute('data-theme', 'void');
        } else {
            root.removeAttribute('data-theme');
        }
        
        this.currentTheme = themeName;
        localStorage.setItem('weather-theme', themeName);
        
        // 更新按钮文字
        this.updateToggleButton();
        
        // 通知地球更新颜色
        if (typeof ASCIIEarth !== 'undefined' && ASCIIEarth.updateTheme) {
            ASCIIEarth.updateTheme(themeName);
        }
        
        console.log(`Theme changed to: ${themeName}`);
    },
    
    toggle() {
        const order = ['hacker', 'aurora', 'void'];
        const idx = order.indexOf(this.currentTheme);
        const newTheme = order[(idx + 1) % order.length];
        this.applyTheme(newTheme);
    },
    
    bindToggleButton() {
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', () => this.toggle());
        }
    },
    
    updateToggleButton() {
        const text = document.querySelector('.theme-toggle-text');
        if (text) {
            const theme = this.themes[this.currentTheme];
            text.textContent = theme.name;
        }
    }
};

// 初始化主题
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});

// 导出主题管理器
window.ThemeManager = ThemeManager;
