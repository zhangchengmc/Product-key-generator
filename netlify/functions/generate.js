// Netlify Function - 产品密钥生成器
// 部署到: https://app.netlify.com/

exports.handler = async function(event, context) {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // 只处理 /api/generate 路径
  if (event.path !== '/api/generate') {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: 'Not Found',
        message: 'Endpoint not found. Use /api/generate'
      })
    };
  }

  try {
    let count = 1;
    let type = 'standard';
    let format = 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX';

    // 根据请求方法获取参数
    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters || {};
      count = parseInt(params.count) || 1;
      type = params.type || 'standard';
      format = params.format || format;
    } else if (event.httpMethod === 'POST') {
      const contentType = event.headers['content-type'] || '';

      if (contentType.includes('application/json')) {
        const body = JSON.parse(event.body || '{}');
        count = parseInt(body.count) || 1;
        type = body.type || 'standard';
        format = body.format || format;
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(event.body || '');
        count = parseInt(params.get('count')) || 1;
        type = params.get('type') || 'standard';
        format = params.get('format') || format;
      }
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          error: 'Method Not Allowed',
          message: 'Only GET and POST methods are allowed'
        })
      };
    }

    // 验证参数
    if (count < 1 || count > 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad Request',
          message: 'Count must be between 1 and 100'
        })
      };
    }

    // 生成密钥
    const keys = generateKeys(count, type, format);

    // 返回结果
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: keys.length,
        type,
        format,
        keys,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('API Error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      })
    };
  }
};

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