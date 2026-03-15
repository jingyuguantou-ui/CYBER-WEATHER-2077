// 3D Earth Module using Three.js - 赛博朋克版
const Earth3D = {
    scene: null, camera: null, renderer: null, controls: null,
    earth: null, markers: [], markerGlows: [], raycaster: null, mouse: null,
    atmosphere: null, gridLines: null,
    cityStars: [], // 城市星星
    windParticles: [], // 风速粒子
    temperatureBands: [], // 温度色带
    isDay: false,
    onCityClick: null,
    onCityHover: null,
    hoveredCity: null,

    init() {
        const container = document.getElementById('earth-container');
        const canvas = document.getElementById('earth-canvas');

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 3;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Controls - 增强移动端支持
        this.controls = new THREE.OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.enableZoom = true;
        this.controls.minDistance = 1.5;
        this.controls.maxDistance = 5;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.3;
        
        // 移动端优化
        this.controls.enablePan = false; // 禁用平移，避免误操作
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.rotateSpeed = 0.5;
        
        // 触摸手势配置
        if ('ontouchstart' in window) {
            this.controls.touches = {
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_ROTATE
            };
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(5, 3, 5);
        this.scene.add(sunLight);

        const blueLight = new THREE.PointLight(0x05d9e8, 0.5, 10);
        blueLight.position.set(-3, 2, 2);
        this.scene.add(blueLight);

        const pinkLight = new THREE.PointLight(0xff2a6d, 0.3, 10);
        pinkLight.position.set(3, -2, 2);
        this.scene.add(pinkLight);

        // Create Earth
        this.createEarth();

        // 添加温度色带
        this.createTemperatureBands();

        // 添加风速粒子
        this.createWindParticles();

        // Raycaster for interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // 触摸相关变量
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isTouchMoved = false;

        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        canvas.addEventListener('click', (e) => this.onClick(e));
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // 触摸事件支持
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.touchStartX = e.touches[0].clientX;
                this.touchStartY = e.touches[0].clientY;
                this.isTouchMoved = false;
            }
        }, { passive: true });
        
        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const dx = e.touches[0].clientX - this.touchStartX;
                const dy = e.touches[0].clientY - this.touchStartY;
                if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                    this.isTouchMoved = true;
                }
            }
        }, { passive: true });
        
        canvas.addEventListener('touchend', (e) => {
            // 如果触摸没有移动，则视为点击
            if (!this.isTouchMoved && e.changedTouches.length === 1) {
                const touch = e.changedTouches[0];
                const mockEvent = {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    target: canvas
                };
                this.onClick(mockEvent);
            }
        });

        // Start animation
        this.animate();
    },

    createEarth() {
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const textureLoader = new THREE.TextureLoader();

        // 夜间模式 - 深色地球（赛博朋克2077风格）
        const nightTexture = textureLoader.load(
            'https://unpkg.com/three-globe/example/img/earth-night.jpg',
            () => {
                // 纹理加载成功
                console.log('Night texture loaded');
            },
            undefined,
            () => {
                // 纹理加载失败，使用马赛克fallback
                console.log('Night texture failed, using mosaic fallback');
                this.createMosaicEarth();
            }
        );

        // 白天模式 - 蓝色星球（苹果地图风格）
        const dayTexture = textureLoader.load(
            'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
            () => {},
            undefined,
            () => {}
        );

        const bumpTexture = textureLoader.load(
            'https://unpkg.com/three-globe/example/img/earth-topology.png',
            () => {},
            undefined,
            () => {}
        );

        // 默认使用夜间纹理
        const material = new THREE.MeshPhongMaterial({
            map: nightTexture,
            bumpMap: bumpTexture,
            bumpScale: 0.02,
            specular: new THREE.Color(0x111111),
            shininess: 5
        });

        this.earth = new THREE.Mesh(geometry, material);
        this.earth.userData.nightTexture = nightTexture;
        this.earth.userData.dayTexture = dayTexture;
        this.scene.add(this.earth);

        // 添加线条网格（赛博朋克风格）
        this.addGridLines();

        // 添加城市星星标记
        this.addCityStars();

        // 添加大气层光晕
        this.addAtmosphere();
    },

    // 马赛克风格地球fallback
    createMosaicEarth() {
        if (!this.earth) return;

        // 使用着色器创建马赛克效果
        const mosaicMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x05d9e8) },
                color2: { value: new THREE.Color(0xff2a6d) },
                color3: { value: new THREE.Color(0x0a0a12) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                
                void main() {
                    vUv = uv;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                varying vec2 vUv;
                varying vec3 vNormal;
                
                // 简单噪声函数
                float noise(vec2 p) {
                    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                }
                
                void main() {
                    // 马赛克格子大小
                    vec2 gridSize = vec2(20.0, 20.0);
                    vec2 grid = floor(vUv * gridSize) / gridSize;
                    
                    // 每个格子随机颜色
                    float n = noise(grid * 100.0 + time * 0.1);
                    
                    vec3 color;
                    if (n < 0.3) {
                        color = color1;
                    } else if (n < 0.6) {
                        color = color2;
                    } else {
                        color = color3;
                    }
                    
                    // 边缘发光
                    float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
                    color += edge * color1 * 0.3;
                    
                    // 闪烁效果
                    float flicker = sin(time * 3.0 + n * 10.0) * 0.1 + 0.9;
                    color *= flicker;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });

        this.earth.material = mosaicMaterial;
        this.earth.userData.isMosaic = true;
    },

    // 将城市标记升级为四芒星
    addCityStars() {
        C.forEach((city, index) => {
            const { lat, la, lng, lo, n: name } = city;
            const phi = (90 - (la || lat)) * (Math.PI / 180);
            const theta = ((lo || lng) + 180) * (Math.PI / 180);

            const r = 1.02;
            const x = -r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.cos(phi);
            const z = r * Math.sin(phi) * Math.sin(theta);

            // 创建四芒星几何体（菱形）
            const starGroup = new THREE.Group();
            
            // 不可见的点击区域（增大点击检测范围）
            const hitAreaGeo = new THREE.SphereGeometry(0.025, 8, 8);
            const hitAreaMat = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0,
                depthWrite: false
            });
            const hitArea = new THREE.Mesh(hitAreaGeo, hitAreaMat);
            hitArea.userData.city = city;
            starGroup.add(hitArea);
            
            // 中心光点
            const centerGeo = new THREE.SphereGeometry(0.008, 8, 8);
            const centerMat = new THREE.MeshBasicMaterial({
                color: 0xff2a6d,
                transparent: true,
                opacity: 1
            });
            const center = new THREE.Mesh(centerGeo, centerMat);
            starGroup.add(center);

            // 四芒星四个尖角（缩小15%）
            const spikeLength = 0.034; // 原始0.04，缩小15%后约0.034
            const spikeWidth = 0.007; // 宽度也相应缩小
            const spikeMat = new THREE.MeshBasicMaterial({
                color: 0xff2a6d,
                transparent: true,
                opacity: 0.8
            });

            // 上尖角
            const spike1 = new THREE.Mesh(
                new THREE.ConeGeometry(spikeWidth, spikeLength, 4),
                spikeMat.clone()
            );
            spike1.position.y = spikeLength / 2;
            starGroup.add(spike1);

            // 下尖角
            const spike2 = new THREE.Mesh(
                new THREE.ConeGeometry(spikeWidth, spikeLength, 4),
                spikeMat.clone()
            );
            spike2.position.y = -spikeLength / 2;
            spike2.rotation.z = Math.PI;
            starGroup.add(spike2);

            // 左尖角
            const spike3 = new THREE.Mesh(
                new THREE.ConeGeometry(spikeWidth, spikeLength, 4),
                spikeMat.clone()
            );
            spike3.position.x = -spikeLength / 2;
            spike3.rotation.z = -Math.PI / 2;
            starGroup.add(spike3);

            // 右尖角
            const spike4 = new THREE.Mesh(
                new THREE.ConeGeometry(spikeWidth, spikeLength, 4),
                spikeMat.clone()
            );
            spike4.position.x = spikeLength / 2;
            spike4.rotation.z = Math.PI / 2;
            starGroup.add(spike4);

            // 十字光芒（增强效果）- 缩小15%
            const crossGroup = new THREE.Group();
            const crossMat = new THREE.MeshBasicMaterial({
                color: 0xff2a6d,
                transparent: true,
                opacity: 0.3
            });
            
            // 水平光芒（更长）
            const hCross = new THREE.Mesh(
                new THREE.PlaneGeometry(0.102, 0.0025), // 0.12 * 0.85 ≈ 0.102
                crossMat
            );
            // 垂直光芒
            const vCross = new THREE.Mesh(
                new THREE.PlaneGeometry(0.0025, 0.102),
                crossMat.clone()
            );
            // 对角光芒（新增）
            const dCross1 = new THREE.Mesh(
                new THREE.PlaneGeometry(0.068, 0.0017), // 0.08 * 0.85 ≈ 0.068
                crossMat.clone()
            );
            dCross1.rotation.z = Math.PI / 4;
            const dCross2 = new THREE.Mesh(
                new THREE.PlaneGeometry(0.068, 0.0017),
                crossMat.clone()
            );
            dCross2.rotation.z = -Math.PI / 4;
            
            crossGroup.add(hCross);
            crossGroup.add(vCross);
            crossGroup.add(dCross1);
            crossGroup.add(dCross2);

            // 设置位置和朝向
            starGroup.position.set(x, y, z);
            crossGroup.position.set(x, y, z);
            crossGroup.lookAt(0, 0, 0);

            // 存储用户数据
            starGroup.userData = { 
                city, 
                baseColor: new THREE.Color(0xff2a6d),
                baseOpacity: 1,
                index: index,
                center,
                spikes: [spike1, spike2, spike3, spike4]
            };
            crossGroup.userData = { baseOpacity: 0.3 };

            this.earth.add(starGroup);
            this.earth.add(crossGroup);

            this.markers.push(starGroup);
            this.markerGlows.push({ cross: crossGroup });
        });
    },

    // 根据距离更新星星亮度
    updateMarkerBrightness() {
        if (!this.camera) return;

        const cameraPos = this.camera.position.clone();

        this.markers.forEach((starGroup, i) => {
            const worldPos = new THREE.Vector3();
            starGroup.getWorldPosition(worldPos);

            const distance = cameraPos.distanceTo(worldPos);

            // 距离越近越亮
            const normalizedDist = Math.max(0, Math.min(1, (distance - 1.5) / 3.5));
            const brightness = 1 - normalizedDist;

            // 夜间模式 - 粉红/青色
            const nightColor = new THREE.Color(0xff2a6d);
            const nightDim = new THREE.Color(0x331122);

            // 白天模式 - 亮蓝色
            const dayColor = new THREE.Color(0x00d4ff);
            const dayDim = new THREE.Color(0x003344);

            // 更新中心点和尖角颜色
            const { center, spikes } = starGroup.userData;
            if (center) {
                if (this.isDay) {
                    center.material.color.lerpColors(dayDim, dayColor, brightness);
                    center.material.opacity = 0.6 + brightness * 0.4;
                } else {
                    center.material.color.lerpColors(nightDim, nightColor, brightness);
                    center.material.opacity = 0.4 + brightness * 0.6;
                }
            }
            if (spikes) {
                spikes.forEach(spike => {
                    if (this.isDay) {
                        spike.material.color.lerpColors(dayDim, dayColor, brightness);
                        spike.material.opacity = brightness * 0.8;
                    } else {
                        spike.material.color.lerpColors(nightDim, nightColor, brightness);
                        spike.material.opacity = brightness * 0.7;
                    }
                });
            }

            // 更新十字光芒
            const { cross } = this.markerGlows[i];
            if (this.isDay) {
                cross.children.forEach(c => {
                    c.material.color.lerpColors(dayDim, dayColor, brightness);
                    c.material.opacity = brightness * 0.4;
                });
            } else {
                cross.children.forEach(c => {
                    c.material.color.lerpColors(nightDim, nightColor, brightness);
                    c.material.opacity = brightness * 0.3;
                });
            }
        });
    },

    // 创建温度色带可视化
    createTemperatureBands() {
        // 温度色带：沿地球表面的热力渐变
        // 赤道红色，极地蓝色
        const bandCount = 12;
        this.temperatureBands = [];

        for (let i = 0; i < bandCount; i++) {
            const lat = (i / bandCount) * Math.PI - Math.PI / 2;
            const r = 1.005;
            
            // 温度颜色：赤道(红色) -> 极地(蓝色)
            const tempRatio = Math.abs(lat) / (Math.PI / 2);
            const color = new THREE.Color();
            color.setHSL(0.6 - tempRatio * 0.6, 1, 0.5); // 红色到蓝色

            const geometry = new THREE.TorusGeometry(
                Math.cos(lat) * r, 
                0.003, 
                8, 
                64
            );
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.15
            });
            
            const band = new THREE.Mesh(geometry, material);
            band.position.y = Math.sin(lat) * r;
            band.rotation.x = Math.PI / 2;
            band.userData = { baseOpacity: 0.15 };
            
            this.earth.add(band);
            this.temperatureBands.push(band);
        }
    },

    // 创建风速粒子流
    createWindParticles() {
        // 为每个城市创建风速粒子
        C.forEach((city, index) => {
            if (index >= 20) return; // 限制数量以保证性能
            
            const { lat, la, lng, lo } = city;
            const phi = (90 - (la || lat)) * (Math.PI / 180);
            const theta = ((lo || lng) + 180) * (Math.PI / 180);

            const r = 1.03;
            const startX = -r * Math.sin(phi) * Math.cos(theta);
            const startY = r * Math.cos(phi);
            const startZ = r * Math.sin(phi) * Math.sin(theta);

            // 创建粒子流
            const particleCount = 15;
            const particles = [];

            for (let i = 0; i < particleCount; i++) {
                const geometry = new THREE.SphereGeometry(0.003, 4, 4);
                const material = new THREE.MeshBasicMaterial({
                    color: 0x00ff88,
                    transparent: true,
                    opacity: 0
                });
                const particle = new THREE.Mesh(geometry, material);
                
                // 随机偏移
                particle.position.set(
                    startX + (Math.random() - 0.5) * 0.05,
                    startY + (Math.random() - 0.5) * 0.05,
                    startZ + (Math.random() - 0.5) * 0.05
                );
                
                particle.userData = {
                    baseX: particle.position.x,
                    baseY: particle.position.y,
                    baseZ: particle.position.z,
                    offset: Math.random() * Math.PI * 2,
                    speed: 0.5 + Math.random() * 0.5
                };

                this.earth.add(particle);
                particles.push(particle);
            }

            this.windParticles.push(particles);
        });
    },

    // 更新风速粒子动画
    updateWindParticles(time) {
        this.windParticles.forEach((particles, cityIndex) => {
            const city = C[cityIndex];
            const windSpeed = city.windSpeed || 3; // 默认风速

            particles.forEach((particle, i) => {
                const { baseX, baseY, baseZ, offset, speed } = particle.userData;
                
                // 螺旋向外流动
                const t = ((time * speed + offset) % 3) / 3;
                const factor = 0.1 + t * 0.15;

                particle.position.x = baseX + Math.sin(time * 2 + offset) * factor;
                particle.position.y = baseY + Math.cos(time * 1.5 + offset) * factor;
                particle.position.z = baseZ + Math.sin(time * 1.8 + offset * 0.7) * factor;

                // 透明度：淡入淡出
                const opacity = Math.sin(t * Math.PI) * 0.6 * (windSpeed / 10);
                particle.material.opacity = Math.max(0, Math.min(1, opacity));

                // 颜色随距离变化
                particle.material.color.setHSL(0.4 - t * 0.2, 1, 0.5);
            });
        });
    },

    addGridLines() {
        this.gridLines = new THREE.Group();

        // 经线
        for (let i = 0; i < 24; i++) {
            const geometry = new THREE.TorusGeometry(1.002, 0.002, 8, 64);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x05d9e8, 
                transparent: true, 
                opacity: 0.2 
            });
            const torus = new THREE.Mesh(geometry, material);
            torus.rotation.y = (i / 24) * Math.PI * 2;
            this.gridLines.add(torus);
        }

        // 纬线
        for (let i = 1; i < 12; i++) {
            const lat = (i / 12) * Math.PI - Math.PI / 2;
            const r = Math.cos(lat) * 1.002;
            const y = Math.sin(lat) * 1.002;
            
            const geometry = new THREE.TorusGeometry(r, 0.002, 8, 64);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x05d9e8, 
                transparent: true, 
                opacity: 0.15 
            });
            const torus = new THREE.Mesh(geometry, material);
            torus.position.y = y;
            torus.rotation.x = Math.PI / 2;
            this.gridLines.add(torus);
        }

        this.scene.add(this.gridLines);
    },

    addAtmosphere() {
        // 夜间大气层 - 赛博朋克粉蓝
        const nightAtmoGeo = new THREE.SphereGeometry(1.08, 64, 64);
        const nightAtmoMat = new THREE.MeshBasicMaterial({
            color: 0x05d9e8,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        this.atmosphere = new THREE.Mesh(nightAtmoGeo, nightAtmoMat);
        this.scene.add(this.atmosphere);

        // 外层光晕
        const outerGlowGeo = new THREE.SphereGeometry(1.15, 32, 32);
        const outerGlowMat = new THREE.MeshBasicMaterial({
            color: 0xff2a6d,
            transparent: true,
            opacity: 0.05,
            side: THREE.BackSide
        });
        const outerGlow = new THREE.Mesh(outerGlowGeo, outerGlowMat);
        this.scene.add(outerGlow);
    },

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();

        const time = Date.now() * 0.001;

        // 更新马赛克地球着色器
        if (this.earth && this.earth.userData.isMosaic && this.earth.material.uniforms) {
            this.earth.material.uniforms.time.value = time;
        }

        // 更新标记亮度
        this.updateMarkerBrightness();

        // 四芒星脉冲动画
        this.markers.forEach((starGroup, i) => {
            const pulse = Math.sin(time * 2 + i * 0.5) * 0.15 + 1;
            starGroup.scale.setScalar(pulse);
            
            // 十字光芒旋转
            const { cross } = this.markerGlows[i];
            if (cross) {
                cross.rotation.z = time * 0.3;
            }
        });

        // 更新风速粒子
        this.updateWindParticles(time);

        // 温度色带动画
        this.temperatureBands.forEach((band, i) => {
            const pulse = Math.sin(time * 0.5 + i * 0.3) * 0.05 + 0.15;
            band.material.opacity = pulse;
        });

        this.renderer.render(this.scene, this.camera);
    },

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    onClick(event) {
        const rect = event.target.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // 获取所有可点击的子对象
        const clickableObjects = [];
        this.markers.forEach(starGroup => {
            starGroup.traverse(child => {
                if (child.isMesh) {
                    child.userData.parentCity = starGroup.userData.city;
                    clickableObjects.push(child);
                }
            });
        });
        
        const intersects = this.raycaster.intersectObjects(clickableObjects);

        if (intersects.length > 0 && this.onCityClick) {
            const city = intersects[0].object.userData.parentCity || intersects[0].object.userData.city;
            if (city) {
                this.onCityClick(city);
            }
        }
    },

    onMouseMove(event) {
        const rect = event.target.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // 获取所有可点击的子对象
        const clickableObjects = [];
        this.markers.forEach(starGroup => {
            starGroup.traverse(child => {
                if (child.isMesh) {
                    child.userData.parentCity = starGroup.userData.city;
                    clickableObjects.push(child);
                }
            });
        });
        
        const intersects = this.raycaster.intersectObjects(clickableObjects);

        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
            const city = intersects[0].object.userData.parentCity || intersects[0].object.userData.city;
            
            // 如果悬停的城市变了，触发回调
            if (this.hoveredCity !== city && this.onCityHover) {
                this.hoveredCity = city;
                this.onCityHover(city, event.clientX, event.clientY);
            }
        } else {
            document.body.style.cursor = 'default';
            if (this.hoveredCity && this.onCityHover) {
                this.hoveredCity = null;
                this.onCityHover(null);
            }
        }
    },

    focusOnCity(city) {
        const { lat, la, lng, lo } = city;
        const phi = (90 - (la || lat)) * (Math.PI / 180);
        const theta = ((lo || lng) + 180) * (Math.PI / 180);

        const x = -Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);

        // 动画移动到目标位置
        const targetPos = new THREE.Vector3(x * 2, y * 2, z * 2);

        // 禁用自动旋转
        this.controls.autoRotate = false;

        // 相机动画
        const startPos = this.camera.position.clone();
        const duration = 1500;
        const startTime = Date.now();

        const animateCam = () => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            const easeT = 1 - Math.pow(1 - t, 3);

            this.camera.position.lerpVectors(startPos, targetPos, easeT);
            this.controls.update();

            if (t < 1) requestAnimationFrame(animateCam);
        };
        animateCam();
    },

    setTheme(isDay) {
        if (!this.earth) return;

        this.isDay = isDay;

        if (isDay) {
            // 白天模式 - 苹果地图蓝色星球
            this.earth.material.map = this.earth.userData.dayTexture;
            this.earth.material.specular.setHex(0x333333);
            this.earth.material.shininess = 25;

            // 网格线变亮蓝色
            if (this.gridLines) {
                this.gridLines.children.forEach(line => {
                    line.material.color.setHex(0x00a0ff);
                    line.material.opacity = 0.25;
                });
            }

            // 大气层变亮
            if (this.atmosphere) {
                this.atmosphere.material.color.setHex(0x00a0ff);
                this.atmosphere.material.opacity = 0.2;
            }
        } else {
            // 夜间模式 - 赛博朋克2077
            this.earth.material.map = this.earth.userData.nightTexture;
            this.earth.material.specular.setHex(0x111111);
            this.earth.material.shininess = 5;

            // 网格线变暗霓虹
            if (this.gridLines) {
                this.gridLines.children.forEach(line => {
                    line.material.color.setHex(0x05d9e8);
                    line.material.opacity = 0.15;
                });
            }

            // 大气层变暗
            if (this.atmosphere) {
                this.atmosphere.material.color.setHex(0x05d9e8);
                this.atmosphere.material.opacity = 0.12;
            }
        }

        this.earth.material.needsUpdate = true;
    }
};
