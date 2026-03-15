/**
 * CYBER WEATHER 2077 — PWA 安装管理模块
 *
 * 功能：
 *  1. 拦截 beforeinstallprompt，展示自定义赛博风格安装条
 *  2. iOS Safari 检测：展示手动添加主屏幕的引导提示
 *  3. 安装状态持久化（localStorage），避免重复打扰
 *  4. 安装成功后隐藏安装条
 */

(function () {
    'use strict';

    // ── 常量 ──────────────────────────────────────────────────────
    const LS_KEY_DISMISSED  = 'cw2077_pwa_dismissed';    // 用户点关闭
    const LS_KEY_INSTALLED  = 'cw2077_pwa_installed';    // 已安装
    const LS_KEY_DIS_TIME   = 'cw2077_pwa_dis_time';     // 关闭时间戳
    const DISMISS_COOLDOWN  = 3 * 24 * 60 * 60 * 1000;  // 关闭后 3 天内不再弹出

    // ── DOM 引用 ──────────────────────────────────────────────────
    let _bar        = null;
    let _installBtn = null;
    let _dismissBtn = null;

    // ── 安装提示对象（beforeinstallprompt 事件） ──────────────────
    let _deferredPrompt = null;

    // ── 工具函数 ──────────────────────────────────────────────────
    function isIOS() {
        return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    }

    function isInStandaloneMode() {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true
        );
    }

    function isDismissedRecently() {
        const t = parseInt(localStorage.getItem(LS_KEY_DIS_TIME) || '0', 10);
        return Date.now() - t < DISMISS_COOLDOWN;
    }

    function isAlreadyInstalled() {
        return localStorage.getItem(LS_KEY_INSTALLED) === '1';
    }

    function shouldShow() {
        if (isInStandaloneMode()) return false;  // 已经以 App 模式运行
        if (isAlreadyInstalled())  return false;  // 已安装过
        if (isDismissedRecently()) return false;  // 最近关闭过
        return true;
    }

    // ── UI 操作 ───────────────────────────────────────────────────
    function showBar() {
        if (!_bar || !shouldShow()) return;
        _bar.removeAttribute('hidden');
        // 用 requestAnimationFrame 触发 CSS transition 入场动画
        requestAnimationFrame(() => {
            requestAnimationFrame(() => _bar.classList.add('pwa-install-bar--visible'));
        });
    }

    function hideBar() {
        if (!_bar) return;
        _bar.classList.remove('pwa-install-bar--visible');
        // 等动画结束再隐藏
        setTimeout(() => _bar.setAttribute('hidden', ''), 400);
    }

    // ── iOS 引导提示（Safari 不支持 beforeinstallprompt） ─────────
    function showIOSGuide() {
        if (!_bar || !shouldShow()) return;

        // 修改安装条文字为 iOS 引导
        const textEl = _bar.querySelector('.pwa-install-bar__sub');
        if (textEl) {
            textEl.textContent = '点击底部 [分享] → "添加到主屏幕"';
        }
        // 隐藏安装按钮（iOS 无法用 JS 触发安装）
        if (_installBtn) _installBtn.style.display = 'none';

        showBar();
    }

    // ── 事件绑定 ──────────────────────────────────────────────────
    function bindEvents() {
        // 安装按钮
        if (_installBtn) {
            _installBtn.addEventListener('click', async () => {
                if (!_deferredPrompt) return;
                hideBar();
                _deferredPrompt.prompt();
                const { outcome } = await _deferredPrompt.userChoice;
                _deferredPrompt = null;
                if (outcome === 'accepted') {
                    console.log('[PWA] 用户接受安装');
                    localStorage.setItem(LS_KEY_INSTALLED, '1');
                } else {
                    console.log('[PWA] 用户取消安装');
                    localStorage.setItem(LS_KEY_DISMISSED, '1');
                    localStorage.setItem(LS_KEY_DIS_TIME, Date.now().toString());
                }
            });
        }

        // 关闭按钮
        if (_dismissBtn) {
            _dismissBtn.addEventListener('click', () => {
                hideBar();
                localStorage.setItem(LS_KEY_DISMISSED, '1');
                localStorage.setItem(LS_KEY_DIS_TIME, Date.now().toString());
            });
        }

        // 拦截系统安装事件（Android Chrome / Edge）
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            _deferredPrompt = e;
            console.log('[PWA] beforeinstallprompt 已拦截');
            showBar();
        });

        // 安装完成事件
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] 应用已安装到主屏幕');
            localStorage.setItem(LS_KEY_INSTALLED, '1');
            hideBar();
        });
    }

    // ── 初始化 ────────────────────────────────────────────────────
    function init() {
        _bar        = document.getElementById('pwa-install-bar');
        _installBtn = document.getElementById('pwa-install-btn');
        _dismissBtn = document.getElementById('pwa-install-dismiss');

        if (!_bar) return; // HTML 中不存在安装条，直接退出

        bindEvents();

        // iOS Safari 单独处理
        if (isIOS() && !isInStandaloneMode()) {
            // 延迟 2s 显示，避免和欢迎动画冲突
            setTimeout(showIOSGuide, 2000);
        }
        // Android/Chrome 的安装条由 beforeinstallprompt 触发，无需主动 showBar
    }

    // DOM 就绪后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
