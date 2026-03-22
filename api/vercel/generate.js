// Vercel Serverless Function - 产品密钥生成器
// 部署到: https://vercel.com/

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只处理 /api/generate 路径
  if (req.url !== '/api/generate') {
    res.status(404).json({
      error: 'Not Found',
      message: 'Endpoint not found. Use /api/generate'
    });
    return;
  }

  try {
    let count = 1;
    let type = 'standard';
    let format = 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX';

    // 根据请求方法获取参数
    if (req.method === 'GET') {
      count = parseInt(req.query.count) || 1;
      type = req.query.type || 'standard';
      format = req.query.format || format;
    } else if (req.method === 'POST') {
      count = parseInt(req.body?.count) || 1;
      type = req.body?.type || 'standard';
      format = req.body?.format || format;
    } else {
      res.status(405).json({
        error: 'Method Not Allowed',
        message: 'Only GET and POST methods are allowed'
      });
      return;
    }

    // 验证参数
    if (count < 1 || count > 100) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Count must be between 1 and 100'
      });
      return;
    }

    // 生成密钥
    const keys = generateKeys(count, type, format);

    // 返回结果
    res.status(200).json({
      success: true,
      count: keys.length,
      type,
      format,
      keys,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
}

// 密钥生成函数
function generateKeys(count, type, format) {
  const characters = '23456789BCDFGHJKLMNPQRSTVWXYZ';
  const keys = [];

  for (let i = 0; i < count; i++) {
    let key;

    switch(type) {
      case 'standard':
      case 'microsoft':
        key = generateStandardKey(characters);
        break;
      case 'simple':
        key = generateSimpleKey(characters);
        break;
      case 'custom':
        key = generateCustomKey(characters, format);
        break;
      default:
        key = generateStandardKey(characters);
    }

    keys.push(key);
  }

  return keys;
}

function generateStandardKey(characters) {
  let result = '';

  for (let i = 0; i < 25; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    if ((i + 1) % 5 === 0 && i < 24) {
      result += '-';
    }
  }

  return result;
}

function generateSimpleKey(characters) {
  let result = '';

  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    if ((i + 1) % 5 === 0 && i < 14) {
      result += '-';
    }
  }

  return result;
}

function generateCustomKey(characters, format) {
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