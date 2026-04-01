/**
 * API Provider Adapters | API 渠道适配器
 * 适配不同 API 提供商的请求参数和响应格式
 */

// 渠道适配配置
export const PROVIDERS = {
  volcengine: {
    label: '火山引擎',
    defaultBaseUrl: 'https://ark.cn-beijing.volces.com',
    // 端点路径
    endpoints: {
      chat: '/api/v3/chat/completions',
      image: '/api/v3/images/generations',
      video: '/api/v3/video/generations',
      videoQuery: '/api/v3/video/task/{taskId}'
    },
    // 火山引擎请求适配 (与 OpenAI 完全兼容)
    requestAdapter: {
      chat: (params) => {
        const adapted = {
          model: params.model,
          messages: params.messages
        }
        if (params.temperature !== undefined) adapted.temperature = params.temperature
        if (params.max_tokens !== undefined) adapted.max_tokens = params.max_tokens
        if (params.stream !== undefined) adapted.stream = params.stream
        return adapted
      },
      image: (params) => {
        const adapted = {
          model: params.model,
          prompt: params.prompt
        }
        // 火山引擎支持的参数
        if (params.size) adapted.size = params.size
        if (params.n) adapted.n = params.n
        if (params.quality) adapted.quality = params.quality
        if (params.style) adapted.style = params.style
        // 支持单图或多图输入 (image 可以是 string 或 array)
        if (params.image) {
          // 如果是数组且只有一张图，转换为单图
          if (Array.isArray(params.image)) {
            adapted.image = params.image.length === 1 ? params.image[0] : params.image
          } else {
            adapted.image = params.image
          }
        }
        // 输出格式
        if (params.output_format) adapted.output_format = params.output_format
        // 水印
        if (params.watermark !== undefined) adapted.watermark = params.watermark
        // 组图生成相关
        if (params.sequential_image_generation) adapted.sequential_image_generation = params.sequential_image_generation
        if (params.sequential_image_generation_options) adapted.sequential_image_generation_options = params.sequential_image_generation_options
        // 提示词优化
        if (params.optimize_prompt_options) adapted.optimize_prompt_options = params.optimize_prompt_options
        return adapted
      },
      video: (params) => {
        const adapted = {
          model: params.model,
          prompt: params.prompt || ''
        }
        if (params.first_frame_image) adapted.first_frame_image = params.first_frame_image
        if (params.last_frame_image) adapted.last_frame_image = params.last_frame_image
        if (params.size) adapted.size = params.size
        if (params.seconds) adapted.seconds = params.seconds
        return adapted
      }
    },
    // 火山引擎响应适配 (与 OpenAI 完全兼容)
    responseAdapter: {
      chat: (response) => {
        if (response.choices && response.choices.length > 0) {
          return response.choices[0].message?.content || ''
        }
        return ''
      },
      image: (response) => {
        const data = response.data || response
        return (Array.isArray(data) ? data : [data]).map(item => ({
          url: item.url || item.b64_json || '',
          revisedPrompt: item.revised_prompt || '',
          size: item.size || '', // 火山引擎返回的尺寸
          b64_json: item.b64_json || ''
        }))
      },
      video: (response) => {
        return {
          url: response.data?.url || response.url || response.data?.[0]?.url || '',
          ...response
        }
      }
    }
  },

  // 默认使用火山引擎
  default: 'volcengine'
}

// 获取渠道列表
export const getProviderList = () => {
  return Object.entries(PROVIDERS)
    .filter(([key]) => key !== 'default')
    .map(([key, value]) => ({
      key,
      label: value.label
    }))
}

// 获取默认渠道
export const getDefaultProvider = () => {
  return PROVIDERS.default || 'chatfire'
}

// 获取渠道的默认 Base URL
export const getDefaultBaseUrl = (providerKey) => {
  const config = getProviderConfig(providerKey)
  return config.defaultBaseUrl || ''
}

// 获取渠道配置
export const getProviderConfig = (providerKey) => {
  return PROVIDERS[providerKey] || PROVIDERS[PROVIDERS.default]
}
