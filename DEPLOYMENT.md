# 🚀 部署指南

本文档详细说明如何将产品密钥生成器部署到不同的云平台。

## 📋 部署选项

### 1. Cloudflare Workers (推荐)
**特点:** 全球CDN、免费额度充足、低延迟

#### 一键部署
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yourusername/Product-key-generator)

#### 手动部署
```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到 Workers
wrangler deploy
```

#### 环境变量配置
在 `wrangler.toml` 中配置：
```toml
[vars]
API_VERSION = "1.0.0"
MAX_KEYS_PER_REQUEST = "100"
```

### 2. Vercel
**特点:** 自动HTTPS、Git集成、预览部署

#### 一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Product-key-generator)

#### 手动部署
```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

#### 环境变量
在 Vercel 控制台设置：
- `NODE_ENV`: `production`

### 3. Netlify
**特点:** 免费SSL、表单处理、身份验证

#### 一键部署
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/Product-key-generator)

#### 手动部署
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

## 🔧 自定义域名

### Cloudflare Workers
1. 在 Cloudflare 控制台添加域名
2. 配置 DNS 记录指向 Workers
3. 在 `wrangler.toml` 中配置路由：
```toml
[[routes]]
pattern = "keys.yourdomain.com/*"
zone_name = "yourdomain.com"
```

### Vercel
1. 在 Vercel 项目设置中添加域名
2. 在域名提供商处配置 CNAME 记录
3. 等待 SSL 证书自动签发

### Netlify
1. 在 Netlify 站点设置中添加自定义域名
2. 配置 DNS 记录
3. 启用 HTTPS

## 📊 监控和日志

### Cloudflare Workers
- **Analytics**: Workers 控制台查看请求统计
- **Logs**: 使用 `wrangler tail` 查看实时日志
- **Metrics**: 请求数、错误率、执行时间

### Vercel
- **Analytics**: Vercel 控制台查看访问统计
- **Logs**: 部署日志和函数日志
- **Performance**: 页面加载速度和函数性能

### Netlify
- **Analytics**: 站点分析和函数调用统计
- **Logs**: 函数执行日志
- **Forms**: 表单提交记录（如需要）

## 🔒 安全配置

### 1. 限制请求频率
```javascript
// 在 API 函数中添加速率限制
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15分钟
  maxRequests: 100 // 每个IP最多100次请求
};
```

### 2. API 密钥保护（可选）
```javascript
// 验证 API 密钥
const API_KEY = env.API_KEY;

if (request.headers.get('X-API-Key') !== API_KEY) {
  return new Response('Unauthorized', { status: 401 });
}
```

### 3. 输入验证
```javascript
// 验证生成数量
if (count < 1 || count > 100) {
  return new Response('Count must be between 1 and 100', { status: 400 });
}
```

## 🚨 故障排除

### 常见问题

#### 1. 部署失败
- **检查**: 配置文件语法是否正确
- **解决**: 查看平台提供的错误日志

#### 2. API 返回 404
- **检查**: 路由配置是否正确
- **解决**: 确保 API 路径匹配配置

#### 3. CORS 错误
- **检查**: CORS 头是否正确设置
- **解决**: 确保 `Access-Control-Allow-Origin` 包含请求来源

#### 4. 函数超时
- **检查**: 函数执行时间是否超过平台限制
- **解决**: 优化代码或增加超时限制

### 调试命令

#### Cloudflare Workers
```bash
# 查看日志
wrangler tail

# 本地测试
wrangler dev

# 查看部署状态
wrangler whoami
```

#### Vercel
```bash
# 本地开发
vercel dev

# 查看部署
vercel list

# 查看日志
vercel logs
```

#### Netlify
```bash
# 本地开发
netlify dev

# 查看部署
netlify status

# 查看函数日志
netlify functions:list
```

## 📈 性能优化

### 1. 缓存策略
```javascript
// 添加缓存头
const cacheHeaders = {
  'Cache-Control': 'public, max-age=3600' // 缓存1小时
};
```

### 2. 代码优化
- 使用高效的随机数生成算法
- 避免不必要的循环
- 压缩响应数据

### 3. CDN 配置
- 启用浏览器缓存
- 配置合适的 TTL
- 使用边缘计算

## 🔄 持续集成

### GitHub Actions 示例
```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
```

## 📞 支持

如果遇到部署问题：

1. 查看平台文档
2. 检查错误日志
3. 提交 GitHub Issue
4. 联系平台支持

## 📝 更新日志

### v2.0.0
- ✅ 新增 Cloudflare Workers 支持
- ✅ 新增 Vercel 部署配置
- ✅ 新增 Netlify Functions
- ✅ 现代化 UI 设计
- ✅ 完整的 API 文档
- ✅ 一键部署按钮

---

**💡 提示:** 建议先使用一键部署体验功能，然后根据需要选择平台进行生产部署。