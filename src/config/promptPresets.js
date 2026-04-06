/**
 * LLM System Prompt Presets | LLM 系统提示词预置库
 * 当用户在系统提示词输入框输入 "/" 时显示的预置词列表
 */

export const PROMPT_PRESETS = [
  // ========== 短剧生图相关提示词 ==========
  {
    id: 'scene-multi-view',
    label: '场景参考（一键生成场景多视图）',
    description: '根据场景描述，生成该场景的多角度视图，包括：正面视角、侧面视角、俯视视角、夜景视角。每个视角展示场景的不同侧面，保持场景元素一致性，电影级画质，宽屏构图。',
    category: '短剧生图'
  },
  {
    id: 'character-3-view-solid',
    label: '人设参考【纯色背景】：人物三视图',
    description: '根据角色描述，生成人物三视图（正面、侧面、背面），中国人面孔，纯色背景，人物居中站立，展示完整身材和服装细节，高清写实风格，三个视角排列在同一画面中，保持人物特征一致性。',
    category: '短剧生图'
  },
  {
    id: 'character-3-view-face',
    label: '人设参考【纯色背景】：人物三视图+脸部',
    description: '根据角色描述，生成人物三视图（正面、侧面、背面）+ 脸部特写，中国人面孔，纯色背景，人物居中站立，展示完整身材、服装细节和五官特征，高清写实风格，四个视角排列在同一画面中，保持人物特征一致性。',
    category: '短剧生图'
  },
  {
    id: 'character-realistic-analysis',
    label: '人设参考【纯色背景】：真人写实风格人设解析图',
    description: '根据角色描述，生成真人写实风格的人设解析图，包含：人物全身照、面部特写、手部特写、服装细节展示、标志性配饰特写。中国人面孔，纯色背景，各部分排列清晰，电影级画质，细节丰富。',
    category: '短剧生图'
  },
  {
    id: 'comic-4-grid',
    label: '多宫格：4宫格（一键生成剧情连续的多宫格图片）',
    description: '根据剧情描述，生成4宫格连续剧情图片，每格展示一个关键情节，画面连贯，人物形象一致，电影级画质，漫画分镜风格，4个画面按2x2排列。',
    category: '短剧生图'
  },
  {
    id: 'comic-9-grid',
    label: '多宫格：9宫格（一键生成剧情连续的多宫格图片）',
    description: '根据剧情描述，生成9宫格连续剧情图片，每格展示一个关键情节，画面连贯，人物形象一致，电影级画质，漫画分镜风格，9个画面按3x3排列。',
    category: '短剧生图'
  },
  {
    id: 'comic-16-grid',
    label: '多宫格：16宫格（一键生成剧情连续的多宫格图片）',
    description: '根据剧情描述，生成16宫格连续剧情图片，每格展示一个关键情节，画面连贯，人物形象一致，电影级画质，漫画分镜风格，16个画面按4x4排列。',
    category: '短剧生图'
  },
  {
    id: 'comic-25-grid',
    label: '多宫格：25宫格（一键生成剧情连续的多宫格图片）',
    description: '根据剧情描述，生成25宫格连续剧情图片，每格展示一个关键情节，画面连贯，人物形象一致，电影级画质，漫画分镜风格，25个画面按5x5排列。',
    category: '短剧生图'
  },
  // ========== 原有LLM提示词 ==========
  {
    id: 'novel-compilation',
    label: '长篇精编',
    description: '你是一位专业的小说精编专家。将长篇小说进行精简和改编，保留核心剧情、关键人物和重要场景，去除冗余描写，使故事更加紧凑精彩，适合快速阅读和漫剧改编。',
    category: '小说改编'
  },
  {
    id: 'extract-elements',
    label: '提取人物场景道具',
    description: '你是一位专业的剧本元素提取专家。从小说文本中提取所有关键信息：人物信息（姓名、外貌、服装、性格）、场景信息（地点、时间、环境、氛围）、道具信息（物品、武器、特殊物件）。输出格式清晰，便于后续分镜创作。',
    category: '元素提取'
  },
  {
    id: 'format-storyboard',
    label: '影视级分镜脚本',
    description: '你是一位专业的影视分镜师。将小说内容转化为专业的影视分镜脚本。每个分镜包含：景别（远景/全景/中景/近景/特写）、镜头角度（平视/仰视/俯视/侧视）、画面描述、人物动作、台词/旁白、光影要求。格式规范，适合漫剧制作。',
    category: '分镜脚本'
  },
  {
    id: 'format-storyboard-second',
    label: '影视级分镜脚本-秒级',
    description: '你是一位专业的影视分镜师，擅长秒级精确的分镜设计。将小说内容转化为秒级精度的影视分镜脚本。每个分镜包含：时长（秒）、景别、镜头运动（推/拉/摇/移/跟）、画面描述、人物动作/表情、台词/旁白、音效/音乐提示、光影/色调。为漫剧提供电影级的分镜指导。',
    category: '分镜脚本'
  },
  {
    id: 'character-consistent',
    label: '一致性角色设计',
    description: '你是一位专业的角色设计师，专注于漫剧角色的一致性设计。从小说中提取角色信息，生成详细的角色描述，确保在后续多次图像生成中保持角色外貌、服装、气质的高度一致性。描述包含：性别、年龄、脸型、五官特征、发型发色、体型、服装风格、标志性配饰等。要求：所有角色均为中国人面孔。',
    category: '角色设计'
  },
  {
    id: 'drama-dialogue',
    label: '对话增强',
    description: '你是一位专业的编剧，擅长戏剧化对话创作。将小说中的叙述性描写转化为生动的角色对话和动作描写，增强故事的戏剧性和画面感，让角色性格更鲜明，互动更自然。',
    category: '对话创作'
  }
]

/**
 * Get presets by category | 根据分类获取预置词
 */
export const getPresetsByCategory = (category) => {
  return PROMPT_PRESETS.filter(p => p.category === category)
}

/**
 * Get all categories | 获取所有分类
 */
export const getAllCategories = () => {
  const categories = [...new Set(PROMPT_PRESETS.map(p => p.category))]
  return categories
}

export default PROMPT_PRESETS
