// Cloudflare Workers API - 产品密钥生成器
// 部署到: https://workers.cloudflare.com/

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 设置CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // 只处理 /api/generate 路径
    if (url.pathname !== '/api/generate') {
      return new Response(JSON.stringify({
        error: 'Not Found',
        message: 'Endpoint not found. Use /api/generate'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }

    try {
      let count = 1;
      let type = 'standard';
      let format = 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX';

      // 根据请求方法获取参数
      if (request.method === 'GET') {
        count = parseInt(url.searchParams.get('count')) || 1;
        type = url.searchParams.get('type') || 'standard';
        format = url.searchParams.get('format') || format;
      } else if (request.method === 'POST') {
        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const body = await request.json();
          count = parseInt(body.count) || 1;
          type = body.type || 'standard';
          format = body.format || format;
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const formData = await request.formData();
          count = parseInt(formData.get('count')) || 1;
          type = formData.get('type') || 'standard';
          format = formData.get('format') || format;
        }
      } else {
        return new Response(JSON.stringify({
          error: 'Method Not Allowed',
          message: 'Only GET and POST methods are allowed'
        }), {
          status: 405,
          headers: corsHeaders
        });
      }

      // 验证参数
      if (count < 1 || count > 100) {
        return new Response(JSON.stringify({
          error: 'Bad Request',
          message: 'Count must be between 1 and 100'
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // 生成密钥
      const keys = generateKeys(count, type, format);

      // 返回结果
      return new Response(JSON.stringify({
        success: true,
        count: keys.length,
        type,
        format,
        keys,
        timestamp: new Date().toISOString()
      }), {
        headers: corsHeaders
      });

    } catch (error) {
      console.error('API Error:', error);

      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
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