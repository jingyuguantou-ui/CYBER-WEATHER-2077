/**
 * AI Assistant Module
 * NEXUS - 赛博朋克天气终端 AI 助手
 * 多平台支持：DeepSeek / 智谱 GLM / 通义千问 / Moonshot / OpenAI
 */

const AIAssistant = (function() {
    // ─────────────────────────────────────────────
    // 平台配置
    // ─────────────────────────────────────────────
    const PLATFORMS = {
        deepseek: {
            name: 'DeepSeek',
            url: 'https://api.deepseek.com/chat/completions',
            models: ['deepseek-chat', 'deepseek-reasoner'],
            defaultModel: 'deepseek-chat'
        },
        zhipu: {
            name: '智谱 GLM',
            url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            models: ['glm-4-flash', 'glm-4', 'glm-4-plus'],
            defaultModel: 'glm-4-flash'
        },
        qwen: {
            name: '通义千问',
            url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
            defaultModel: 'qwen-turbo'
        },
        moonshot: {
            name: 'Moonshot',
            url: 'https://api.moonshot.cn/v1/chat/completions',
            models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
            defaultModel: 'moonshot-v1-8k'
        },
        openai: {
            name: 'OpenAI',
            url: 'https://api.openai.com/v1/chat/completions',
            models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
            defaultModel: 'gpt-4o-mini'
        }
    };

    // 存储键
    const STORAGE_KEYS = {
        PLATFORM: 'nexus_platform',
        API_KEY: 'nexus_api_key',
        MODEL: 'nexus_model',
        HISTORY: 'nexus_history'
    };

    const MAX_HISTORY = 20;
    const TYPE_SPEED = 25;

    // 状态
    let state = {
        platform: 'deepseek',
        apiKey: '',
        model: '',
        conversationHistory: [],
        isStreaming: false,
        currentMessageElement: null
    };

    // DOM 元素引用
    let elements = {};

    // ─────────────────────────────────────────────
    // 初始化
    // ─────────────────────────────────────────────
    function init() {
        elements = {
            input: document.getElementById('ai-input'),
            sendIcon: document.getElementById('ai-send-icon'),
            outputContent: document.getElementById('terminal-output'),
            settingsBtn: document.getElementById('ai-settings-btn'),
            settingsPanel: document.getElementById('ai-settings-panel'),
            settingsClose: document.getElementById('ai-settings-close'),
            platformSelect: document.getElementById('platform-select'),
            modelSelect: document.getElementById('model-select'),
            apiKeyInput: document.getElementById('ai-apikey-input'),
            apiKeyToggle: document.getElementById('ai-apikey-toggle'),
            saveBtn: document.getElementById('ai-save-btn')
        };

        if (!elements.input) {
            console.warn('[NEXUS] AI input not found in DOM');
            return;
        }

        loadConfig();
        bindEvents();
        initCustomSelects();

        console.log('[NEXUS] AI Assistant initialized');
    }

    // ─────────────────────────────────────────────
    // 加载配置
    // ─────────────────────────────────────────────
    function loadConfig() {
        state.platform = localStorage.getItem(STORAGE_KEYS.PLATFORM) || 'deepseek';
        state.apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
        
        const savedModel = localStorage.getItem(STORAGE_KEYS.MODEL);
        const defaultModel = PLATFORMS[state.platform]?.defaultModel || '';
        state.model = savedModel || defaultModel;

        // 加载对话历史
        try {
            const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
            if (history) {
                state.conversationHistory = JSON.parse(history);
            }
        } catch (e) {
            state.conversationHistory = [];
        }

        // 更新 UI
        if (elements.platformSelect) {
            elements.platformSelect.value = state.platform;
        }
        if (elements.apiKeyInput) {
            elements.apiKeyInput.value = state.apiKey;
        }
    }

    // ─────────────────────────────────────────────
    // 保存配置
    // ─────────────────────────────────────────────
    function saveConfig() {
        localStorage.setItem(STORAGE_KEYS.PLATFORM, state.platform);
        localStorage.setItem(STORAGE_KEYS.API_KEY, state.apiKey);
        localStorage.setItem(STORAGE_KEYS.MODEL, state.model);

        try {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.conversationHistory));
        } catch (e) {
            console.warn('[NEXUS] Failed to save history:', e);
        }
    }

    // ─────────────────────────────────────────────
    // 更新模型选项
    // ─────────────────────────────────────────────
    function updateModelOptions() {
        if (!elements.modelSelect) return;

        const platform = PLATFORMS[state.platform];
        if (!platform) return;

        const optionsContainer = elements.modelSelect.querySelector('.custom-select-options');
        const valueDisplay = elements.modelSelect.querySelector('.custom-select-value');

        if (!optionsContainer || !valueDisplay) return;

        optionsContainer.innerHTML = platform.models.map((model, index) => 
            `<div class="custom-select-option${index === 0 ? ' selected' : ''}" data-value="${model}">${model}</div>`
        ).join('');

        // 默认选中第一个
        state.model = platform.defaultModel;
        valueDisplay.textContent = state.model;

        // 重新绑定选项点击事件
        optionsContainer.querySelectorAll('.custom-select-option').forEach(option => {
            option.addEventListener('click', () => selectModelOption(option));
        });
    }

    // ─────────────────────────────────────────────
    // 初始化自定义下拉菜单
    // ─────────────────────────────────────────────
    function initCustomSelects() {
        // 平台选择
        if (elements.platformSelect) {
            const trigger = elements.platformSelect.querySelector('.custom-select-trigger');
            const options = elements.platformSelect.querySelector('.custom-select-options');
            const valueDisplay = elements.platformSelect.querySelector('.custom-select-value');

            if (trigger && options) {
                trigger.addEventListener('click', () => toggleSelect(elements.platformSelect));
                trigger.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSelect(elements.platformSelect);
                    }
                });

                options.querySelectorAll('.custom-select-option').forEach(option => {
                    option.addEventListener('click', () => {
                        selectPlatformOption(option, valueDisplay, options);
                    });
                });
            }
        }

        // 模型选择
        if (elements.modelSelect) {
            const trigger = elements.modelSelect.querySelector('.custom-select-trigger');
            const options = elements.modelSelect.querySelector('.custom-select-options');

            if (trigger && options) {
                trigger.addEventListener('click', () => toggleSelect(elements.modelSelect));
                trigger.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSelect(elements.modelSelect);
                    }
                });

                options.querySelectorAll('.custom-select-option').forEach(option => {
                    option.addEventListener('click', () => selectModelOption(option));
                });
            }
        }

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-select')) {
                closeAllSelects();
            }
        });
    }

    function toggleSelect(selectEl) {
        const isOpen = selectEl.classList.contains('open');
        closeAllSelects();
        if (!isOpen) {
            selectEl.classList.add('open');
            selectEl.querySelector('.custom-select-options').classList.remove('hidden');
        }
    }

    function closeAllSelects() {
        document.querySelectorAll('.custom-select').forEach(select => {
            select.classList.remove('open');
            const options = select.querySelector('.custom-select-options');
            if (options) options.classList.add('hidden');
        });
    }

    function selectPlatformOption(option, valueDisplay, optionsContainer) {
        const value = option.dataset.value;
        state.platform = value;
        valueDisplay.textContent = option.textContent;

        optionsContainer.querySelectorAll('.custom-select-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');

        closeAllSelects();
        updateModelOptions();
    }

    function selectModelOption(option) {
        const value = option.dataset.value;
        const selectEl = elements.modelSelect;
        const valueDisplay = selectEl.querySelector('.custom-select-value');
        const optionsContainer = selectEl.querySelector('.custom-select-options');

        state.model = value;
        valueDisplay.textContent = option.textContent;

        optionsContainer.querySelectorAll('.custom-select-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');

        closeAllSelects();
    }

    // ─────────────────────────────────────────────
    // 绑定事件
    // ─────────────────────────────────────────────
    function bindEvents() {
        // 发送
        if (elements.sendIcon) {
            elements.sendIcon.addEventListener('click', handleSend);
        }

        if (elements.input) {
            elements.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            });
        }

        // 设置面板
        if (elements.settingsBtn) {
            elements.settingsBtn.addEventListener('click', () => {
                elements.settingsPanel?.classList.remove('hidden');
            });
        }

        if (elements.settingsClose) {
            elements.settingsClose.addEventListener('click', () => {
                elements.settingsPanel?.classList.add('hidden');
            });
        }

        // API Key 显示/隐藏
        if (elements.apiKeyToggle) {
            elements.apiKeyToggle.addEventListener('click', () => {
                const isPassword = elements.apiKeyInput.type === 'password';
                elements.apiKeyInput.type = isPassword ? 'text' : 'password';
                elements.apiKeyToggle.textContent = isPassword ? '隐藏' : '显示';
            });
        }

        // API Key 输入
        if (elements.apiKeyInput) {
            elements.apiKeyInput.addEventListener('input', (e) => {
                state.apiKey = e.target.value.trim();
            });
        }

        // 保存
        if (elements.saveBtn) {
            elements.saveBtn.addEventListener('click', () => {
                saveConfig();
                elements.settingsPanel?.classList.add('hidden');
                addOutputMessage('◈ 配置已保存。', 'success');
            });
        }

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (elements.settingsPanel && 
                !elements.settingsPanel.contains(e.target) && 
                !elements.settingsBtn?.contains(e.target) &&
                !elements.settingsPanel.classList.contains('hidden')) {
                elements.settingsPanel.classList.add('hidden');
            }
        });
    }

    // ─────────────────────────────────────────────
    // 发送消息
    // ─────────────────────────────────────────────
    async function handleSend() {
        const query = elements.input?.value.trim();
        if (!query) return;

        if (!state.apiKey) {
            showError('请先配置 API Key（点击齿轮图标）');
            elements.settingsPanel?.classList.remove('hidden');
            return;
        }

        if (state.isStreaming) return;

        elements.input.value = '';
        addOutputMessage(`> ${query}`, 'user');

        state.conversationHistory.push({
            role: 'user',
            content: query
        });

        if (state.conversationHistory.length > MAX_HISTORY * 2) {
            state.conversationHistory = state.conversationHistory.slice(-MAX_HISTORY * 2);
        }

        await callAPI();
    }

    // ─────────────────────────────────────────────
    // 调用 API
    // ─────────────────────────────────────────────
    async function callAPI() {
        state.isStreaming = true;

        const messageEl = document.createElement('div');
        messageEl.className = 'output-line ai-response';
        elements.outputContent?.appendChild(messageEl);

        const cursor = document.createElement('span');
        cursor.className = 'ai-cursor';
        messageEl.appendChild(cursor);

        state.currentMessageElement = messageEl;

        const platform = PLATFORMS[state.platform];
        if (!platform) {
            showError('未知平台配置');
            state.isStreaming = false;
            return;
        }

        try {
            const systemPrompt = buildSystemPrompt();
            const messages = [
                { role: 'system', content: systemPrompt },
                ...state.conversationHistory
            ];

            const response = await fetch(platform.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.apiKey}`
                },
                body: JSON.stringify({
                    model: state.model,
                    messages: messages,
                    stream: true
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error?.message || `API 错误: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

                for (const line of lines) {
                    if (line === 'data: [DONE]') continue;

                    try {
                        const json = JSON.parse(line.slice(6));
                        const content = json.choices?.[0]?.delta?.content || '';
                        
                        if (content) {
                            fullContent += content;
                            await typeWriterEffect(content, messageEl, cursor);
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }

            cursor.remove();

            state.conversationHistory.push({
                role: 'assistant',
                content: fullContent
            });

            saveConfig();

        } catch (error) {
            console.error('[NEXUS] API Error:', error);
            cursor.remove();
            showError(error.message);
        } finally {
            state.isStreaming = false;
            state.currentMessageElement = null;
        }
    }

    // ─────────────────────────────────────────────
    // 构造系统提示词
    // ─────────────────────────────────────────────
    function buildSystemPrompt() {
        const weatherData = window.currentWeatherData || {};
        
        let weatherContext = '';
        if (weatherData.city) {
            weatherContext = `
当前天气数据：
- 城市：${weatherData.city}
- 温度：${weatherData.temp ?? '--'}°C
- 湿度：${weatherData.humidity ?? '--'}%
- 风速：${weatherData.wind ?? '--'} m/s
- 天气：${weatherData.description || '未知'}
- 数据时间：${weatherData.timestamp ? new Date(weatherData.timestamp).toLocaleString('zh-CN') : '未知'}`;
        }

        return `你是 NEXUS，一个赛博朋克风格的天气终端 AI 助手。
${weatherContext}

你的职责：
1. 回答用户关于天气的问题
2. 提供穿衣、出行建议
3. 解读天气数据
4. 保持简洁、专业的终端风格

回答要求：
- 使用简洁的终端风格语言，不要啰嗦
- 如果涉及当前城市天气，结合上述数据回答
- 如果用户问其他城市天气，引导用户在终端输入城市名查询
- 中文回答为主，技术术语可保留英文`;
    }

    // ─────────────────────────────────────────────
    // 打字机效果
    // ─────────────────────────────────────────────
    async function typeWriterEffect(text, container, cursor) {
        for (const char of text) {
            container.insertBefore(document.createTextNode(char), cursor);
            
            if (elements.outputContent) {
                elements.outputContent.scrollTop = elements.outputContent.scrollHeight;
            }
            
            await sleep(TYPE_SPEED);
        }
    }

    // ─────────────────────────────────────────────
    // 添加输出消息
    // ─────────────────────────────────────────────
    function addOutputMessage(content, type = 'system') {
        if (!elements.outputContent) return;

        const div = document.createElement('div');
        div.className = 'output-line';
        
        const span = document.createElement('span');
        span.className = `message ${type}`;
        span.textContent = content;
        
        div.appendChild(span);
        elements.outputContent.appendChild(div);
        
        elements.outputContent.scrollTop = elements.outputContent.scrollHeight;
    }

    // ─────────────────────────────────────────────
    // 显示错误
    // ─────────────────────────────────────────────
    function showError(message) {
        addOutputMessage(`◈ 错误: ${message}`, 'error');
    }

    // ─────────────────────────────────────────────
    // 工具函数
    // ─────────────────────────────────────────────
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ─────────────────────────────────────────────
    // 公开接口
    // ─────────────────────────────────────────────
    return {
        init,
        clearHistory: () => {
            state.conversationHistory = [];
            saveConfig();
            addOutputMessage('◈ 对话历史已清除。', 'system');
        }
    };
})();

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    AIAssistant.init();
});

// 导出全局
window.AIAssistant = AIAssistant;
