/**
 * MobilePanel — 移动端右侧抽屉手势控制模块
 *
 * 功能：
 *  - open()   显示右侧抽屉（.glass-panel + .panel-overlay）
 *  - close()  隐藏右侧抽屉
 *  - toggle() 切换状态
 *
 * 触发方式：
 *  1. 右边缘区域向左滑（swipe left from right edge）→ open
 *  2. 面板内或全局向右滑（swipe right）→ close
 *  3. 点击 #panel-fab 浮动按钮 → toggle
 *  4. 点击 #panel-overlay 遮罩 → close
 *
 * 仅在 window.innerWidth <= 768 时激活，桌面端不干预。
 */

window.MobilePanel = (() => {
    // ── 配置 ──────────────────────────────────────────────────
    const BREAKPOINT      = 768;   // 仅移动端生效
    const EDGE_THRESHOLD  = 40;    // 从右边缘多少 px 内开始滑动才触发 open
    const SWIPE_MIN_X     = 50;    // 水平位移超过此值才判定为有效滑动（px）
    const SWIPE_RATIO     = 1.5;   // 水平分量必须比垂直分量大 1.5 倍（避免误触上下滚动）

    // ── 状态 ──────────────────────────────────────────────────
    let _isOpen    = false;
    let _panel     = null;
    let _overlay   = null;
    let _fab       = null;
    let _touchStartX = 0;
    let _touchStartY = 0;
    let _touchStartTime = 0;
    let _fromEdge  = false;   // 是否从右边缘区域开始触摸

    // ── 工具函数 ───────────────────────────────────────────────
    function isMobile() {
        return window.innerWidth <= BREAKPOINT;
    }

    // ── 核心 API ───────────────────────────────────────────────
    function open() {
        if (!_panel) return;
        _isOpen = true;
        _panel.classList.add('panel-open');
        if (_overlay) {
            _overlay.classList.add('panel-overlay--visible');
            _overlay.setAttribute('aria-hidden', 'false');
        }
        if (_fab) {
            _fab.setAttribute('aria-expanded', 'true');
            _fab.classList.add('panel-fab--active');
        }
        // 防止 body 滚动（面板内部可滚动）
        document.body.style.overflow = 'hidden';
    }

    function close() {
        if (!_panel) return;
        _isOpen = false;
        _panel.classList.remove('panel-open');
        if (_overlay) {
            _overlay.classList.remove('panel-overlay--visible');
            _overlay.setAttribute('aria-hidden', 'true');
        }
        if (_fab) {
            _fab.setAttribute('aria-expanded', 'false');
            _fab.classList.remove('panel-fab--active');
        }
        document.body.style.overflow = '';
    }

    function toggle() {
        _isOpen ? close() : open();
    }

    // ── 手势识别 ───────────────────────────────────────────────
    function _onTouchStart(e) {
        if (!isMobile()) return;
        const touch = e.touches[0];
        _touchStartX    = touch.clientX;
        _touchStartY    = touch.clientY;
        _touchStartTime = Date.now();
        // 判断是否从屏幕右边缘区域开始（用于触发 open）
        _fromEdge = _touchStartX >= window.innerWidth - EDGE_THRESHOLD;
    }

    function _onTouchEnd(e) {
        if (!isMobile()) return;
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - _touchStartX;
        const deltaY = touch.clientY - _touchStartY;
        const elapsed = Date.now() - _touchStartTime;

        // 过滤掉太慢的拖动（> 600ms 视为长按，不触发）
        if (elapsed > 600) return;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // 水平滑动判定：水平分量必须大于最小阈值，且水平 > 垂直 × ratio
        const isHorizontal = absX >= SWIPE_MIN_X && absX > absY * SWIPE_RATIO;
        if (!isHorizontal) return;

        if (deltaX < 0 && _fromEdge && !_isOpen) {
            // 从右边缘向左滑 → open
            open();
        } else if (deltaX > 0 && _isOpen) {
            // 向右滑（面板已开）→ close
            close();
        }
    }

    // ── 初始化 ─────────────────────────────────────────────────
    function init() {
        _panel   = document.querySelector('.glass-panel');
        _overlay = document.getElementById('panel-overlay');
        _fab     = document.getElementById('panel-fab');

        if (!_panel) {
            console.warn('[MobilePanel] .glass-panel not found');
            return;
        }

        // FAB 点击
        if (_fab) {
            _fab.addEventListener('click', () => toggle());
        }

        // 遮罩点击
        if (_overlay) {
            _overlay.addEventListener('click', () => close());
        }

        // 全局触摸手势
        document.addEventListener('touchstart', _onTouchStart, { passive: true });
        document.addEventListener('touchend',   _onTouchEnd,   { passive: true });

        // 窗口 resize：超过断点自动关闭并清理状态
        window.addEventListener('resize', () => {
            if (!isMobile() && _isOpen) {
                close();
            }
        });

        console.log('[MobilePanel] initialized');
    }

    // ── DOMContentLoaded 自动初始化 ────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { open, close, toggle };
})();
