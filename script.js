// 产品密钥生成器 - 主应用逻辑
document.addEventListener('DOMContentLoaded', function() {
  // 初始化变量
  let generatedKeys = [];
  let copiedCount = 0;
  let currentTheme = 'dark';

  // DOM 元素
  const elements = {
    keyType: document.getElementById('keyType'),
    customFormatGroup: document.getElementById('customFormatGroup'),
    customFormat: document.getElementById('customFormat'),
    keyCount: document.getElementById('keyCount'),
    generateBtn: document.getElementById('generateBtn'),
    keysContainer: document.getElementById('keysContainer'),
    copyAllBtn: document.getElementById('copyAllBtn'),
    clearBtn: document.getElementById('clearBtn'),
    totalKeys: document.getElementById('totalKeys'),
    copiedKeys: document.getElementById('copiedKeys'),
    themeBtns: document.querySelectorAll('.theme-btn'),
    instructionsModal: document.getElementById('instructionsModal'),
    closeModal: document.querySelector('.close-modal'),
    toggleInstructions: document.getElementById('toggleInstructions'),
    reportIssue: document.getElementById('reportIssue')
  };

  // 初始化应用
  function initApp() {
    // 设置初始主题
    setTheme(currentTheme);

    // 绑定事件监听器
    bindEvents();

    // 更新统计信息
    updateStats();
  }

  // 绑定所有事件
  function bindEvents() {
    // 密钥类型变化
    elements.keyType.addEventListener('change', handleKeyTypeChange);

    // 生成按钮点击
    elements.generateBtn.addEventListener('click', generateKeys);

    // 复制全部按钮
    elements.copyAllBtn.addEventListener('click', copyAllKeys);

    // 清空按钮
    elements.clearBtn.addEventListener('click', clearKeys);

    // 主题切换按钮
    elements.themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        setTheme(theme);
        elements.themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // 模态框控制
    elements.toggleInstructions.addEventListener('click', () => {
      elements.instructionsModal.classList.add('active');
    });

    elements.closeModal.addEventListener('click', () => {
      elements.instructionsModal.classList.remove('active');
    });

    elements.instructionsModal.addEventListener('click', (e) => {
      if (e.target === elements.instructionsModal) {
        elements.instructionsModal.classList.remove('active');
      }
    });

    // 报告问题
    elements.reportIssue.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://github.com/yourusername/Product-key-generator/issues/new', '_blank');
    });
  }

  // 处理密钥类型变化
  function handleKeyTypeChange() {
    const type = elements.keyType.value;
    if (type === 'custom') {
      elements.customFormatGroup.style.display = 'block';
    } else {
      elements.customFormatGroup.style.display = 'none';
      // 根据类型设置默认格式
      switch(type) {
        case 'standard':
          elements.customFormat.value = 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX';
          break;
        case 'microsoft':
          elements.customFormat.value = 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX';
          break;
        case 'simple':
          elements.customFormat.value = 'XXXXX-XXXXX-XXXXX';
          break;
      }
    }
  }

  // 生成产品密钥
  function generateKeys() {
    const count = parseInt(elements.keyCount.value) || 1;
    const type = elements.keyType.value;
    const format = elements.customFormat.value;

    // 验证输入
    if (count < 1 || count > 100) {
      showNotification('生成数量必须在1-100之间', 'warning');
      return;
    }

    // 生成密钥
    const newKeys = [];
    for (let i = 0; i < count; i++) {
      let key;
      switch(type) {
        case 'standard':
        case 'microsoft':
          key = generateStandardKey();
          break;
        case 'simple':
          key = generateSimpleKey();
          break;
        case 'custom':
          key = generateCustomKey(format);
          break;
        default:
          key = generateStandardKey();
      }
      newKeys.push(key);
    }

    // 添加到列表
    generatedKeys.push(...newKeys);

    // 更新UI
    renderKeys();
    updateStats();

    // 显示通知
    showNotification(`成功生成 ${count} 个产品密钥`, 'success');
  }

  // 生成标准格式密钥 (25个字符，5组)
  function generateStandardKey() {
    const characters = '23456789BCDFGHJKLMNPQRSTVWXYZ'; // 排除易混淆字符
    let result = '';

    for (let i = 0; i < 25; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
      if ((i + 1) % 5 === 0 && i < 24) {
        result += '-';
      }
    }

    return result;
  }

  // 生成简单格式密钥 (15个字符，3组)
  function generateSimpleKey() {
    const characters = '23456789BCDFGHJKLMNPQRSTVWXYZ';
    let result = '';

    for (let i = 0; i < 15; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
      if ((i + 1) % 5 === 0 && i < 14) {
        result += '-';
      }
    }

    return result;
  }

  // 根据自定义格式生成密钥
  function generateCustomKey(format) {
    const characters = '23456789BCDFGHJKLMNPQRSTVWXYZ';
    let result = '';

    for (let i = 0; i < format.length; i++) {
      if (format[i] === 'X') {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      } else {
        result += format[i];
      }
    }

    return result;
  }

  // 渲染密钥列表
  function renderKeys() {
    if (generatedKeys.length === 0) {
      elements.keysContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-key"></i>
          <p>点击"生成密钥"按钮开始生成产品密钥</p>
        </div>
      `;
      return;
    }

    let html = '';
    generatedKeys.forEach((key, index) => {
      html += `
        <div class="key-item" data-index="${index}">
          <span class="key-text">${key}</span>
          <div class="key-actions">
            <button class="key-action-btn copy-single" data-key="${key}">
              <i class="fas fa-copy"></i> 复制
            </button>
            <button class="key-action-btn delete-key" data-index="${index}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    });

    elements.keysContainer.innerHTML = html;

    // 绑定单个密钥操作
    document.querySelectorAll('.copy-single').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.target.closest('.copy-single').dataset.key;
        copyToClipboard(key);
      });
    });

    document.querySelectorAll('.delete-key').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.closest('.delete-key').dataset.index);
        deleteKey(index);
      });
    });

    // 点击密钥项也可以复制
    document.querySelectorAll('.key-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.key-actions')) {
          const index = parseInt(item.dataset.index);
          copyToClipboard(generatedKeys[index]);
        }
      });
    });
  }

  // 复制单个密钥到剪贴板
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      copiedCount++;
      updateStats();
      showNotification('密钥已复制到剪贴板', 'success');
    }).catch(err => {
      console.error('复制失败:', err);
      showNotification('复制失败，请手动复制', 'error');
    });
  }

  // 复制所有密钥
  function copyAllKeys() {
    if (generatedKeys.length === 0) {
      showNotification('没有可复制的密钥', 'warning');
      return;
    }

    const allKeys = generatedKeys.join('\n');
    copyToClipboard(allKeys);
  }

  // 删除单个密钥
  function deleteKey(index) {
    generatedKeys.splice(index, 1);
    renderKeys();
    updateStats();
    showNotification('密钥已删除', 'info');
  }

  // 清空所有密钥
  function clearKeys() {
    if (generatedKeys.length === 0) {
      showNotification('没有可清空的密钥', 'warning');
      return;
    }

    if (confirm('确定要清空所有生成的密钥吗？')) {
      generatedKeys = [];
      renderKeys();
      updateStats();
      showNotification('所有密钥已清空', 'info');
    }
  }

  // 更新统计信息
  function updateStats() {
    elements.totalKeys.textContent = generatedKeys.length;
    elements.copiedKeys.textContent = copiedCount;
  }

  // 设置主题
  function setTheme(theme) {
    currentTheme = theme;

    if (theme === 'auto') {
      // 根据系统偏好设置主题
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }

    // 保存主题偏好
    localStorage.setItem('product-key-generator-theme', theme);
  }

  // 显示通知
  function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    `;

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // 自动移除
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // 获取通知图标
  function getNotificationIcon(type) {
    switch(type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      case 'warning': return 'exclamation-triangle';
      case 'info': return 'info-circle';
      default: return 'info-circle';
    }
  }

  // 加载保存的主题
  function loadSavedTheme() {
    const savedTheme = localStorage.getItem('product-key-generator-theme');
    if (savedTheme) {
      currentTheme = savedTheme;
      // 激活对应的主题按钮
      elements.themeBtns.forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  // 添加通知样式
  function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        background-color: var(--bg-card);
        color: var(--text-primary);
        border-left: 4px solid var(--accent-primary);
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      .notification.show {
        transform: translateX(0);
        opacity: 1;
      }

      .notification-success {
        border-left-color: var(--success-color);
      }

      .notification-error {
        border-left-color: var(--danger-color);
      }

      .notification-warning {
        border-left-color: var(--warning-color);
      }

      .notification-info {
        border-left-color: var(--accent-primary);
      }
    `;
    document.head.appendChild(style);
  }

  // 初始化应用
  addNotificationStyles();
  loadSavedTheme();
  initApp();
});

// API 相关函数（用于无服务器函数）
function generateKeyAPI(options = {}) {
  const {
    count = 1,
    type = 'standard',
    format = 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX'
  } = options;

  const keys = [];

  for (let i = 0; i < count; i++) {
    let key;
    switch(type) {
      case 'standard':
      case 'microsoft':
        key = generateStandardKey();
        break;
      case 'simple':
        key = generateSimpleKey();
        break;
      case 'custom':
        key = generateCustomKey(format);
        break;
      default:
        key = generateStandardKey();
    }
    keys.push(key);
  }

  return keys;
}

// 导出函数供无服务器函数使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateKeyAPI };
}
