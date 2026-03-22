# 🔑 Product Key Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare Workers](https://img.shields.io/badge/Deploy%20on-Cloudflare%20Workers-orange)](https://deploy.workers.cloudflare.com/?url=https://github.com/yourusername/Product-key-generator)
[![Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Product-key-generator)
[![Netlify](https://img.shields.io/badge/Deploy%20on-Netlify-teal)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/Product-key-generator)

一个现代化的产品密钥生成器，支持多种格式、主题切换和云平台一键部署。

## ✨ 特性

- 🎨 **现代化UI设计** - 深色/浅色主题，响应式布局
- 🔧 **多种密钥格式** - 标准、Microsoft、简单和自定义格式
- 🚀 **一键部署** - 支持 Cloudflare Workers、Vercel、Netlify
- 🔌 **RESTful API** - 完整的API接口，支持GET/POST请求
- 📱 **移动端友好** - 完全响应式设计
- 📋 **批量生成** - 支持一次生成最多100个密钥
- 🎯 **实时统计** - 生成和复制数量统计
- 🔔 **通知系统** - 操作反馈和错误提示

## 🚀 快速开始

### 在线使用
直接访问部署的实例：
- [Cloudflare Workers 部署](https://product-key-generator.your-username.workers.dev)
- [Vercel 部署](https://product-key-generator.vercel.app)
- [Netlify 部署](https://product-key-generator.netlify.app)

### 本地运行
```bash
# 克隆项目
git clone https://github.com/yourusername/Product-key-generator.git
cd Product-key-generator

# 安装依赖（可选）
npm install

# 启动本地服务器
npm start

# 或使用任何静态文件服务器
python -m http.server 8000
```

## 📦 部署指南

### Cloudflare Workers
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yourusername/Product-key-generator)

1. 点击上方按钮
2. 登录 Cloudflare 账户
3. 授权 GitHub 访问
4. 选择仓库和分支
5. 点击"部署到 Workers"

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Product-key-generator)

1. 点击上方按钮
2. 登录 Vercel 账户
3. 导入 GitHub 仓库
4. 配置项目设置
5. 点击"部署"

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/Product-key-generator)

1. 点击上方按钮
2. 登录 Netlify 账户
3. 连接 GitHub 仓库
4. 配置构建设置
5. 点击"部署站点"

## 🔧 API 文档

### 生成密钥
**端点:** `GET /api/generate`

**参数:**
- `count` (可选): 生成数量，1-100，默认: 1
- `type` (可选): 密钥类型，`standard` | `microsoft` | `simple` | `custom`，默认: `standard`
- `format` (可选): 自定义格式（仅当 type=custom 时有效），默认: `XXXXX-XXXXX-XXXXX-XXXXX-XXXXX`

**示例:**
```bash
# 生成5个标准密钥
curl "https://your-domain.com/api/generate?count=5&type=standard"

# 生成3个Microsoft格式密钥
curl "https://your-domain.com/api/generate?count=3&type=microsoft"

# 生成自定义格式密钥
curl "https://your-domain.com/api/generate?count=1&type=custom&format=XXXX-XXXX-XXXX-XXXX"
```

**POST 请求:**
```bash
curl -X POST "https://your-domain.com/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"count": 5, "type": "standard"}'
```

**响应示例:**
```json
{
  "success": true,
  "count": 5,
  "type": "standard",
  "format": "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
  "keys": [
    "BCDFG-HJKLM-NPQR5-TVWXY-23467",
    "JKLMN-PQRST-VWXYZ-23456-789BC",
    "DFGHJ-KLMNP-QRSTV-WXYZ2-34567",
    "NPQRS-TVWXY-Z2345-6789B-CDFGH",
    "TVWXY-Z2345-6789B-CDFGH-JKLMN"
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🎨 界面功能

### 1. 生成设置
- **密钥类型**: 选择标准、Microsoft、简单或自定义格式
- **生成数量**: 设置一次生成的密钥数量（1-100）
- **主题模式**: 深色、浅色或自动跟随系统

### 2. 密钥管理
- **批量生成**: 一次生成多个密钥
- **单个复制**: 点击密钥或复制按钮
- **批量复制**: 一键复制所有生成的密钥
- **删除功能**: 删除单个或清空所有密钥

### 3. 部署选项
- **一键部署**: 快速部署到云平台
- **API 文档**: 查看和使用API接口
- **使用说明**: 详细的操作指南

## 📁 项目结构

```
Product-key-generator/
├── index.html          # 主页面
├── styles.css         # 样式文件
├── script.js          # 前端逻辑
├── package.json       # 项目配置
├── README.md          # 说明文档
├── LICENSE            # 许可证
│
├── api/
│   ├── generate.js    # Cloudflare Workers API
│   └── vercel/
│       └── generate.js # Vercel Serverless Function
│
├── netlify/
│   └── functions/
│       └── generate.js # Netlify Function
│
├── wrangler.toml      # Cloudflare Workers 配置
├── vercel.json        # Vercel 配置
└── netlify.toml       # Netlify 配置
```

## 🔒 安全说明

### 密钥生成算法
- 使用安全的随机数生成
- 排除易混淆字符（0, O, 1, I, L）
- 仅使用大写字母和数字
- 支持自定义字符集

### 免责声明
⚠️ **重要提示：**
- 本工具仅为学习、测试和研究目的开发
- 不得用于任何商业用途或非法活动
- 请支持购买正版软件和合法授权
- 使用本工具产生的任何后果由使用者自行承担

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 图标由 [Font Awesome](https://fontawesome.com/) 提供
- 部署按钮由各云平台提供
- 感谢所有贡献者和用户

## 📞 支持

- 提交 Issue: [GitHub Issues](https://github.com/yourusername/Product-key-generator/issues)
- 功能请求: 通过 Issue 提交
- 问题反馈: 详细描述问题和使用环境

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**   
 
