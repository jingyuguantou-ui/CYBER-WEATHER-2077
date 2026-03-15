/**
 * ASCII Globe Module - 圆形平面地图
 * 圆形边界 + 内部平面展示 + ASCII艺术渲染
 */

const ASCIIGlobe = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    
    // 地图纹理
    textureCanvas: null,
    textureCtx: null,
    textureData: null,
    textureWidth: 2000,
    textureHeight: 1400,
    
    // 圆形显示区域
    radius: 0,
    centerX: 0,
    centerY: 0,
    
    // 地图偏移（用于平移查看不同区域）
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    dragSpeed: 0.5,
    
    // 缩放
    zoom: 1,
    minZoom: 0.8,
    maxZoom: 3,
    zoomSpeed: 0.1,
    
    // 字符网格
    gridWidth: 180,
    gridHeight: 180,
    charWidth: 0,
    charHeight: 0,
    
    // 字符集
    asciiChars: '@#$%&8BMW*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
    
    // 城市数据
    cities: [],
    hoveredCity: null,
    
    // 动画
    animationId: null,
    time: 0,
    
    // 回调
    onCityClick: null,
    onCityHover: null,
    
    // 性能
    lastFrameTime: 0,
    frameInterval: 1000 / 30,
    
    // 状态
    isLoaded: false,
    
    // 大洲颜色信息
    continentColors: null,
    
    async init() {
        console.log('ASCII Globe initializing...');
        
        this.canvas = document.getElementById('earth-canvas');
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        await this.generateMapTexture();
        this.resize();
        this.initCities();
        this.bindEvents();
        this.animate();
        this.isLoaded = true;
        
        console.log('ASCII Globe ready');
    },
    
    generateMapTexture() {
        this.textureCanvas = document.createElement('canvas');
        this.textureCanvas.width = this.textureWidth;
        this.textureCanvas.height = this.textureHeight;
        this.textureCtx = this.textureCanvas.getContext('2d');
        
        this.drawContinents();
        this.textureData = this.textureCtx.getImageData(0, 0, this.textureWidth, this.textureHeight);
    },
    
    drawContinents() {
        const ctx = this.textureCtx;
        const w = this.textureWidth;
        const h = this.textureHeight;
        
        // 深色背景（海洋不渲染）
        ctx.fillStyle = '#020a06';
        ctx.fillRect(0, 0, w, h);
        
        // 大洲颜色定义
        const continentColors = {
            northAmerica: { color: [0, 255, 136], name: '北美洲' },
            greenland: { color: [0, 230, 170], name: '格陵兰' },
            centralAmerica: { color: [0, 220, 150], name: '中美洲' },
            caribbean: { color: [0, 210, 140], name: '加勒比' },
            southAmerica: { color: [255, 200, 0], name: '南美洲' },
            europe: { color: [100, 200, 255], name: '欧洲' },
            africa: { color: [255, 100, 100], name: '非洲' },
            madagascar: { color: [255, 120, 90], name: '马达加斯加' },
            middleEast: { color: [200, 180, 100], name: '中东' },
            russia: { color: [170, 240, 130], name: '俄罗斯' },
            asia: { color: [180, 255, 100], name: '亚洲' },
            japan: { color: [160, 240, 120], name: '日本' },
            korea: { color: [170, 245, 125], name: '韩国' },
            india: { color: [175, 250, 110], name: '印度' },
            southeastAsia: { color: [185, 255, 115], name: '东南亚' },
            indonesia: { color: [190, 255, 120], name: '印尼' },
            australia: { color: [255, 100, 200], name: '澳大利亚' },
            newZealand: { color: [245, 130, 210], name: '新西兰' },
            papuaNewGuinea: { color: [200, 255, 130], name: '巴布亚新几内亚' },
            antarctica: { color: [150, 180, 200], name: '南极洲' }
        };
        
        // 七大洲精确轮廓数据
        const continents = {
            northAmerica: [
                [30, 65], [80, 55], [140, 50], [200, 55], [260, 70],
                [280, 100], [260, 130], [220, 150], [180, 160],
                [160, 170], [140, 200], [130, 240], [140, 280],
                [180, 290], [220, 280], [280, 260], [340, 250],
                [400, 240], [450, 250], [480, 280],
                [520, 260], [540, 230], [550, 200], [540, 180],
                [510, 170], [480, 175], [460, 190], [450, 210],
                [420, 200], [380, 195], [340, 200], [300, 210],
                [260, 220], [220, 235], [180, 250],
                [160, 270], [150, 310], [160, 350], [180, 390],
                [200, 420], [220, 440],
                [230, 460], [210, 480], [190, 500],
                [175, 520], [165, 540], [155, 560],
                [160, 580], [170, 595], [185, 605],
                [200, 610], [215, 615], [225, 610],
                [240, 600], [260, 590], [280, 580],
                [300, 565], [340, 555], [380, 545],
                [410, 540], [430, 535], [445, 525],
                [450, 510], [445, 495], [430, 485],
                [410, 475], [380, 460], [350, 440],
                [320, 415], [290, 385], [260, 355],
                [230, 325], [200, 300], [180, 275],
                [160, 270], [140, 280], [120, 260], [100, 230],
                [80, 200], [60, 170], [50, 140], [40, 110],
                [30, 85], [30, 65]
            ],
            
            greenland: [
                [540, 40], [590, 30], [660, 25], [720, 35],
                [760, 55], [780, 90], [785, 130], [775, 170],
                [750, 200], [700, 210], [650, 200], [610, 175],
                [570, 140], [545, 100], [535, 70], [540, 40]
            ],
            
            centralAmerica: [
                [185, 605], [200, 615], [220, 625], [240, 630],
                [255, 635], [260, 645], [250, 655], [235, 660],
                [220, 655], [200, 645], [185, 630], [175, 615],
                [185, 605]
            ],
            
            caribbean: [
                [300, 590], [320, 585], [340, 590], [350, 600],
                [345, 610], [330, 615], [310, 610], [300, 600],
                [300, 590]
            ],
            
            southAmerica: [
                [310, 620], [330, 610], [350, 615], [380, 625],
                [410, 640], [440, 660], [470, 680],
                [500, 700], [540, 720], [580, 735],
                [600, 755], [610, 790], [605, 830],
                [590, 870], [565, 905], [535, 935],
                [500, 955], [465, 970], [430, 980],
                [400, 985], [375, 990], [360, 1000],
                [350, 1020], [360, 1040], [380, 1050],
                [400, 1055], [420, 1050], [435, 1035],
                [430, 1010], [420, 985], [405, 960],
                [395, 935], [385, 910], [380, 885],
                [375, 860], [370, 835], [365, 810],
                [355, 785], [340, 760], [325, 740],
                [310, 725], [295, 715], [280, 710],
                [275, 700], [280, 680], [290, 660],
                [300, 640], [310, 620]
            ],
            
            europe: [
                [720, 90], [760, 80], [800, 85], [820, 100],
                [815, 120], [790, 130], [755, 125], [725, 110],
                [720, 90],
                [980, 50], [1020, 40], [1070, 38], [1120, 45],
                [1150, 60], [1160, 90], [1150, 120],
                [1130, 140], [1100, 150], [1080, 165],
                [1100, 175], [1140, 185], [1180, 200],
                [1200, 220], [1210, 250], [1200, 280],
                [1180, 300], [1140, 310], [1100, 305],
                [1080, 320], [1040, 330], [1000, 340],
                [880, 180], [900, 175], [920, 190], [925, 220],
                [910, 250], [880, 260], [855, 245], [850, 215],
                [860, 190], [880, 180],
                [920, 290], [900, 310], [890, 340], [905, 365],
                [935, 380], [975, 385], [1000, 370],
                [880, 390], [850, 400], [830, 430], [840, 465],
                [870, 490], [910, 500], [950, 485], [980, 455],
                [990, 420], [970, 395], [920, 390],
                [1000, 400], [1020, 430], [1035, 470], [1025, 510],
                [1000, 530], [980, 520], [970, 490], [985, 450],
                [1000, 400],
                [1040, 340], [1080, 355], [1110, 380], [1120, 420],
                [1100, 460], [1060, 480], [1020, 470], [1000, 440],
                [1020, 400], [1040, 360],
                [1060, 490], [1090, 510], [1100, 540], [1080, 560],
                [1040, 555], [1020, 530], [1040, 505],
                [1180, 200], [1160, 180], [1120, 160], [1080, 140],
                [1040, 110], [1000, 80], [980, 50]
            ],
            
            africa: [
                [850, 400], [820, 420], [800, 450], [790, 490],
                [785, 530], [790, 570], [800, 610],
                [815, 650], [835, 690], [855, 720],
                [870, 760], [885, 800], [895, 840],
                [905, 870], [920, 900], [940, 920],
                [950, 950], [960, 980], [970, 1010],
                [980, 1040], [995, 1060], [1020, 1070],
                [1050, 1075], [1080, 1070], [1110, 1055],
                [1130, 1030], [1140, 1000],
                [1150, 960], [1160, 920], [1170, 880],
                [1175, 840], [1170, 800],
                [1160, 760], [1150, 720], [1140, 680],
                [1130, 640], [1120, 600],
                [1130, 560], [1145, 520], [1160, 490],
                [1175, 470], [1185, 490], [1180, 530],
                [1160, 500], [1140, 480], [1110, 460],
                [1080, 450], [1050, 440], [1020, 430],
                [1000, 410], [970, 395], [940, 385],
                [910, 380], [880, 385], [850, 400]
            ],
            
            madagascar: [
                [1175, 780], [1195, 795], [1210, 830], [1205, 870],
                [1185, 900], [1160, 910], [1145, 890], [1150, 850],
                [1160, 810], [1175, 780]
            ],
            
            russia: [
                [1160, 45], [1260, 35], [1400, 30], [1540, 35],
                [1680, 45], [1820, 60], [1940, 80], [2000, 100],
                [1990, 140], [1960, 180], [1920, 220],
                [1900, 250], [1880, 290], [1860, 320],
                [1820, 340], [1760, 350], [1700, 355],
                [1640, 360], [1580, 380], [1520, 400],
                [1480, 420], [1440, 450], [1400, 480],
                [1360, 500], [1320, 520], [1280, 530],
                [1240, 510], [1220, 480], [1200, 450],
                [1180, 440], [1160, 430], [1140, 440],
                [1120, 450], [1100, 470], [1080, 490],
                [1060, 500], [1040, 510], [1020, 500],
                [1000, 480], [980, 460], [960, 440],
                [940, 430], [920, 440], [900, 460],
                [920, 400], [940, 370], [970, 340],
                [1000, 310], [1040, 280], [1080, 250],
                [1120, 220], [1160, 190], [1200, 170],
                [1240, 160], [1280, 170], [1320, 190],
                [1360, 210], [1400, 220], [1440, 210],
                [1480, 200], [1520, 200], [1560, 210],
                [1600, 230], [1640, 240], [1680, 240],
                [1720, 230], [1760, 210], [1800, 190],
                [1840, 170], [1880, 150], [1920, 130],
                [1880, 100], [1800, 80], [1700, 65],
                [1600, 55], [1500, 45], [1400, 40],
                [1300, 35], [1200, 40], [1160, 45]
            ],
            
            middleEast: [
                [1080, 480], [1120, 470], [1160, 475],
                [1200, 485], [1240, 500],
                [1280, 510], [1320, 530], [1360, 560],
                [1380, 600], [1370, 640], [1340, 670],
                [1300, 690], [1240, 700], [1180, 690],
                [1120, 670], [1060, 640], [1010, 600],
                [1040, 620], [1080, 640], [1120, 660],
                [1160, 680], [1200, 695], [1240, 700],
                [1060, 640], [1040, 620], [1020, 600],
                [1000, 580], [980, 560], [970, 540],
                [980, 520], [1000, 510], [1040, 500],
                [1080, 480]
            ],
            
            asia: [
                [1400, 440], [1440, 420], [1480, 410],
                [1520, 400], [1560, 410], [1600, 430],
                [1640, 450], [1680, 470], [1720, 490],
                [1740, 520], [1740, 550],
                [1720, 580], [1700, 620], [1680, 660],
                [1660, 700], [1640, 740], [1620, 780],
                [1580, 800], [1540, 830], [1500, 860],
                [1460, 880], [1420, 890],
                [1400, 900], [1380, 920], [1370, 950],
                [1380, 970], [1400, 980], [1420, 970],
                [1440, 940], [1480, 900], [1520, 860],
                [1560, 820], [1600, 780],
                [1620, 740], [1640, 700], [1660, 660],
                [1680, 620], [1700, 580], [1720, 540],
                [1760, 520], [1800, 510], [1820, 490],
                [1800, 470], [1760, 450], [1720, 440],
                [1680, 435], [1640, 440], [1600, 455],
                [1560, 470], [1520, 480], [1480, 490],
                [1440, 500], [1400, 510], [1360, 520],
                [1380, 500], [1400, 480], [1400, 440]
            ],
            
            japan: [
                [1780, 420], [1810, 430], [1830, 460], [1840, 500],
                [1830, 540], [1810, 570], [1780, 590], [1750, 580],
                [1740, 550], [1750, 510], [1760, 470], [1780, 420]
            ],
            
            korea: [
                [1720, 500], [1740, 490], [1755, 510], [1760, 540],
                [1750, 570], [1730, 580], [1710, 570], [1705, 540],
                [1710, 510], [1720, 500]
            ],
            
            india: [
                [1320, 580], [1360, 560], [1400, 570], [1440, 590],
                [1470, 630], [1480, 680], [1460, 730], [1420, 780],
                [1380, 820], [1340, 840], [1300, 830], [1270, 800],
                [1260, 750], [1270, 700], [1290, 650], [1320, 580]
            ],
            
            sriLanka: [
                [1350, 870], [1370, 880], [1380, 910], [1370, 940],
                [1350, 950], [1330, 940], [1320, 910], [1330, 880],
                [1350, 870]
            ],
            
            southeastAsia: [
                [1400, 980], [1440, 970], [1480, 975], [1520, 990],
                [1560, 1000], [1600, 1005], [1640, 1000]
            ],
            
            indonesia: [
                [1400, 1000], [1460, 990], [1520, 995], [1580, 1005],
                [1640, 1010], [1700, 1005], [1760, 995], [1820, 990],
                [1860, 1000], [1840, 1030], [1780, 1045], [1720, 1055],
                [1660, 1050], [1600, 1040], [1540, 1025], [1480, 1010],
                [1420, 1000], [1400, 1000]
            ],
            
            philippines: [
                [1700, 920], [1720, 940], [1730, 980], [1720, 1020],
                [1700, 1050], [1680, 1040], [1670, 1000], [1680, 960],
                [1700, 920]
            ],
            
            papuaNewGuinea: [
                [1860, 1050], [1920, 1040], [1970, 1055], [2000, 1080],
                [1980, 1100], [1930, 1105], [1880, 1090], [1860, 1070],
                [1860, 1050]
            ],
            
            australia: [
                [1400, 1100], [1440, 1080], [1500, 1070], [1560, 1075],
                [1620, 1080], [1680, 1090], [1740, 1105],
                [1800, 1120], [1850, 1140], [1880, 1170],
                [1870, 1200], [1840, 1230], [1800, 1250],
                [1740, 1260], [1680, 1270], [1620, 1265],
                [1560, 1250], [1500, 1230], [1450, 1200],
                [1420, 1160], [1400, 1120], [1400, 1100]
            ],
            
            newZealand: [
                [1960, 1240], [1990, 1230], [2010, 1260], [2000, 1300],
                [1970, 1330], [1940, 1320], [1930, 1280], [1940, 1250],
                [1960, 1240]
            ],
            
            antarctica: [
                [0, 1300], [200, 1280], [400, 1270], [600, 1265],
                [800, 1270], [1000, 1275], [1200, 1270], [1400, 1265],
                [1600, 1270], [1800, 1280], [2000, 1300],
                [2000, 1400], [0, 1400], [0, 1300]
            ]
        };
        
        // 绘制大陆填充
        Object.entries(continents).forEach(([name, points]) => {
            const colorInfo = continentColors[name];
            if (!colorInfo) return;
            
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
        
        // 绘制海岸线
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
        
        this.continentColors = continentColors;
    },
    
    resize() {
        const container = this.canvas.parentElement;
        if (container) {
            this.width = container.clientWidth;
            this.height = container.clientHeight;
        } else {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // 圆形显示区域
        const minDim = Math.min(this.width, this.height);
        this.radius = minDim * 0.45;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        
        this.charWidth = this.width / this.gridWidth;
        this.charHeight = this.height / this.gridHeight;
    },
    
    initCities() {
        this.cities = [
            { n: "北京", ne: "Beijing", c: "CN", la: 39.9, lo: 116.4 },
            { n: "上海", ne: "Shanghai", c: "CN", la: 31.2, lo: 121.5 },
            { n: "东京", ne: "Tokyo", c: "JP", la: 35.7, lo: 139.7 },
            { n: "纽约", ne: "New York", c: "US", la: 40.7, lo: -74.0 },
            { n: "伦敦", ne: "London", c: "GB", la: 51.5, lo: -0.1 },
            { n: "巴黎", ne: "Paris", c: "FR", la: 48.9, lo: 2.3 },
            { n: "悉尼", ne: "Sydney", c: "AU", la: -33.9, lo: 151.2 },
            { n: "迪拜", ne: "Dubai", c: "AE", la: 25.3, lo: 55.3 },
            { n: "莫斯科", ne: "Moscow", c: "RU", la: 55.8, lo: 37.6 },
            { n: "新加坡", ne: "Singapore", c: "SG", la: 1.3, lo: 103.8 },
            { n: "洛杉矶", ne: "Los Angeles", c: "US", la: 34.1, lo: -118.2 },
            { n: "香港", ne: "Hong Kong", c: "HK", la: 22.3, lo: 114.2 },
            { n: "首尔", ne: "Seoul", c: "KR", la: 37.6, lo: 127.0 },
            { n: "孟买", ne: "Mumbai", c: "IN", la: 19.1, lo: 72.9 },
            { n: "开罗", ne: "Cairo", c: "EG", la: 30.0, lo: 31.2 },
            { n: "约翰内斯堡", ne: "Johannesburg", c: "ZA", la: -26.2, lo: 28.0 },
            { n: "圣保罗", ne: "Sao Paulo", c: "BR", la: -23.5, lo: -46.6 },
            { n: "墨西哥城", ne: "Mexico City", c: "MX", la: 19.4, lo: -99.1 },
            { n: "多伦多", ne: "Toronto", c: "CA", la: 43.7, lo: -79.4 },
            { n: "柏林", ne: "Berlin", c: "DE", la: 52.5, lo: 13.4 }
        ];
    },
    
    bindEvents() {
        // 悬停检测城市
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                this.offsetX += deltaX * this.dragSpeed;
                this.offsetY += deltaY * this.dragSpeed;
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
            }
            this.checkCityHover(e.clientX, e.clientY);
        });
        
        // 拖拽平移
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });
        
        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        // 点击城市
        this.canvas.addEventListener('click', (e) => {
            if (this.hoveredCity) {
                if (this.onCityClick) {
                    this.onCityClick(this.hoveredCity);
                }
            }
        });
        
        // 滚轮缩放
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
            this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom + zoomDelta));
        }, { passive: false });
        
        window.addEventListener('resize', () => {
            this.resize();
        });
    },
    
    checkCityHover(mouseX, mouseY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;
        
        // 检查是否在圆形区域内
        const dx = x - this.centerX;
        const dy = y - this.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > this.radius) {
            if (this.hoveredCity && this.onCityHover) {
                this.onCityHover(null, 0, 0);
            }
            this.hoveredCity = null;
            return;
        }
        
        this.hoveredCity = null;
        
        for (const city of this.cities) {
            const pos = this.latLngToScreen(city.la, city.lo);
            if (pos) {
                const cdx = x - pos.x;
                const cdy = y - pos.y;
                const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
                
                if (cdist < 22) {
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
        // 墨卡托投影转换（平面投影）
        const mapWidth = this.radius * 2 * this.zoom;
        const mapHeight = this.radius * 2 * this.zoom;
        
        // 经度 -> X (世界坐标)
        const worldX = ((lng + 180) / 360) * this.textureWidth;
        // 纬度 -> Y (墨卡托)
        const latRad = lat * Math.PI / 180;
        const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
        const worldY = (this.textureHeight / 2) - (this.textureHeight * mercN / (2 * Math.PI));
        
        // 世界坐标 -> 纹理坐标
        const textureX = worldX;
        const textureY = Math.max(0, Math.min(this.textureHeight, worldY));
        
        // 纹理坐标 -> 屏幕坐标（圆形内）
        const screenX = this.centerX + (textureX - this.textureWidth / 2) * (mapWidth / this.textureWidth) + this.offsetX;
        const screenY = this.centerY + (textureY - this.textureHeight / 2) * (mapHeight / this.textureHeight) + this.offsetY;
        
        // 检查是否在圆形范围内
        const dx = screenX - this.centerX;
        const dy = screenY - this.centerY;
        if (Math.sqrt(dx * dx + dy * dy) > this.radius) {
            return null;
        }
        
        return { x: screenX, y: screenY };
    },
    
    animate() {
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;
        
        if (elapsed >= this.frameInterval) {
            this.lastFrameTime = now;
            this.time++;
            this.render();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    render() {
        this.ctx.fillStyle = '#030508';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 创建圆形裁剪区域
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.clip();
        
        // 绘制圆形背景（深色）
        this.ctx.fillStyle = '#050a08';
        this.ctx.fill();
        
        const fontSize = Math.max(5, Math.min(8, this.charHeight * 0.8));
        this.ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
        this.ctx.textBaseline = 'top';
        
        this.renderASCIIMap();
        this.renderCities();
        
        this.ctx.restore();
        
        // 绘制圆形边框
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 绘制发光边框
        this.ctx.shadowColor = '#00ff88';
        this.ctx.shadowBlur = 15;
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    },
    
    renderASCIIMap() {
        const landChars = '@#$%&8BMW*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
        
        const mapWidth = this.radius * 2 * this.zoom;
        const mapHeight = this.radius * 2 * this.zoom;
        
        for (let gridY = 0; gridY < this.gridHeight; gridY++) {
            for (let gridX = 0; gridX < this.gridWidth; gridX++) {
                const screenX = gridX * this.charWidth + this.charWidth / 2;
                const screenY = gridY * this.charHeight + this.charHeight / 2;
                
                // 检查是否在圆形区域内
                const dx = screenX - this.centerX;
                const dy = screenY - this.centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > this.radius) continue;
                
                // 屏幕坐标 -> 世界坐标
                const worldX = (screenX - this.centerX - this.offsetX) / mapWidth * this.textureWidth + this.textureWidth / 2;
                const worldY = (screenY - this.centerY - this.offsetY) / mapHeight * this.textureHeight + this.textureHeight / 2;
                
                // 纹理坐标
                const textureX = Math.floor(worldX);
                const textureY = Math.floor(worldY);
                
                if (textureX < 0 || textureX >= this.textureWidth || 
                    textureY < 0 || textureY >= this.textureHeight) continue;
                
                const idx = (textureY * this.textureWidth + textureX) * 4;
                const r = this.textureData.data[idx];
                const g = this.textureData.data[idx + 1];
                const b = this.textureData.data[idx + 2];
                
                // 陆地检测
                const isLand = (r + g + b) > 100 && !(r < 20 && g < 20 && b < 20);
                
                if (isLand) {
                    // 根据亮度选择字符
                    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    const charIndex = Math.floor(brightness * (landChars.length - 1));
                    const char = landChars[charIndex];
                    
                    // 计算到圆形边缘的距离，用于边缘高亮
                    const edgeDist = this.radius - dist;
                    const edgeFactor = edgeDist / this.radius;
                    
                    let color;
                    if (edgeFactor < 0.03) {
                        // 圆形边缘 - 霓虹绿高亮
                        color = 'rgba(0, 255, 136, 0.95)';
                    } else {
                        // 使用纹理中的颜色
                        color = `rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)}, 0.9)`;
                    }
                    
                    this.ctx.fillStyle = color;
                    this.ctx.fillText(char, screenX - this.charWidth / 2, screenY - this.charHeight / 2);
                }
            }
        }
    },
    
    renderCities() {
        for (const city of this.cities) {
            const pos = this.latLngToScreen(city.la, city.lo);
            if (!pos) continue;
            
            const pulse = Math.sin(this.time * 0.1) * 0.25 + 0.75;
            const isHovered = this.hoveredCity === city;
            
            this.ctx.font = '18px "Share Tech Mono", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            if (isHovered) {
                this.ctx.shadowColor = '#00ff88';
                this.ctx.shadowBlur = 20;
                this.ctx.fillStyle = '#00ff88';
            } else {
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = `rgba(0, 255, 136, ${pulse})`;
            }
            
            this.ctx.fillText('◆', pos.x, pos.y);
            
            if (isHovered) {
                this.ctx.font = '12px "JetBrains Mono", monospace';
                this.ctx.fillStyle = '#00ff88';
                this.ctx.fillText(city.ne.toUpperCase(), pos.x, pos.y + 22);
            }
            
            this.ctx.shadowBlur = 0;
            this.ctx.textAlign = 'left';
        }
    },
    
    focusOnCity(city) {
        // 平移地图以聚焦城市
        if (!city || !city.la || !city.lo) return;
        
        const targetWorldX = ((city.lo + 180) / 360) * this.textureWidth;
        const targetWorldY = this.textureHeight / 2 - (this.textureHeight * Math.log(Math.tan(Math.PI / 4 + city.la * Math.PI / 360)) / (2 * Math.PI));
        
        const mapWidth = this.radius * 2 * this.zoom;
        const mapHeight = this.radius * 2 * this.zoom;
        
        // 计算需要的偏移量使城市位于中心
        const targetOffsetX = -((targetWorldX - this.textureWidth / 2) * (mapWidth / this.textureWidth));
        const targetOffsetY = -((targetWorldY - this.textureHeight / 2) * (mapHeight / this.textureHeight));
        
        const duration = 800;
        const startTime = Date.now();
        const startOffsetX = this.offsetX;
        const startOffsetY = this.offsetY;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.offsetX = startOffsetX + (targetOffsetX - startOffsetX) * eased;
            this.offsetY = startOffsetY + (targetOffsetY - startOffsetY) * eased;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
};

// 兼容层
const Earth3D = {
    init: function() { return ASCIIGlobe.init.apply(ASCIIGlobe, arguments); },
    set onCityClick(callback) { ASCIIGlobe.onCityClick = callback; },
    set onCityHover(callback) { ASCIIGlobe.onCityHover = callback; },
    focusOnCity: function(city) { ASCIIGlobe.focusOnCity(city); }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ASCIIGlobe, Earth3D };
}
