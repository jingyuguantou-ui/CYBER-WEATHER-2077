/**
 * Dot Globe Module - 点阵地球
 * 赛博朋克风格 - 点云/粒子构成球面和大洲
 */

const DotGlobe = {
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
    rotationX: 0.15,
    autoRotateSpeed: 0.002,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    dragSpeedX: 0.005,
    dragSpeedY: 0.003,
    
    // 缩放
    zoom: 1,
    minZoom: 0.6,
    maxZoom: 2,
    zoomSpeed: 0.1,
    
    // 点阵数据
    dots: [],
    landDots: [],
    gridDensity: 30, // 球面点密度
    
    // 城市数据
    cities: [],
    hoveredCity: null,
    selectedCity: null,
    cityMarkers: [],
    
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
        console.log('Dot Globe initializing...');
        
        this.canvas = document.getElementById('earth-canvas');
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.generateDots();
        this.initCities();
        this.bindEvents();
        this.animate();
        this.isLoaded = true;
        
        console.log('Dot Globe ready');
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
        
        // 球体大小
        const minDim = Math.min(this.width, this.height);
        this.radius = minDim * 0.38;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        
        // 重新生成点阵
        if (this.isLoaded) {
            this.generateDots();
        }
    },
    
    generateDots() {
        this.dots = [];
        this.landDots = [];
        
        // 大洲颜色定义
        const continentColors = {
            northAmerica: { color: '#00ff88', name: '北美洲' },
            southAmerica: { color: '#ffd700', name: '南美洲' },
            europe: { color: '#00d4ff', name: '欧洲' },
            africa: { color: '#ff6b6b', name: '非洲' },
            asia: { color: '#b8ff00', name: '亚洲' },
            australia: { color: '#ff00ff', name: '澳大利亚' },
            antarctica: { color: '#88ccff', name: '南极洲' }
        };
        
        // 生成球面网格点
        const density = this.gridDensity;
        for (let lat = -85; lat <= 85; lat += 180 / density) {
            const latRad = lat * Math.PI / 180;
            const circumference = Math.cos(latRad);
            const pointsAtLat = Math.max(3, Math.floor(density * circumference));
            
            for (let i = 0; i < pointsAtLat; i++) {
                const lng = (i / pointsAtLat) * 360 - 180;
                
                const continent = this.getContinent(lat, lng);
                
                this.dots.push({
                    lat: lat,
                    lng: lng,
                    continent: continent,
                    color: continent ? continentColors[continent]?.color : null,
                    isLand: !!continent
                });
            }
        }
        
        // 为陆地点增加额外密度
        for (let lat = -85; lat <= 85; lat += 4) {
            for (let lng = -180; lng < 180; lng += 4) {
                const continent = this.getContinent(lat, lng);
                if (continent) {
                    // 添加偏移创建更密集的陆地效果
                    const offsetLat = lat + (Math.random() - 0.5) * 3;
                    const offsetLng = lng + (Math.random() - 0.5) * 3;
                    
                    this.landDots.push({
                        lat: offsetLat,
                        lng: offsetLng,
                        color: continentColors[continent]?.color || '#00ff88',
                        size: 1 + Math.random() * 0.5,
                        pulse: Math.random() * Math.PI * 2
                    });
                }
            }
        }
        
        this.continentColors = continentColors;
    },
    
    getContinent(lat, lng) {
        // 简化的大洲边界检测
        // 北美洲
        if (lng >= -170 && lng <= -50 && lat >= 15 && lat <= 85) {
            if (lng >= -170 && lng <= -60 && lat >= 25) return 'northAmerica';
            if (lng >= -130 && lng <= -60 && lat >= 15 && lat <= 50) return 'northAmerica';
        }
        // 格陵兰
        if (lng >= -75 && lng <= -10 && lat >= 60 && lat <= 85) return 'northAmerica';
        
        // 南美洲
        if (lng >= -85 && lng <= -30 && lat >= -60 && lat <= 15) {
            return 'southAmerica';
        }
        
        // 欧洲
        if (lng >= -15 && lng <= 60 && lat >= 35 && lat <= 72) {
            return 'europe';
        }
        
        // 非洲
        if (lng >= -20 && lng <= 55 && lat >= -40 && lat <= 38) {
            return 'africa';
        }
        
        // 亚洲
        if (lng >= 25 && lng <= 180 && lat >= 5 && lat <= 80) {
            // 排除印度、东南亚等单独处理的区域
            if (lat >= 45 && lng >= 60) return 'asia';
            if (lat >= 20 && lng >= 90) return 'asia';
            if (lat >= 5 && lng >= 100) return 'asia';
        }
        // 日本
        if (lng >= 130 && lng <= 145 && lat >= 30 && lat <= 46) return 'asia';
        // 印度
        if (lng >= 68 && lng <= 90 && lat >= 6 && lat <= 35) return 'asia';
        // 中东
        if (lng >= 35 && lng <= 65 && lat >= 12 && lat <= 42) return 'asia';
        
        // 俄罗斯
        if (lng >= 60 && lng <= 180 && lat >= 50 && lat <= 80) return 'asia';
        
        // 澳大利亚
        if (lng >= 110 && lng <= 155 && lat >= -45 && lat <= -10) {
            return 'australia';
        }
        // 新西兰
        if (lng >= 165 && lng <= 180 && lat >= -48 && lat <= -33) return 'australia';
        
        // 南极洲
        if (lat <= -62) return 'antarctica';
        
        return null;
    },
    
    latLngTo3D(lat, lng) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lng + 180) * Math.PI / 180;
        
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
        
        return { x, y, z };
    },
    
    rotate3D(point) {
        // Y轴旋转
        const cosY = Math.cos(this.rotationY);
        const sinY = Math.sin(this.rotationY);
        let x = point.x * cosY - point.z * sinY;
        let z = point.x * sinY + point.z * cosY;
        
        // X轴旋转
        const cosX = Math.cos(this.rotationX);
        const sinX = Math.sin(this.rotationX);
        let y = point.y * cosX - z * sinX;
        z = point.y * sinX + z * cosX;
        
        return { x, y, z };
    },
    
    project3D(point3D) {
        const r = this.radius * this.zoom;
        const x = this.centerX + r * point3D.x;
        const y = this.centerY - r * point3D.y;
        
        return { x, y, z: point3D.z };
    },
    
    initCities() {
        // 使用全局城市数据（cities.js 中的 C 数组），仅取 Tier1/2 显示在地球上避免太密集
        if (typeof C !== 'undefined' && C.length) {
            this.cities = C.filter(c => c.tier <= 2);
        } else {
            // fallback：硬编码几个主要城市
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
                { n: "新加坡", ne: "Singapore", c: "SG", la: 1.3, lo: 103.8 }
            ];
        }
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
        
        // 触摸支持
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.isDragging = true;
                this.lastMouseX = e.touches[0].clientX;
                this.lastMouseY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && this.isDragging) {
                const deltaX = e.touches[0].clientX - this.lastMouseX;
                const deltaY = e.touches[0].clientY - this.lastMouseY;
                
                this.rotationY += deltaX * this.dragSpeedX;
                this.rotationX += deltaY * this.dragSpeedY;
                this.rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.rotationX));
                
                this.lastMouseX = e.touches[0].clientX;
                this.lastMouseY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        this.canvas.addEventListener('touchend', () => {
            this.isDragging = false;
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
                
                if (dist < 20) {
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
        const point3D = this.latLngTo3D(lat, lng);
        const rotated = this.rotate3D(point3D);
        
        if (rotated.z < -0.1) return null;
        
        return this.project3D(rotated);
    },
    
    animate() {
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;
        
        if (elapsed >= this.frameInterval) {
            this.lastFrameTime = now;
            
            // 未拖拽且未在聚焦动画中才自动旋转
            if (!this.isDragging && !this._focusing) {
                this.rotationY += this.autoRotateSpeed;
            }
            
            this.time++;
            this.render();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    render() {
        // 清除画布
        this.ctx.fillStyle = '#030508';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制球面网格点（海洋）
        this.renderOceanDots();
        
        // 绘制陆地点
        this.renderLandDots();
        
        // 绘制城市
        this.renderCities();
        
        // 绘制球体轮廓光晕
        this.renderGlobeGlow();
    },
    
    renderOceanDots() {
        const baseAlpha = 0.15;
        
        for (const dot of this.dots) {
            if (dot.isLand) continue;
            
            const point3D = this.latLngTo3D(dot.lat, dot.lng);
            const rotated = this.rotate3D(point3D);
            
            // 只绘制朝向观察者的点
            if (rotated.z < 0) continue;
            
            const projected = this.project3D(rotated);
            
            // 根据深度调整透明度
            const depthAlpha = baseAlpha * (0.3 + rotated.z * 0.7);
            
            // 距离球心边缘的透明度衰减
            const edgeDist = 1 - rotated.z;
            const edgeAlpha = depthAlpha * (1 - edgeDist * 0.5);
            
            this.ctx.beginPath();
            this.ctx.arc(projected.x, projected.y, 1.2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 136, ${edgeAlpha})`;
            this.ctx.fill();
        }
    },
    
    renderLandDots() {
        // 合并所有陆地点并按深度排序
        const allLandDots = [];
        
        // 从网格点获取的陆地
        for (const dot of this.dots) {
            if (!dot.isLand) continue;
            
            const point3D = this.latLngTo3D(dot.lat, dot.lng);
            const rotated = this.rotate3D(point3D);
            
            if (rotated.z < 0) continue;
            
            allLandDots.push({
                x: rotated.x,
                y: rotated.y,
                z: rotated.z,
                color: dot.color,
                size: 2,
                pulse: 0
            });
        }
        
        // 额外密度的陆地点
        for (const dot of this.landDots) {
            const point3D = this.latLngTo3D(dot.lat, dot.lng);
            const rotated = this.rotate3D(point3D);
            
            if (rotated.z < 0) continue;
            
            allLandDots.push({
                x: rotated.x,
                y: rotated.y,
                z: rotated.z,
                color: dot.color,
                size: dot.size,
                pulse: dot.pulse
            });
        }
        
        // 按深度排序（远到近）
        allLandDots.sort((a, b) => a.z - b.z);
        
        // 绘制
        for (const dot of allLandDots) {
            const projected = this.project3D({ x: dot.x, y: dot.y, z: dot.z });
            
            // 脉冲效果
            const pulse = Math.sin(this.time * 0.05 + dot.pulse) * 0.15 + 1;
            const size = dot.size * pulse;
            
            // 深度影响透明度和大小
            const depthFactor = 0.5 + dot.z * 0.5;
            const alpha = 0.7 + depthFactor * 0.3;
            
            this.ctx.beginPath();
            this.ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = dot.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
    },
    
    renderCities() {
        for (const city of this.cities) {
            const pos = this.latLngToScreen(city.la, city.lo);
            if (!pos) continue;
            
            const isHovered  = this.hoveredCity   === city;
            const isSelected = this.selectedCity  === city;
            const pulse = Math.sin(this.time * 0.1) * 0.3 + 0.7;
            
            this.ctx.shadowBlur = 0;
            
            if (isSelected) {
                // --- 选中城市：扩散波纹 + 实心亮点 ---
                const rings = 3;
                for (let i = 0; i < rings; i++) {
                    // 每圈有独立的相位偏移，形成向外扩散的波纹
                    const phase = (this.time * 0.04 + i * (1 / rings)) % 1;
                    const ringR = 6 + phase * 22;
                    const ringAlpha = (1 - phase) * 0.55;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, ringR, 0, Math.PI * 2);
                    this.ctx.strokeStyle = `rgba(0, 255, 136, ${ringAlpha})`;
                    this.ctx.lineWidth = 1.5;
                    this.ctx.stroke();
                }
                // 亮核
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.shadowColor = '#00ff88';
                this.ctx.shadowBlur = 18;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
                // 城市名（始终显示）
                this.ctx.font = 'bold 12px "JetBrains Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = '#00ff88';
                this.ctx.shadowColor = '#00ff88';
                this.ctx.shadowBlur = 8;
                this.ctx.fillText(city.n ? city.n.toUpperCase() : city.ne.toUpperCase(), pos.x, pos.y - 14);
                this.ctx.shadowBlur = 0;
                this.ctx.textAlign = 'left';
                
            } else if (isHovered) {
                // --- 悬停：发光大圆点 ---
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
                this.ctx.fillStyle = '#00ff88';
                this.ctx.shadowColor = '#00ff88';
                this.ctx.shadowBlur = 20;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
                // 城市名
                this.ctx.font = '12px "JetBrains Mono", monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = '#00ff88';
                this.ctx.fillText(city.ne.toUpperCase(), pos.x, pos.y + 20);
                this.ctx.textAlign = 'left';
                
            } else {
                // --- 普通：脉冲小点 ---
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 4 * pulse, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 255, 136, ${0.6 + pulse * 0.4})`;
                this.ctx.fill();
            }
        }

        // 若选中城市不在当前 cities 列表（Tier3-5），单独渲染它的高亮标记
        const sel = this.selectedCity;
        if (sel && !this.cities.includes(sel)) {
            const la = sel.la != null ? sel.la : sel.lat;
            const lo = sel.lo != null ? sel.lo : sel.lng;
            if (la != null && lo != null) {
                const pos = this.latLngToScreen(la, lo);
                if (pos) {
                    const rings = 3;
                    for (let i = 0; i < rings; i++) {
                        const phase = (this.time * 0.04 + i * (1 / rings)) % 1;
                        const ringR = 6 + phase * 22;
                        const ringAlpha = (1 - phase) * 0.55;
                        this.ctx.beginPath();
                        this.ctx.arc(pos.x, pos.y, ringR, 0, Math.PI * 2);
                        this.ctx.strokeStyle = `rgba(0, 255, 136, ${ringAlpha})`;
                        this.ctx.lineWidth = 1.5;
                        this.ctx.stroke();
                    }
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.shadowColor = '#00ff88';
                    this.ctx.shadowBlur = 18;
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                    this.ctx.font = 'bold 12px "JetBrains Mono", monospace';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillStyle = '#00ff88';
                    this.ctx.shadowColor = '#00ff88';
                    this.ctx.shadowBlur = 8;
                    this.ctx.fillText((sel.n || sel.ne).toUpperCase(), pos.x, pos.y - 14);
                    this.ctx.shadowBlur = 0;
                    this.ctx.textAlign = 'left';
                }
            }
        }
    },
    
    renderGlobeGlow() {
        // 球体边缘光晕
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, this.radius * this.zoom * 0.95,
            this.centerX, this.centerY, this.radius * this.zoom * 1.05
        );
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius * this.zoom, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    },
    
    focusOnCity(city) {
        if (!city) return;
        const lat = city.la != null ? city.la : city.lat;
        const lng = city.lo != null ? city.lo : city.lng;
        if (lat == null || lng == null) return;

        // 标记选中城市（用于高亮渲染）
        this.selectedCity = city;

        // 停止自动旋转期间的标志
        this._focusing = true;

        // 目标旋转角度：
        // rotationY 是绕 Y 轴旋转，正值使球向左转（经度越大要越向左）
        // 公式：当 rotationY = 0 时，经度 0 在正面；经度 lng 在正面时需要 rotationY = -lng*PI/180
        const targetY = -lng * (Math.PI / 180);

        // rotationX 控制俯仰：正值向下倾（南半球城市需要负值）
        // 纬度 lat 对应 rotationX = -lat * PI/180（北纬向上，需要负角让球向下倾）
        const targetX = -lat * (Math.PI / 180);
        // clamp X 在 [-PI/2, PI/2] 避免翻转
        const clampedX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetX));

        const startY = this.rotationY;
        const startX = this.rotationX;

        // 计算 Y 轴最短路径（避免绕一大圈）
        let deltaY = targetY - startY;
        // 归一化到 [-PI, PI]
        while (deltaY > Math.PI)  deltaY -= Math.PI * 2;
        while (deltaY < -Math.PI) deltaY += Math.PI * 2;
        const endY = startY + deltaY;

        const deltaX = clampedX - startX;

        // 根据旋转幅度动态调整时长：幅度大则稍慢，最短 600ms 最长 1200ms
        const angle = Math.sqrt(deltaY * deltaY + deltaX * deltaX);
        const duration = Math.min(1200, Math.max(600, angle * 400));

        const startTime = performance.now();

        // 取消之前正在进行的聚焦动画
        if (this._focusRafId) {
            cancelAnimationFrame(this._focusRafId);
            this._focusRafId = null;
        }

        const self = this;
        const step = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);

            // 三阶缓出 + 弹性收尾：先快后慢，到达时有轻微弹跳感
            const eased = t < 1
                ? 1 - Math.pow(1 - t, 3)
                : 1;

            self.rotationY = startY + deltaY * eased;
            self.rotationX = startX + deltaX * eased;

            if (t < 1) {
                self._focusRafId = requestAnimationFrame(step);
            } else {
                // 精确落定
                self.rotationY = endY;
                self.rotationX = clampedX;
                self._focusing = false;
                self._focusRafId = null;
            }
        };

        this._focusRafId = requestAnimationFrame(step);
    }
};

// 兼容层
const Earth3D = {
    init: function() { return DotGlobe.init.apply(DotGlobe, arguments); },
    set onCityClick(callback) { DotGlobe.onCityClick = callback; },
    set onCityHover(callback) { DotGlobe.onCityHover = callback; },
    focusOnCity: function(city) { DotGlobe.focusOnCity(city); }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DotGlobe, Earth3D };
}
