/**
 * 高精度大陆轮廓数据
 * 用于 ASCII 地球精细渲染
 * 
 * 数据格式：多边形顶点经纬度数组
 * 经度: -180 到 180
 * 纬度: -90 到 90
 */

// 陆地区域检测 - 使用简化的矩形区块
const LAND_BLOCKS = [
    // 北美洲
    { latMin: 25, latMax: 72, lngMin: -170, lngMax: -50, name: 'NA' },
    // 南美洲
    { latMin: -56, latMax: 15, lngMin: -82, lngMax: -34, name: 'SA' },
    // 欧洲
    { latMin: 36, latMax: 72, lngMin: -10, lngMax: 60, name: 'EU' },
    // 非洲
    { latMin: -35, latMax: 38, lngMin: -18, lngMax: 52, name: 'AF' },
    // 亚洲
    { latMin: -10, latMax: 78, lngMin: 26, lngMax: 180, name: 'AS' },
    // 澳大利亚
    { latMin: -45, latMax: -10, lngMin: 112, lngMax: 155, name: 'AU' },
    // 格陵兰
    { latMin: 60, latMax: 84, lngMin: -73, lngMax: -12, name: 'GL' },
    // 印度尼西亚
    { latMin: -11, latMax: 6, lngMin: 95, lngMax: 141, name: 'ID' },
    // 日本
    { latMin: 30, latMax: 46, lngMin: 129, lngMax: 146, name: 'JP' },
    // 新西兰
    { latMin: -48, latMax: -34, lngMin: 166, lngMax: 179, name: 'NZ' },
    // 马达加斯加
    { latMin: -26, latMax: -12, lngMin: 43, lngMax: 51, name: 'MG' },
    // 英国
    { latMin: 49, latMax: 61, lngMin: -8, lngMax: 2, name: 'UK' },
    // 冰岛
    { latMin: 63, latMax: 67, lngMin: -25, lngMax: -13, name: 'IC' },
];

// 详细海岸线坐标（用于更精确的海岸检测）
const COASTLINE_POINTS = {
    // 北美西海岸
    northAmericaWest: [
        [-168.5, 65.5], [-166, 60], [-164, 55], [-162, 50], [-160, 45],
        [-155, 40], [-148.5, 35], [-140, 32], [-130, 30], [-125, 35],
        [-122.5, 38], [-118, 34], [-115, 32], [-110, 30]
    ],
    // 北美东海岸
    northAmericaEast: [
        [-80, 25], [-78, 28], [-75, 35], [-70, 42], [-68, 45],
        [-65, 47], [-60, 50], [-55, 52], [-58, 55], [-62, 58]
    ],
    // 南美西海岸
    southAmericaWest: [
        [-80, 10], [-78, 5], [-77, 0], [-80, -5], [-75, -10],
        [-72, -15], [-70, -20], [-68, -25], [-65, -30], [-58, -35],
        [-55, -40], [-50, -45], [-55, -50], [-60, -55], [-65, -55]
    ],
    // 南美东海岸
    southAmericaEast: [
        [-35, -5], [-38, -10], [-40, -20], [-45, -25], [-50, -30],
        [-55, -35], [-60, -40], [-65, -55]
    ],
    // 欧洲海岸线
    europe: [
        [-10, 35], [-5, 38], [0, 40], [5, 43], [3, 47],
        [-5, 48], [-10, 52], [-5, 55], [5, 55], [10, 55],
        [15, 55], [20, 55], [25, 55], [30, 55]
    ],
    // 非洲海岸线
    africa: [
        [-18, 35], [-12, 32], [-8, 30], [-5, 28], [0, 25],
        [5, 22], [10, 18], [12, 12], [15, 8], [18, 5],
        [20, 0], [25, -5], [30, -10], [35, -15], [38, -20],
        [40, -25], [35, -30], [30, -33], [25, -35]
    ],
    // 亚洲海岸线
    asia: [
        [35, 28], [40, 28], [45, 30], [50, 28], [55, 25],
        [60, 25], [65, 25], [70, 25], [75, 25], [80, 8],
        [85, 12], [90, 22], [95, 20], [100, 15], [105, 10],
        [110, 5], [115, 0], [120, -5], [125, -8]
    ],
    // 澳大利亚海岸线
    australia: [
        [115, -20], [120, -18], [125, -15], [130, -12], [135, -12],
        [140, -12], [145, -15], [150, -20], [153, -25], [152, -30],
        [150, -35], [145, -38], [140, -38], [135, -35], [130, -35],
        [125, -32], [120, -30], [115, -25]
    ]
};

// 判断点是否在陆地上（改进版）
function isLand(lat, lng) {
    // 先检查是否在任何陆地区域内
    for (const block of LAND_BLOCKS) {
        if (lat >= block.latMin && lat <= block.latMax &&
            lng >= block.lngMin && lng <= block.lngMax) {
            
            // 排除一些明显的内陆水域
            // 地中海
            if (lat >= 30 && lat <= 46 && lng >= -6 && lng <= 36) {
                // 地中海区域需要更精细判断
                if (lat > 40 && lng > 0 && lng < 25 && lat < 44) {
                    return false; // 地中海中部
                }
            }
            
            // 波斯湾
            if (lat >= 24 && lat <= 30 && lng >= 48 && lng <= 57) {
                if (lat < 28 && lng > 50 && lng < 55) {
                    return false;
                }
            }
            
            // 孟加拉湾
            if (lat >= 10 && lat <= 22 && lng >= 80 && lng <= 92) {
                if (lat < 18 && lng > 85) {
                    return false;
                }
            }
            
            return true;
        }
    }
    
    return false;
}

// 判断点是否靠近海岸线
function isCoast(lat, lng, threshold = 3) {
    for (const [name, points] of Object.entries(COASTLINE_POINTS)) {
        for (const [clng, clat] of points) {
            const dist = Math.sqrt(
                Math.pow((lat - clat) * 1.5, 2) + Math.pow(lng - clng, 2)
            );
            if (dist < threshold) {
                return true;
            }
        }
    }
    return false;
}

// 获取大陆面积辅助函数
function getContinentArea() {
    return {
        isLand,
        isCoast,
        // 获取陆地类型
        getLandType(lat, lng) {
            // 先检查海岸线
            if (isCoast(lat, lng, 2)) {
                return 'coast';
            }
            // 再检查陆地
            if (isLand(lat, lng)) {
                return 'land';
            }
            // 最后是海洋
            return 'ocean';
        },
        // 获取距离最近陆地的距离（用于海洋渐变）
        getDistanceToLand(lat, lng) {
            let minDist = Infinity;
            
            for (const block of LAND_BLOCKS) {
                // 计算到矩形边界的距离
                const dNorth = Math.abs(lat - block.latMax);
                const dSouth = Math.abs(lat - block.latMin);
                const dEast = Math.abs(lng - block.lngMax);
                const dWest = Math.abs(lng - block.lngMin);
                
                // 如果在矩形内，距离为0
                if (lat >= block.latMin && lat <= block.latMax &&
                    lng >= block.lngMin && lng <= block.lngMax) {
                    return 0;
                }
                
                // 计算到矩形的最短距离
                let dist = Infinity;
                if (lat >= block.latMin && lat <= block.latMax) {
                    dist = Math.min(dEast, dWest);
                } else if (lng >= block.lngMin && lng <= block.lngMax) {
                    dist = Math.min(dNorth, dSouth);
                } else {
                    // 角落距离
                    const corners = [
                        [block.latMin, block.lngMin],
                        [block.latMin, block.lngMax],
                        [block.latMax, block.lngMin],
                        [block.latMax, block.lngMax]
                    ];
                    for (const [clat, clng] of corners) {
                        const d = Math.sqrt(
                            Math.pow((lat - clat) * 1.5, 2) + Math.pow(lng - clng, 2)
                        );
                        dist = Math.min(dist, d);
                    }
                }
                
                minDist = Math.min(minDist, dist);
            }
            
            return minDist;
        }
    };
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        LAND_BLOCKS, 
        COASTLINE_POINTS, 
        isLand, 
        isCoast, 
        getContinentArea 
    };
}
