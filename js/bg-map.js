/**
 * Background World Map - 线框世界地图背景
 */

const BgMap = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    
    init() {
        this.canvas = document.getElementById('bg-map-canvas');
        if (!this.canvas) {
            console.warn('Background map canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.draw();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.draw();
        });
    },
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    
    draw() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        
        // 清除
        ctx.clearRect(0, 0, w, h);
        
        // 绘制经纬线网格
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.03)';
        ctx.lineWidth = 1;
        
        // 经线 (每20度)
        for (let lng = -180; lng <= 180; lng += 30) {
            const x = ((lng + 180) / 360) * w;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        
        // 纬线 (每20度)
        for (let lat = -80; lat <= 80; lat += 20) {
            const y = ((90 - lat) / 180) * h;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        // 绘制大洲轮廓
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
        ctx.lineWidth = 1.5;
        
        const continents = this.getContinents();
        
        for (const continent of continents) {
            ctx.beginPath();
            const startX = ((continent.points[0][0] + 180) / 360) * w;
            const startY = ((90 - continent.points[0][1]) / 180) * h;
            ctx.moveTo(startX, startY);
            
            for (let i = 1; i < continent.points.length; i++) {
                const x = ((continent.points[i][0] + 180) / 360) * w;
                const y = ((90 - continent.points[i][1]) / 180) * h;
                ctx.lineTo(x, y);
            }
            
            ctx.closePath();
            
            // 填充
            ctx.fillStyle = 'rgba(0, 255, 136, 0.02)';
            ctx.fill();
            
            // 描边
            ctx.stroke();
        }
    },
    
    getContinents() {
        return [
            // 北美洲
            {
                points: [
                    [-170, 65], [-165, 70], [-140, 70], [-120, 72], [-95, 75],
                    [-72, 78], [-60, 75], [-52, 48], [-56, 47], [-68, 44],
                    [-75, 35], [-80, 25], [-95, 20], [-105, 22], [-118, 32],
                    [-125, 40], [-130, 50], [-145, 58], [-165, 60], [-170, 65]
                ]
            },
            // 格陵兰
            {
                points: [
                    [-75, 60], [-60, 55], [-45, 60], [-25, 70], [-20, 80],
                    [-35, 83], [-55, 82], [-70, 78], [-75, 60]
                ]
            },
            // 南美洲
            {
                points: [
                    [-80, 10], [-70, 5], [-50, 0], [-45, -10], [-35, -25],
                    [-55, -25], [-60, -40], [-70, -55], [-75, -45], [-70, -30],
                    [-75, -15], [-80, 0], [-80, 10]
                ]
            },
            // 欧洲
            {
                points: [
                    [-10, 35], [0, 40], [5, 50], [-5, 58], [10, 60],
                    [25, 62], [35, 70], [30, 60], [40, 55], [50, 50],
                    [40, 40], [30, 35], [15, 38], [-10, 35]
                ]
            },
            // 非洲
            {
                points: [
                    [-15, 35], [10, 35], [35, 30], [50, 12], [55, 0],
                    [45, -15], [35, -30], [25, -35], [10, -25], [-5, 5],
                    [-20, 15], [-15, 35]
                ]
            },
            // 俄罗斯/亚洲北部
            {
                points: [
                    [30, 55], [50, 55], [80, 60], [120, 65], [160, 65],
                    [180, 65], [180, 75], [140, 75], [100, 78], [60, 75],
                    [30, 70], [30, 55]
                ]
            },
            // 亚洲
            {
                points: [
                    [60, 35], [80, 30], [100, 25], [115, 22], [125, 32],
                    [135, 40], [145, 45], [140, 50], [125, 50], [110, 45],
                    [95, 40], [80, 35], [60, 35]
                ]
            },
            // 印度
            {
                points: [
                    [65, 25], [75, 28], [88, 25], [90, 22], [85, 8],
                    [75, 8], [68, 18], [65, 25]
                ]
            },
            // 东南亚
            {
                points: [
                    [95, 18], [105, 12], [115, 8], [125, 8], [135, 5],
                    [140, 5], [145, 8], [140, 15], [130, 18], [120, 15],
                    [110, 15], [100, 18], [95, 18]
                ]
            },
            // 澳大利亚
            {
                points: [
                    [115, -22], [130, -12], [145, -15], [150, -25],
                    [152, -35], [145, -40], [130, -35], [120, -30], [115, -22]
                ]
            },
            // 新西兰
            {
                points: [
                    [168, -38], [175, -35], [178, -42], [172, -47], [165, -45], [168, -38]
                ]
            },
            // 日本
            {
                points: [
                    [130, 32], [135, 35], [140, 38], [142, 45], [138, 48],
                    [132, 45], [130, 38], [130, 32]
                ]
            }
        ];
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    BgMap.init();
});
