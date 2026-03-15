/**
 * ASCII Earth Module - 完整七大洲版
 * 清晰大陆轮廓 + 赛博朋克风格
 */

const ASCIIEarth = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    
    // 背景层
    codeRainCanvas: null,
    codeRainCtx: null,
    
    // 地球纹理
    textureCanvas: null,
    textureCtx: null,
    textureData: null,
    textureWidth: 2000,
    textureHeight: 1000,
    
    // 球体参数
    radius: 0,
    baseRadius: 0,
    centerX: 0,
    centerY: 0,
    
    // 固定画布尺寸
    canvasSize: 500,

    // 缩放
    zoom: 1,
    minZoom: 0.5,
    maxZoom: 2.5,
    zoomSpeed: 0.08,
    
    // 旋转
    rotationX: 0.12,
    rotationY: 0,
    autoRotateSpeed: 0.0006,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    dragSpeedX: 0.002,
    dragSpeedY: 0.001,
    
    // ASCII 字符网格
    gridWidth: 300,
    gridHeight: 150,
    charWidth: 0,
    charHeight: 0,
    
    // 字符集（清晰版）
    asciiChars: ' .\'"`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
    
    // 城市数据
    cities: [],
    hoveredCity: null,
    selectedCity: null,  // 当前选中城市（搜索/点击）
    cityFlashTime: 0,    // 闪烁计时
    
    // 动画
    animationId: null,
    codeRainAnimationId: null,
    time: 0,
    
    // 回调
    onCityClick: null,
    onCityHover: null,
    
    // 性能
    lastFrameTime: 0,
    frameInterval: 1000 / 30,
    
    // 状态
    isLoaded: false,
    
    // 主题颜色
    theme: {
        accent: '#00ff88',      // 主色调
        accentDim: '#004422',   // 暗色调
        accentBright: '#66ffbb', // 亮色调
        cityPrimary: '#00ff88',  // 城市标记
        citySelected: '#ff9500', // 选中城市
        cityHover: '#00ffff',    // 悬停城市
        glow: 'rgba(0, 255, 136, 0.3)', // 光晕
        // 复古未来主义配色
        retroGlow: '#ffb347',    // 复古琥珀光
        retroBright: '#ffd700',  // 复古金黄
        retroDim: '#cc7000',     // 复古暗橙
        neonPink: '#ff6b9d',     // 霓虹粉
        terminalGreen: '#33ff33' // 终端绿
    },
    
    // 更新主题
    updateTheme(themeName) {
        if (themeName === 'aurora') {
            // 赛博蓝+白主题 - 复古未来主义
            this.theme = {
                accent: '#ffffff',           // 白色点阵
                accentDim: '#7aa3ff',        // 淡蓝色
                accentBright: '#ffffff',     // 亮白色
                cityPrimary: '#FFC107',      // 琥珀金色城市标记
                citySelected: '#FFC107',     // 琥珀金选中
                cityHover: '#FFD740',        // 亮金悬停
                glow: 'rgba(22, 93, 255, 0.6)',  // 赛博蓝光晕
                bgPrimary: '#165DFF',        // 赛博蓝背景（与参考代码一致）
                codeRainColor: '#00ff00',    // 霓虹绿代码雨
                // 复古未来主义配色
                retroGlow: '#165dff',
                retroBright: '#4d8aff',
                retroDim: '#0d44cc',
                neonPink: '#ff6b9d',
                terminalGreen: '#33ff33'
            };
        } else if (themeName === 'void') {
            // 深紫×品红 - 赛博朋克故障美学
            this.theme = {
                accent: '#cc00ff',           // 品紫主色
                accentDim: '#330044',        // 极暗紫
                accentBright: '#ee66ff',     // 亮紫
                cityPrimary: '#cc00ff',      // 品紫城市点
                citySelected: '#00ffff',     // 青色选中（RGB故障互补）
                cityHover: '#ff00cc',        // 品红悬停（故障偏移）
                glow: 'rgba(204, 0, 255, 0.5)',
                bgPrimary: '#080010',        // 极深紫黑
                codeRainColor: '#cc00ff',    // 品紫代码雨
                retroGlow: '#cc00ff',
                retroBright: '#ee66ff',
                retroDim: '#9900cc',
                neonPink: '#ff00cc',
                terminalGreen: '#00ffff'     // VOID里"青"替代绿
            };
        } else {
            // 黑客帝国主题 - 纯黑+黑客绿+洋红故障
            this.theme = {
                accent: '#00FF00',
                accentDim: '#003300',
                accentBright: '#66ff66',
                cityPrimary: '#00FF00',      // 纯正黑客绿城市点
                citySelected: '#FF00FF',     // 洋红选中（故障强调色）
                cityHover: '#00ffff',
                glow: 'rgba(0, 255, 0, 0.4)',
                bgPrimary: '#000000',        // 纯黑（参考代码一致）
                codeRainColor: '#00FF00',    // 纯正黑客绿代码雨
                // 黑客帝国配色
                retroGlow: '#00FF00',
                retroBright: '#66ff66',
                retroDim: '#00aa00',
                neonPink: '#FF00FF',         // 洋红
                terminalGreen: '#00FF00'
            };
        }
    },
    
    async init() {
        console.log('ASCII Earth initializing...');
        
        // 初始化背景层：代码雨
        this.codeRainCanvas = document.getElementById('code-rain-bg');
        if (this.codeRainCanvas) {
            this.codeRainCtx = this.codeRainCanvas.getContext('2d');
            this.codeRainCanvas.width = window.innerWidth;
            this.codeRainCanvas.height = window.innerHeight;
            this.initCodeRain();
            this.animateCodeRain();
        }
        
        // 初始化地球画布
        this.canvas = document.getElementById('earth-canvas');
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        await this.loadEarthTexture();
        this.resize();
        this.initCities();
        this.bindEvents();
        this.animate();
        this.isLoaded = true;
        
        console.log('ASCII Earth ready');
    },
    
    async loadEarthTexture() {
        this.textureCanvas = document.createElement('canvas');
        this.textureCanvas.width = this.textureWidth;
        this.textureCanvas.height = this.textureHeight;
        this.textureCtx = this.textureCanvas.getContext('2d');
        
        this.generateEarthTexture();
        
        this.textureData = this.textureCtx.getImageData(0, 0, this.textureWidth, this.textureHeight);
    },
    
    generateEarthTexture() {
        const ctx = this.textureCtx;
        const w = this.textureWidth;
        const h = this.textureHeight;
        
        // 深色海洋背景（实际不会被渲染，只用于判断）
        ctx.fillStyle = '#020a06';
        ctx.fillRect(0, 0, w, h);
        
        // ==================== 七大洲轮廓数据（真实地球仪位置）====================
        // 每个大洲使用不同的颜色ID用于区分
        
        // 大洲颜色定义 (R, G, B) - 每个大洲独特的颜色标识
        const continentColors = {
            northAmerica: { color: [80, 180, 120], name: '北美洲' },      // 绿色
            greenland: { color: [80, 180, 120], name: '格陵兰' },          // 同北美洲
            southAmerica: { color: [180, 140, 80], name: '南美洲' },       // 橙黄色
            europe: { color: [140, 160, 200], name: '欧洲' },              // 蓝紫色
            africa: { color: [200, 120, 100], name: '非洲' },              // 红褐色
            madagascar: { color: [200, 120, 100], name: '马达加斯加' },    // 同非洲
            asia: { color: [160, 200, 140], name: '亚洲' },                // 黄绿色
            japan: { color: [160, 200, 140], name: '日本' },               // 同亚洲
            india: { color: [160, 200, 140], name: '印度' },               // 同亚洲
            indonesia: { color: [160, 200, 140], name: '印尼' },           // 同亚洲
            australia: { color: [180, 100, 160], name: '澳大利亚' },       // 紫红色
            newZealand: { color: [180, 100, 160], name: '新西兰' },        // 同澳大利亚
            antarctica: { color: [120, 140, 160], name: '南极洲' }         // 灰蓝色
        };
        
        const continents = {
            // 北美洲
            northAmerica: [
                [50, 140], [100, 110], [180, 85], [280, 75], [380, 80],
                [450, 100], [480, 130], [500, 170], [490, 210],
                [470, 250], [440, 290], [400, 330], [360, 360],
                [340, 400], [360, 430], [400, 460], [440, 480],
                [480, 500], [520, 510], [560, 500], [590, 470],
                [600, 430], [590, 390], [560, 360], [520, 340],
                [500, 310], [480, 280], [470, 250], [480, 220],
                [500, 200], [520, 180], [530, 160], [520, 140],
                [490, 120], [450, 110], [400, 120], [350, 140],
                [300, 160], [250, 180], [200, 190], [150, 180],
                [100, 160], [50, 140]
            ],
            
            greenland: [
                [560, 70], [620, 55], [700, 60], [750, 90], [780, 130],
                [790, 180], [770, 220], [720, 250], [660, 260], [600, 240],
                [560, 210], [540, 170], [530, 120], [560, 70]
            ],
            
            // 南美洲
            southAmerica: [
                [520, 510], [560, 500], [600, 510], [640, 530], [680, 560],
                [720, 600], [740, 650], [750, 700], [740, 750], [720, 800],
                [690, 850], [650, 890], [600, 920], [550, 940], [500, 950],
                [480, 920], [460, 880], [450, 830], [460, 780], [480, 730],
                [490, 680], [500, 630], [510, 580], [520, 540], [520, 510]
            ],
            
            // 欧洲
            europe: [
                [860, 110], [920, 100], [1000, 95], [1080, 100], [1140, 120],
                [1180, 150], [1200, 190], [1190, 230], [1160, 260],
                [1120, 280], [1080, 300], [1040, 290], [1000, 270],
                [980, 250], [960, 280], [940, 310], [910, 330], [880, 340],
                [850, 320], [830, 290], [810, 260], [800, 230],
                [810, 200], [830, 170], [860, 140], [860, 110]
            ],
            
            // 非洲
            africa: [
                [880, 310], [920, 295], [980, 290], [1040, 295], [1100, 310],
                [1150, 340], [1180, 380], [1190, 430], [1180, 480],
                [1160, 530], [1140, 580], [1120, 630], [1100, 680],
                [1070, 720], [1020, 750], [960, 760], [900, 750],
                [850, 720], [820, 680], [800, 630], [790, 580],
                [800, 530], [820, 480], [850, 430], [870, 380],
                [880, 340], [880, 310]
            ],
            
            madagascar: [
                [1150, 620], [1180, 640], [1190, 690], [1180, 740],
                [1150, 780], [1120, 770], [1110, 730], [1120, 680],
                [1130, 640], [1150, 620]
            ],
            
            // 亚洲
            asia: [
                [1140, 100], [1220, 80], [1320, 70], [1440, 75],
                [1560, 85], [1680, 100], [1800, 130], [1900, 170],
                [1950, 220], [1960, 280], [1930, 330], [1880, 360],
                [1820, 380], [1760, 390], [1700, 400], [1640, 420],
                [1580, 450], [1540, 490], [1520, 530], [1540, 560],
                [1580, 580], [1620, 570], [1660, 550], [1700, 540],
                [1740, 550], [1760, 580], [1740, 620], [1700, 650],
                [1640, 660], [1580, 650], [1520, 630], [1460, 610],
                [1400, 600], [1360, 620], [1340, 660], [1360, 700],
                [1400, 720], [1440, 700], [1460, 660], [1440, 620],
                [1400, 590], [1360, 560], [1320, 520], [1300, 480],
                [1320, 440], [1360, 410], [1400, 390], [1440, 380],
                [1480, 370], [1520, 340], [1560, 300], [1580, 260],
                [1560, 230], [1520, 210], [1480, 200], [1440, 210],
                [1400, 230], [1360, 250], [1320, 260], [1280, 250],
                [1240, 230], [1200, 210], [1160, 190], [1140, 160],
                [1140, 100]
            ],
            
            japan: [
                [1760, 260], [1790, 270], [1810, 300], [1820, 340],
                [1810, 380], [1780, 400], [1740, 390], [1720, 360],
                [1720, 320], [1740, 290], [1760, 260]
            ],
            
            india: [
                [1340, 420], [1380, 400], [1420, 410], [1440, 450],
                [1420, 500], [1380, 540], [1340, 560], [1300, 540],
                [1280, 500], [1300, 460], [1320, 430], [1340, 420]
            ],
            
            indonesia: [
                [1520, 560], [1580, 550], [1640, 555], [1700, 570],
                [1760, 580], [1820, 575], [1880, 560], [1920, 580],
                [1900, 610], [1840, 620], [1780, 630], [1720, 625],
                [1660, 610], [1600, 590], [1540, 575], [1520, 560]
            ],
            
            // 澳大利亚
            australia: [
                [1520, 620], [1580, 600], [1660, 595], [1740, 610],
                [1800, 640], [1840, 690], [1860, 740], [1840, 790],
                [1780, 820], [1700, 830], [1620, 820], [1560, 790],
                [1520, 750], [1500, 700], [1500, 660], [1520, 620]
            ],
            
            newZealand: [
                [1900, 760], [1940, 750], [1970, 780], [1960, 830],
                [1920, 860], [1880, 840], [1870, 800], [1900, 760]
            ],
            
            // 南极洲
            antarctica: [
                [0, 900], [200, 890], [400, 880], [600, 875], [800, 880],
                [1000, 885], [1200, 880], [1400, 875], [1600, 880],
                [1800, 890], [2000, 900],
                [2000, 1000], [0, 1000], [0, 900]
            ]
        };
        
        // 为每个大洲绘制不同颜色的填充
        Object.entries(continents).forEach(([name, points]) => {
            const colorInfo = continentColors[name];
            const [r, g, b] = colorInfo.color;
            
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.closePath();
            ctx.fill();
        });
        
        // 绘制海岸线（霓虹绿）
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        
        Object.values(continents).forEach(points => {
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i][0], points[i][1]);
            }
            ctx.closePath();
            ctx.stroke();
        });
        
        // 存储大洲颜色信息供渲染使用
        this.continentColors = continentColors;
    },
    
    // 固定画布尺寸
    canvasSize: 500,

    resize() {
        // 固定 canvas 尺寸，通过 CSS scale 适配屏幕
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;
        this.width = this.canvasSize;
        this.height = this.canvasSize;

        // 地球半径充满 canvas，与 CSS border-radius:50% 光晕圆严格同心
        this.baseRadius = this.canvasSize * 0.5;
        this.radius = this.baseRadius * this.zoom;
        // 地球球心严格居中，与城市点投影坐标系绑定
        this.centerX = this.canvasSize / 2;
        this.centerY = this.canvasSize / 2;

        this.charWidth = this.width / this.gridWidth;
        this.charHeight = this.height / this.gridHeight;

        // 计算 scale 适配屏幕
        this.updateScale();
    },

    // 更新缩放适配屏幕：直接设置 CSS 尺寸，不用 transform，避免 origin 偏移
    updateScale() {
        const container = document.querySelector('.earth-fullscreen');
        if (!container) return;

        const containerWidth  = container.clientWidth;
        const containerHeight = container.clientHeight;

        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // 移动端：读取 CSS 注入的 safe-area-inset-bottom 值
            // （在 :root 上通过 CSS 变量暴露，见 style.css）
            const sabStr = getComputedStyle(document.documentElement)
                .getPropertyValue('--sab').trim();
            const safeAreaBottom = parseFloat(sabStr) || 0;

            // 可用高度 = 容器高度 - iPhone 底部安全区域
            const availH = containerHeight - safeAreaBottom;
            const availW = containerWidth;

            // 移动端显示比例 0.85（留出呼吸空间，防止地球贴边）
            const displaySize = Math.min(availW, availH) * 0.85;
            this.canvas.style.transform = '';
            this.canvas.style.width  = displaySize + 'px';
            this.canvas.style.height = displaySize + 'px';
        } else {
            // 桌面端：保持原有 90% 逻辑
            const displaySize = Math.min(containerWidth, containerHeight) * 0.90;
            this.canvas.style.transform = '';
            this.canvas.style.width  = displaySize + 'px';
            this.canvas.style.height = displaySize + 'px';
        }
    },
    
    initCities() {
        // 使用全局城市数据 C（来自 cities.js）
        if (typeof C !== 'undefined' && Array.isArray(C)) {
            this.cities = C.map(city => ({
                n: city.n,
                ne: city.ne,
                c: city.c,
                la: city.la,
                lo: city.lo,
                lang: city.lang,
                greeting: city.greeting,
                tier: city.tier || 3
            }));
            console.log(`Loaded ${this.cities.length} cities from cities.js`);
        } else {
            // 备用城市数据
            this.cities = [
                { n: "北京", ne: "Beijing", c: "CN", la: 39.9, lo: 116.4 },
                { n: "上海", ne: "Shanghai", c: "CN", la: 31.2, lo: 121.5 },
                { n: "广州", ne: "Guangzhou", c: "CN", la: 23.1, lo: 113.3 },
                { n: "深圳", ne: "Shenzhen", c: "CN", la: 22.5, lo: 114.1 },
                { n: "东京", ne: "Tokyo", c: "JP", la: 35.7, lo: 139.7 },
                { n: "纽约", ne: "New York", c: "US", la: 40.7, lo: -74.0 },
                { n: "伦敦", ne: "London", c: "GB", la: 51.5, lo: -0.1 },
                { n: "巴黎", ne: "Paris", c: "FR", la: 48.9, lo: 2.3 },
                { n: "悉尼", ne: "Sydney", c: "AU", la: -33.9, lo: 151.2 },
                { n: "迪拜", ne: "Dubai", c: "AE", la: 25.3, lo: 55.3 }
            ];
        }
        
        // 初始化城市统计显示
        this.updateCityStats();
    },
    
    // 搜索城市并跳转
    searchAndFocusCity(cityName) {
        const searchName = cityName.toLowerCase().trim();
        
        const city = this.cities.find(c => 
            c.ne.toLowerCase() === searchName || 
            c.n === searchName ||
            c.ne.toLowerCase().includes(searchName) ||
            searchName.includes(c.ne.toLowerCase())
        );
        
        if (city) {
            this.selectedCity = city;
            this.cityFlashTime = 0;
            this.focusOnCity(city);
            return city;
        }
        return null;
    },
    
    bindEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });
        
        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                // 修复拖动时的坐标转换
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                const deltaX = (e.clientX - this.lastMouseX) * scaleX;
                const deltaY = (e.clientY - this.lastMouseY) * scaleY;
                
                this.rotationY += deltaX * this.dragSpeedX;
                this.rotationX += deltaY * this.dragSpeedY;
                this.rotationX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.rotationX));
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
            }
            
            this.checkCityHover(e.clientX, e.clientY);
        });
        
        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.hoveredCity) {
                if (this.onCityClick) {
                    this.onCityClick(this.hoveredCity);
                }
            }
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
            this.setZoom(this.zoom + zoomDelta);
        }, { passive: false });
        
        window.addEventListener('resize', () => {
            this.updateScale();
        });
        
        // 调试：按 P 键打印当前角度
        window.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                console.log('=== 当前角度 ===');
                console.log('rotationY:', this.rotationY, '弧度 =', this.rotationY * 180 / Math.PI, '度');
                console.log('rotationX:', this.rotationX, '弧度 =', this.rotationX * 180 / Math.PI, '度');
                alert(`rotationY: ${(this.rotationY * 180 / Math.PI).toFixed(1)}°\nrotationX: ${(this.rotationX * 180 / Math.PI).toFixed(1)}°`);
            }
        });
        
        // 触摸事件
        let touchStartDistance = 0;
        let touchStartZoom = 1;
        
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.lastMouseX = e.touches[0].clientX;
                this.lastMouseY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                this.isDragging = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchStartDistance = Math.sqrt(dx * dx + dy * dy);
                touchStartZoom = this.zoom;
            }
        }, { passive: true });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && this.isDragging) {
                const deltaX = e.touches[0].clientX - this.lastMouseX;
                const deltaY = e.touches[0].clientY - this.lastMouseY;
                
                this.rotationY += deltaX * this.dragSpeedX;
                this.rotationX += deltaY * this.dragSpeedY;
                this.rotationX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.rotationX));
                
                this.lastMouseX = e.touches[0].clientX;
                this.lastMouseY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const touchDistance = Math.sqrt(dx * dx + dy * dy);
                const scale = touchDistance / touchStartDistance;
                this.setZoom(touchStartZoom * scale);
            }
        }, { passive: true });
        
        this.canvas.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    },

    setZoom(newZoom) {
        this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
        this.radius = this.baseRadius * this.zoom;
        this.centerX = this.canvasSize / 2;
        this.centerY = this.canvasSize / 2;
    },
    
    checkCityHover(mouseX, mouseY) {
        const rect = this.canvas.getBoundingClientRect();
        
        // 计算 CSS 缩放比例
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        // 使用缩放比例转换坐标
        const x = (mouseX - rect.left) * scaleX;
        const y = (mouseY - rect.top) * scaleY;
        
        this.hoveredCity = null;
        
        for (const city of this.cities) {
            const pos = this.latLngToScreen(city.la, city.lo);
            if (pos) {
                const dx = x - pos.x;
                const dy = y - pos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 22) {
                    this.hoveredCity = city;
                    if (this.onCityHover) {
                        this.onCityHover(city, mouseX, mouseY);
                    }
                    return;
                }
            }
        }
        
        if (this.onCityHover) {
            this.onCityHover(null, 0, 0);
        }
    },
    
    latLngToScreen(lat, lng) {
        // 球面坐标到屏幕坐标的转换
        // 
        // 球体坐标系：
        // - 正前方（屏幕中心）对应经度 0°，纬度 0°
        // - 经度：东经为正，西经为负
        // - 纬度：北纬为正，南纬为负
        //
        // 旋转变换：
        // - rotationY：经度旋转（绕Y轴）
        // - rotationX：纬度旋转（绕X轴）
        
        // 将经纬度转换为弧度
        const latRad = lat * (Math.PI / 180);
        const lngRad = lng * (Math.PI / 180);
        
        // 应用旋转后的坐标
        // 先旋转经度（Y轴），再旋转纬度（X轴）
        const cosLng = Math.cos(lngRad + this.rotationY);
        const sinLng = Math.sin(lngRad + this.rotationY);
        const cosLat = Math.cos(latRad);
        const sinLat = Math.sin(latRad);
        
        // 应用纬度旋转（X轴）
        const cosRotX = Math.cos(this.rotationX);
        const sinRotX = Math.sin(this.rotationX);
        
        // 3D 坐标（球心在原点）
        // 正前方是 Z 轴正方向
        const x3d = cosLat * sinLng;
        const y3d = sinLat * cosRotX - cosLat * cosLng * sinRotX;
        const z3d = sinLat * sinRotX + cosLat * cosLng * cosRotX;
        
        // 只显示正面（z3d > 0）
        if (z3d < 0) return null;
        
        // 投影到2D屏幕
        const x = this.centerX + this.radius * x3d;
        const y = this.centerY - this.radius * y3d;
        
        return { x, y };
    },
    
    animate() {
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;
        
        if (elapsed >= this.frameInterval) {
            this.lastFrameTime = now;
            
            if (!this.isDragging) {
                this.rotationY += this.autoRotateSpeed;
            }
            
            this.time++;
            this.cityFlashTime++;
            this.render();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    render() {
        // 复古未来主义：CRT显示器效果
        // 填充背景色（整个 canvas，参考代码方式）
        const bgColor = this.theme.bgPrimary || '#000000';
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // CRT扫描线效果
        if (this.theme.retroGlow) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.03;
            this.ctx.strokeStyle = this.theme.retroGlow;
            this.ctx.lineWidth = 1;
            const scanLineY = (this.time * 0.5) % this.height;
            this.ctx.beginPath();
            this.ctx.moveTo(0, scanLineY);
            this.ctx.lineTo(this.width, scanLineY);
            this.ctx.stroke();
            this.ctx.restore();
            
            // CRT边角阴影
            this.ctx.save();
            this.ctx.globalAlpha = 0.1;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            // 四个边角
            const gradientSize = 60;
            for (let x of [0, this.width]) {
                for (let y of [0, this.height]) {
                    const gradient = this.ctx.createRadialGradient(
                        x, y, 0, x, y, gradientSize
                    );
                    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
                    gradient.addColorStop(1, 'transparent');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(
                        x - (x === 0 ? 0 : gradientSize), 
                        y - (y === 0 ? 0 : gradientSize), 
                        gradientSize, 
                        gradientSize
                    );
                }
            }
            this.ctx.restore();
        }

        // 绘制圆形地球区域（剪切）
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.clip();

        this.renderASCIISphere();
        this.ctx.restore();

        // 城市绘制
        this.renderCities();
    },
    
    // 背景代码雨初始化
    codeRainDrops: null,
    
    initCodeRain() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const fontSize = 13;
        const colCount = Math.floor(w / fontSize);
        const maxTrail = 20; // 尾巴最大长度（字符数）
        this.codeRainDrops = [];

        // 字符集（提前定义，init 时也用得到）
        const hackerChars = '0123456789天地风云雨雪雷电山海水火气温湿压速光波数据流码网系统终端字节信息密码科技未来宇宙星空';
        const auroraChars = '0123456789ABCDEF';
        const voidChars   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.?/~`';

        for (let i = 0; i < colCount; i++) {
            const trailLen = 8 + Math.floor(Math.random() * 12); // 每列尾巴长度随机
            const trail = [];
            for (let t = 0; t < trailLen; t++) {
                // 初始化尾巴字符（随机）
                trail.push(hackerChars[Math.floor(Math.random() * hackerChars.length)]);
            }
            this.codeRainDrops.push({
                x: i * fontSize,           // 列 x 坐标
                headRow: Math.random() * (h / fontSize) * 2 - trailLen, // 头部行号（可为负，从屏幕外开始）
                speed: 0.21 + Math.random() * 0.35, // 每帧下落行数（-30% 减速）
                trail,                     // 尾巴字符数组（[0]=头部，最新）
                updateTimer: 0,            // 字符刷新计时
                updateInterval: 2 + Math.floor(Math.random() * 4), // 几帧刷新一次字符
                hackerChars,
                auroraChars,
                voidChars,
            });
        }
    },
    
    // 背景代码雨动画
    animateCodeRain() {
        if (!this.codeRainCanvas || !this.codeRainCtx) return;
        
        const ctx = this.codeRainCtx;
        const w = this.codeRainCanvas.width;
        const h = this.codeRainCanvas.height;
        const fontSize = 13;
        const isAurora = this.theme.accent === '#ffffff';
        const isVoid   = this.theme.accent === '#cc00ff';

        // 每帧清空画布（纯净竖列，不用拖影蒙层）
        ctx.clearRect(0, 0, w, h);
        
        ctx.font = `${fontSize}px Consolas, monospace`;
        ctx.textAlign = 'center';

        for (let i = 0; i < this.codeRainDrops.length; i++) {
            const drop = this.codeRainDrops[i];
            const chars = isAurora ? drop.auroraChars
                        : isVoid   ? drop.voidChars
                        : drop.hackerChars;
            const trailLen = drop.trail.length;

            // 定期随机刷新尾巴中的字符，制造闪烁感
            drop.updateTimer++;
            if (drop.updateTimer >= drop.updateInterval) {
                drop.updateTimer = 0;
                // 随机替换尾巴中某个字符
                const idx = Math.floor(Math.random() * trailLen);
                drop.trail[idx] = chars[Math.floor(Math.random() * chars.length)];
                // 头部字符每次都换新（最活跃）
                drop.trail[0] = chars[Math.floor(Math.random() * chars.length)];
            }

            // 绘制每个尾巴字符
            for (let t = 0; t < trailLen; t++) {
                const row = Math.floor(drop.headRow) - t; // 头部在下，尾部在上
                const y = row * fontSize;
                if (y < -fontSize || y > h) continue; // 超出屏幕跳过

                // 透明度：头部最亮(t=0)，尾部最暗
                const ratio = 1 - t / trailLen;
                const alpha = ratio * ratio; // 平方衰减，尾部更快消隐

                if (t === 0) {
                    // 头部：最亮（白色/亮绿/亮紫白）
                    ctx.fillStyle = isVoid   ? `rgba(238, 102, 255, ${Math.min(1, alpha * 1.5)})` // 亮紫白头
                                  : isAurora ? `rgba(200, 240, 255, ${Math.min(1, alpha * 1.5)})` // 冰白
                                  : `rgba(180, 255, 180, ${Math.min(1, alpha * 1.5)})`;           // 亮绿白
                } else if (isVoid) {
                    ctx.fillStyle = `rgba(204, 0, 255, ${alpha * 0.9})`;   // 品紫主体
                } else if (isAurora) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
                } else {
                    ctx.fillStyle = `rgba(0, 255, 0, ${alpha * 0.9})`;
                }

                ctx.fillText(drop.trail[t], drop.x + fontSize / 2, y);
            }

            // 推进头部下落
            drop.headRow += drop.speed;

            // 头部超出屏幕底部后，重置到屏幕顶部外
            if (drop.headRow * fontSize > h + trailLen * fontSize) {
                drop.headRow = -trailLen - Math.random() * 20;
                drop.speed = 0.21 + Math.random() * 0.35;
            }
        }

        ctx.textAlign = 'left'; // 恢复默认

        this.codeRainAnimationId = requestAnimationFrame(() => this.animateCodeRain());
    },
    
    renderASCIISphere() {
        // 两个主题都不渲染内部，依靠城市点阵形成轮廓感
        return;
    },
    
    renderCities() {
        // 所有城市都显示，但用不同大小的粒子区分
        const theme = this.theme;
        
        for (const city of this.cities) {
            const pos = this.latLngToScreen(city.la, city.lo);
            if (!pos) continue;
            
            const pulse = Math.sin(this.time * 0.1) * 0.3 + 0.7;
            const isHovered = this.hoveredCity === city;
            const isSelected = this.selectedCity === city;
            const cityTier = city.tier || 3;
            
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // 选中城市：主题分支 - Hacker=洋红故障 / Aurora=霓虹绿故障 / Void=青色故障
            if (isSelected) {
                const isAurora = this.theme.accent === '#ffffff';
                const isVoid   = this.theme.accent === '#cc00ff';
                const flashPulse = Math.sin(this.cityFlashTime * 0.5) * 0.5 + 0.5;

                // 故障偏移量
                const glitchX = Math.random() > 0.82 ? (Math.random() - 0.5) * 7 : 0;
                const glitchY = Math.random() > 0.82 ? (Math.random() - 0.5) * 5 : 0;

                // 颜色定义
                const selColor     = isVoid   ? '#00ffff'     // Void 选中=青色（RGB故障互补）
                                   : isAurora ? '#FFC107'     // Aurora=琥珀金
                                   : '#FF00FF';               // Hacker=洋红
                const selBright    = isVoid   ? '#66ffff'
                                   : isAurora ? '#FFD740'     // 亮琥珀
                                   : '#ff66ff';
                const selRgb1      = isVoid   ? '0,255,255'
                                   : isAurora ? '255,193,7'   // 琥珀金 RGB
                                   : '255,0,255';
                const selRgb2      = isVoid   ? '0,200,255'   // 青色残影
                                   : isAurora ? '255,160,0'   // 深琥珀残影
                                   : '255,0,200';
                const glitchColor2 = isVoid   ? '#ff00cc'     // Void RGB分离=品红
                                   : isAurora ? '#00d4ff'     // Aurora RGB分离=青色
                                   : '#00FFFF';

                // 外层扩散扫描圈
                this.ctx.shadowColor = selColor;
                this.ctx.shadowBlur = 32;
                this.ctx.strokeStyle = `rgba(${selRgb1}, ${0.25 + flashPulse * 0.45})`;
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.arc(pos.x + glitchX, pos.y + glitchY, 24 + flashPulse * 9, 0, Math.PI * 2);
                this.ctx.stroke();

                // 中层方形扫描框 - 故障矩形
                this.ctx.shadowColor = selBright;
                this.ctx.shadowBlur = 18;
                this.ctx.strokeStyle = `rgba(${selRgb1}, ${0.5 + flashPulse * 0.3})`;
                this.ctx.lineWidth = 1;
                const sq = 13;
                this.ctx.strokeRect(pos.x - sq + glitchX * 0.5, pos.y - sq, sq * 2, sq * 2);

                // RGB色差分离故障
                if (Math.random() > 0.55) {
                    this.ctx.globalAlpha = 0.4;
                    this.ctx.fillStyle = selColor;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x - 2.5, pos.y, 3.5, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = glitchColor2;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x + 2.5, pos.y, 3.5, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.globalAlpha = 1.0;
                }

                // 中心圆点
                this.ctx.shadowColor = selBright;
                this.ctx.shadowBlur = 24;
                this.ctx.fillStyle = `rgba(${selRgb1}, ${0.85 + flashPulse * 0.15})`;
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 4.5, 0, Math.PI * 2);
                this.ctx.fill();

                // 核心白点
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 1.8, 0, Math.PI * 2);
                this.ctx.fill();

                // 城市名 + 故障残影
                this.ctx.font = 'bold 11px "JetBrains Mono", monospace';
                this.ctx.shadowColor = selColor;
                this.ctx.shadowBlur = 14;
                // 残影层
                this.ctx.fillStyle = `rgba(${selRgb2}, 0.3)`;
                this.ctx.fillText(city.ne.toUpperCase(), pos.x + 2, pos.y - 30);
                // 主体
                this.ctx.fillStyle = selBright;
                this.ctx.fillText(city.ne.toUpperCase(), pos.x + glitchX * 0.3, pos.y - 30);

            } else if (isHovered) {
                // 悬停：主题色圆点 + 光晕框
                const isAuroraHov = this.theme.accent === '#ffffff';
                const isVoidHov   = this.theme.accent === '#cc00ff';
                const hovC  = isVoidHov   ? '204,0,255'   // Void=品紫
                            : isAuroraHov ? '255,255,255'
                            : '0,255,0';
                const hovCC = isVoidHov   ? '#ee66ff'      // Void悬停=亮紫
                            : isAuroraHov ? '#ffffff'
                            : '#00FF00';
                this.ctx.shadowColor = `rgba(${hovC},0.8)`;
                this.ctx.shadowBlur = 18;
                this.ctx.strokeStyle = `rgba(${hovC},0.5)`;
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(pos.x - 12, pos.y - 12, 24, 24);

                // 中心圆点
                this.ctx.fillStyle = `rgba(${hovC},0.95)`;
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
                this.ctx.fill();

                // 城市名
                this.ctx.font = 'bold 10px "JetBrains Mono", monospace';
                this.ctx.fillStyle = hovCC;
                this.ctx.shadowBlur = 10;
                this.ctx.fillText(city.ne.toUpperCase(), pos.x, pos.y - 22);

            } else {
                // 普通城市：主题色光点
                const isAuroraCity = this.theme.accent === '#ffffff';
                const isVoidCity   = this.theme.accent === '#cc00ff';
                // Aurora=白色，Void=品紫，Hacker=黑客绿
                const cityC  = isVoidCity   ? '204,0,255'
                             : isAuroraCity ? '255,255,255'
                             : '0,255,0';
                const flicker = 0.7 + Math.random() * 0.3;
                const scanline = Math.sin(this.time * 0.1 + pos.y * 0.1) * 0.1 + 0.9;
                const combinedPulse = pulse * flicker * scanline;

                if (cityTier === 1) {
                    // Tier 1: 大城市 - 圆点 + 外层光晕
                    this.ctx.shadowColor = `rgba(${cityC},0.8)`;
                    this.ctx.shadowBlur = 12 * combinedPulse;
                    // 外层半透明光晕圆
                    this.ctx.fillStyle = `rgba(${cityC}, ${combinedPulse * 0.25})`;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
                    this.ctx.fill();
                    // 实心圆点
                    this.ctx.fillStyle = `rgba(${cityC}, ${combinedPulse})`;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
                    this.ctx.fill();
                    // 城市名
                    if (this.zoom >= 0.7) {
                        this.ctx.font = '8px "JetBrains Mono", monospace';
                        this.ctx.fillStyle = `rgba(${cityC}, ${combinedPulse * 0.85})`;
                        this.ctx.shadowBlur = 6;
                        this.ctx.fillText(city.ne.toUpperCase(), pos.x, pos.y + 16);
                    }

                } else if (cityTier === 2) {
                    // Tier 2: 中等城市 - 小圆点
                    this.ctx.shadowColor = `rgba(${cityC},0.6)`;
                    this.ctx.shadowBlur = 8 * combinedPulse;
                    this.ctx.fillStyle = `rgba(${cityC}, ${combinedPulse * 0.85})`;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
                    this.ctx.fill();

                } else {
                    // Tier 3: 小城市 - 微点
                    this.ctx.shadowColor = `rgba(${cityC},0.4)`;
                    this.ctx.shadowBlur = 4;
                    this.ctx.fillStyle = `rgba(${cityC}, ${combinedPulse * 0.6})`;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, 1.5, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
            
            this.ctx.shadowBlur = 0;
            this.ctx.textAlign = 'left';
        }
        
        // 更新城市统计显示
        this.updateCityStats();
    },
    
    // 更新城市统计显示
    updateCityStats() {
        const statsEl       = document.getElementById('city-stats');
        if (this.cities.length > 0) {
            const tier1 = this.cities.filter(c => c.tier === 1).length;
            const tier2 = this.cities.filter(c => c.tier === 2).length;
            const tier3 = this.cities.filter(c => c.tier === 3).length;
            const total = this.cities.length;
            const text  = `CITIES: ${total} | ●T1:${tier1} ○T2:${tier2} ·T3:${tier3}`;
            // 颜色跟随各主题选中城市色
            const isAurora = this.theme.accent === '#ffffff';
            const isVoid   = this.theme.accent === '#cc00ff';
            const color    = isVoid   ? '#00ffff'
                           : isAurora ? '#FFC107'
                           : '#FF00FF';
            const shadow   = isVoid
                ? '0 0 12px rgba(0,255,255,0.9), 0 0 24px rgba(0,255,255,0.5)'
                : isAurora
                ? '0 0 16px rgba(255,193,7,1), 0 0 32px rgba(255,193,7,0.6)'
                : '0 0 8px rgba(255,0,255,0.7)';

            if (statsEl) {
                statsEl.textContent  = text;
                statsEl.style.color       = color;
                statsEl.style.textShadow  = shadow;
            }
        }
    },
    
    focusOnCity(city) {
        if (!city || !city.la || !city.lo) return;
        
        // 设置为选中城市，触发红色闪烁
        this.selectedCity = city;
        this.cityFlashTime = 0;
        
        // 自动放大到合适级别，确保城市清晰可见
        const targetZoom = Math.max(this.zoom, 1.2);  // 至少放大到1.2倍
        
        // 目标角度：让城市落在球体中轴线的黄金分割点（从底部 38.2%，即比中心偏下）
        const GOLDEN_OFFSET = Math.asin(0.236);   // ≈ 0.238 rad，约 13.7°
        const targetRotationY = -city.lo * (Math.PI / 180);
        const targetRotationX =  city.la * (Math.PI / 180) - GOLDEN_OFFSET;
        // 限制在允许范围内，避免地图翻转
        const clampedRotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotationX));
        
        const startY = this.rotationY;
        const startX = this.rotationX;
        const startZoom = this.zoom;
        const duration = 600;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);
            // 缓出动画
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.rotationY = startY + (targetRotationY - startY) * eased;
            this.rotationX = startX + (clampedRotX - startX) * eased;
            this.zoom = startZoom + (targetZoom - startZoom) * eased;
            this.radius = this.baseRadius * this.zoom;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
};

// 兼容层
const Earth3D = {
    init: function() { return ASCIIEarth.init.apply(ASCIIEarth, arguments); },
    set onCityClick(callback) { ASCIIEarth.onCityClick = callback; },
    set onCityHover(callback) { ASCIIEarth.onCityHover = callback; },
    focusOnCity: function(city) { ASCIIEarth.focusOnCity(city); }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ASCIIEarth, Earth3D };
}
