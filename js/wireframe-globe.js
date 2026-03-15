/**
 * Wireframe Globe Module - 线框地球
 * 简洁的经纬线网格 + 大洲轮廓
 */

const WireframeGlobe = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    
    // 球体参数
    radius: 0,
    centerX: 0,
    centerY: 0,
    
    // 旋转
    rotationY: 0,
    rotationX: 0.2,
    autoRotateSpeed: 0.003,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    dragSpeedX: 0.005,
    dragSpeedY: 0.003,
    
    // 缩放
    zoom: 1,
    minZoom: 0.5,
    maxZoom: 2.5,
    zoomSpeed: 0.1,
    
    // 大洲轮廓数据
    continents: [],
    
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
    frameInterval: 1000 / 60,
    
    // 状态
    isLoaded: false,
    
    async init() {
        console.log('Wireframe Globe initializing...');
        
        this.canvas = document.getElementById('earth-canvas');
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.initContinents();
        this.resize();
        this.initCities();
        this.bindEvents();
        this.animate();
        this.isLoaded = true;
        
        console.log('Wireframe Globe ready');
    },
    
    initContinents() {
        // 简化的大洲轮廓坐标 (经度, 纬度)
        this.continents = {
            northAmerica: {
                color: '#00ff88',
                points: [
                    [-170, 65], [-165, 70], [-155, 72], [-140, 70], [-120, 75],
                    [-95, 78], [-80, 75], [-72, 78], [-60, 75], [-52, 48],
                    [-56, 47], [-60, 45], [-68, 44], [-70, 41], [-75, 35],
                    [-80, 25], [-90, 20], [-100, 20], [-105, 22], [-118, 32],
                    [-125, 40], [-125, 50], [-130, 55], [-145, 60], [-165, 60],
                    [-170, 65]
                ]
            },
            southAmerica: {
                color: '#ffd700',
                points: [
                    [-80, 10], [-75, 5], [-70, 5], [-60, 5], [-50, 0],
                    [-45, -5], [-40, -20], [-40, -25], [-45, -25], [-55, -25],
                    [-60, -35], [-65, -50], [-70, -55], [-75, -50], [-70, -40],
                    [-75, -20], [-75, -10], [-80, 0], [-80, 10]
                ]
            },
            europe: {
                color: '#00d4ff',
                points: [
                    [-10, 35], [0, 40], [5, 45], [0, 50], [-5, 55],
                    [-10, 58], [5, 60], [20, 60], [30, 65], [35, 70],
                    [40, 68], [50, 60], [55, 55], [50, 50], [45, 45],
                    [40, 40], [35, 35], [25, 35], [15, 38], [5, 38],
                    [-10, 35]
                ]
            },
            africa: {
                color: '#ff6b6b',
                points: [
                    [-15, 35], [-5, 35], [10, 35], [20, 32], [35, 30],
                    [45, 12], [50, 10], [55, 15], [50, 0], [45, -10],
                    [40, -20], [35, -25], [25, -35], [20, -35], [15, -30],
                    [10, -15], [0, 5], [-10, 5], [-20, 15], [-20, 25],
                    [-15, 35]
                ]
            },
            asia: {
                color: '#b8ff00',
                points: [
                    [25, 35], [35, 35], [45, 40], [55, 45], [60, 50],
                    [70, 55], [90, 55], [100, 60], [110, 65], [130, 65],
                    [145, 50], [150, 45], [145, 40], [135, 35], [120, 25],
                    [110, 20], [100, 15], [90, 20], [80, 15], [70, 20],
                    [60, 25], [55, 25], [50, 30], [40, 30], [25, 35]
                ]
            },
            india: {
                color: '#b8ff00',
                points: [
                    [65, 25], [75, 25], [85, 22], [90, 22], [88, 15],
                    [85, 10], [80, 8], [75, 10], [70, 15], [68, 22],
                    [65, 25]
                ]
            },
            australia: {
                color: '#ff00ff',
                points: [
                    [115, -22], [130, -12], [145, -15], [150, -22],
                    [153, -28], [150, -35], [145, -40], [135, -35],
                    [130, -32], [120, -30], [115, -25], [115, -22]
                ]
            },
            antarctica: {
                color: '#88ccff',
                points: [
                    [-180, -70], [-120, -72], [-60, -70], [0, -72],
                    [60, -70], [120, -72], [180, -70], [180, -90],
                    [-180, -90], [-180, -70]
                ]
            }
        };
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
        
        const minDim = Math.min(this.width, this.height);
        this.radius = minDim * 0.35;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
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
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });
        
        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                
                this.rotationY += deltaX * this.dragSpeedX;
                this.rotationX += deltaY * this.dragSpeedY;
                this.rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.rotationX));
                
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
        
        this.hoveredCity = null;
        
        for (const city of this.cities) {
            const pos = this.latLngToScreen(city.la, city.lo);
            if (pos) {
                const dx = x - pos.x;
                const dy = y - pos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 18) {
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
    
    latLngTo3D(lat, lng) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lng + 180) * Math.PI / 180;
        
        return {
            x: Math.sin(phi) * Math.cos(theta),
            y: Math.cos(phi),
            z: Math.sin(phi) * Math.sin(theta)
        };
    },
    
    rotate3D(point) {
        const cosY = Math.cos(this.rotationY);
        const sinY = Math.sin(this.rotationY);
        let x = point.x * cosY - point.z * sinY;
        let z = point.x * sinY + point.z * cosY;
        
        const cosX = Math.cos(this.rotationX);
        const sinX = Math.sin(this.rotationX);
        let y = point.y * cosX - z * sinX;
        z = point.y * sinX + z * cosX;
        
        return { x, y, z };
    },
    
    project(point3D) {
        const r = this.radius * this.zoom;
        return {
            x: this.centerX + r * point3D.x,
            y: this.centerY - r * point3D.y,
            z: point3D.z
        };
    },
    
    latLngToScreen(lat, lng) {
        const p3d = this.latLngTo3D(lat, lng);
        const rotated = this.rotate3D(p3d);
        if (rotated.z < 0) return null;
        return this.project(rotated);
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
            this.render();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    render() {
        this.ctx.fillStyle = '#030508';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 1. 绘制经纬线网格
        this.renderGrid();
        
        // 2. 绘制大洲轮廓
        this.renderContinents();
        
        // 3. 绘制城市
        this.renderCities();
        
        // 4. 绘制球体轮廓
        this.renderOutline();
    },
    
    renderGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)';
        this.ctx.lineWidth = 1;
        
        // 经线 (每15度)
        for (let lng = -180; lng < 180; lng += 30) {
            this.ctx.beginPath();
            let started = false;
            
            for (let lat = -85; lat <= 85; lat += 5) {
                const pos = this.latLngToScreen(lat, lng);
                if (pos) {
                    if (!started) {
                        this.ctx.moveTo(pos.x, pos.y);
                        started = true;
                    } else {
                        this.ctx.lineTo(pos.x, pos.y);
                    }
                } else {
                    started = false;
                }
            }
            this.ctx.stroke();
        }
        
        // 纬线 (每15度)
        for (let lat = -75; lat <= 75; lat += 30) {
            this.ctx.beginPath();
            let started = false;
            
            for (let lng = -180; lng <= 180; lng += 5) {
                const pos = this.latLngToScreen(lat, lng);
                if (pos) {
                    if (!started) {
                        this.ctx.moveTo(pos.x, pos.y);
                        started = true;
                    } else {
                        this.ctx.lineTo(pos.x, pos.y);
                    }
                } else {
                    started = false;
                }
            }
            this.ctx.stroke();
        }
    },
    
    renderContinents() {
        for (const [name, continent] of Object.entries(this.continents)) {
            const points = continent.points;
            const screenPoints = [];
            let visible = false;
            
            for (const pt of points) {
                const pos = this.latLngToScreen(pt[1], pt[0]);
                if (pos) {
                    screenPoints.push(pos);
                    visible = true;
                }
            }
            
            if (!visible || screenPoints.length < 2) continue;
            
            // 绘制轮廓
            this.ctx.beginPath();
            this.ctx.moveTo(screenPoints[0].x, screenPoints[0].y);
            
            for (let i = 1; i < screenPoints.length; i++) {
                this.ctx.lineTo(screenPoints[i].x, screenPoints[i].y);
            }
            this.ctx.closePath();
            
            // 填充（半透明）
            this.ctx.fillStyle = continent.color.replace(')', ', 0.15)').replace('rgb', 'rgba').replace('#', '');
            const fillColor = this.hexToRgba(continent.color, 0.2);
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
            
            // 描边
            this.ctx.strokeStyle = continent.color;
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
        }
    },
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    
    renderCities() {
        for (const city of this.cities) {
            const pos = this.latLngToScreen(city.la, city.lo);
            if (!pos) continue;
            
            const isHovered = this.hoveredCity === city;
            const pulse = Math.sin(this.time * 0.08) * 0.3 + 0.7;
            
            // 城市点
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, isHovered ? 6 : 3, 0, Math.PI * 2);
            this.ctx.fillStyle = isHovered ? '#00ff88' : `rgba(0, 255, 136, ${0.5 + pulse * 0.5})`;
            
            if (isHovered) {
                this.ctx.shadowColor = '#00ff88';
                this.ctx.shadowBlur = 15;
            }
            
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // 城市名
            if (isHovered) {
                this.ctx.font = '11px "JetBrains Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = '#00ff88';
                this.ctx.fillText(city.ne.toUpperCase(), pos.x, pos.y + 18);
                this.ctx.textAlign = 'left';
            }
        }
    },
    
    renderOutline() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius * this.zoom, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
    },
    
    focusOnCity(city) {
        if (!city || !city.la || !city.lo) return;
        
        const targetY = -city.lo * Math.PI / 180;
        const targetX = city.la * Math.PI / 180 * 0.3;
        
        const startY = this.rotationY;
        const startX = this.rotationX;
        const duration = 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.rotationY = startY + (targetY - startY) * eased;
            this.rotationX = startX + (targetX - startX) * eased;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
};

// 兼容层
const Earth3D = {
    init: function() { return WireframeGlobe.init.apply(WireframeGlobe, arguments); },
    set onCityClick(callback) { WireframeGlobe.onCityClick = callback; },
    set onCityHover(callback) { WireframeGlobe.onCityHover = callback; },
    focusOnCity: function(city) { WireframeGlobe.focusOnCity(city); }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WireframeGlobe, Earth3D };
}
