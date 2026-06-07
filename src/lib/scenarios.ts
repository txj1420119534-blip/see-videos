export type ScenarioId = 'bixie' | 'baize' | 'jiuwei' | 'tianlu' | 'xuangui';

export interface ScenarioConfig {
  id: ScenarioId;
  videoSrc: string;
  lingruiName: string;
  roleTitle: string;
  feedTitle: string;
  feedAuthor: string;
  feedDescription: string;
  tags: string[];
  ocrHint: string;
  defaultQuestion: string;
  ctaText: string;
  requiresUserImage?: boolean;
}

export const SCENARIO_ORDER: ScenarioId[] = ['bixie', 'baize', 'jiuwei', 'tianlu', 'xuangui'];

export const SCENARIOS: Record<ScenarioId, ScenarioConfig> = {
  bixie: {
    id: 'bixie',
    videoSrc: '/videos/bixie.mp4',
    lingruiName: '辟邪',
    roleTitle: '守护型灵宠',
    feedTitle: '67 块买到无线类 G102？',
    feedAuthor: '@前行者鼠标种草视频',
    feedDescription: '前行者 A6 鼠标，强调低价、类 G102、网页驱动、首发福利、灯条还原。',
    tags: ['鼠标', '种草', '平替', '外设', '避坑'],
    ocrHint:
      '67块1毛5就能买到无线的类G102；甚至还能用网页驱动；首发双重福利；128元赠品；保持原版的原汁原味；连尾部灯条都完美还原。',
    defaultQuestion: '这条鼠标种草视频值不值得信？我该不该冲？',
    ctaText: '让辟邪看看值不值',
  },
  baize: {
    id: 'baize',
    videoSrc: '/videos/baize.mp4',
    lingruiName: '白泽',
    roleTitle: '智慧型灵宠',
    feedTitle: '考公考编一次性上岸的秘诀',
    feedAuthor: '@备考经验分享',
    feedDescription:
      '手写笔记讲解考公考编备考路线，包括一年备考、推掉聚会、刷题、机构报班等建议。',
    tags: ['考公', '考编', '备考', '学习规划', '行动卡'],
    ocrHint:
      '考公考编一次性上岸的秘诀；至少留出一年的时间去备考；选择聚会全部都要推掉；不要只刷模拟试题；如果考虑选机构报班；如果机构选不对二战也好。',
    defaultQuestion: '这条备考建议到底讲了什么？我今天能先做哪一步？',
    ctaText: '让白泽拆成行动卡',
  },
  jiuwei: {
    id: 'jiuwei',
    videoSrc: '/videos/jiuwei.mp4',
    lingruiName: '九尾',
    roleTitle: '奇想型灵宠',
    feedTitle: '办公室到晚宴的氛围感变装',
    feedAuthor: '@风格穿搭视频',
    feedDescription:
      '女性模特在明亮室内展示米色西装牛仔、深蓝衬衫西装、黑色亮片吊带裙等多套造型。',
    tags: ['穿搭', '妆容', '拍照', '风格迁移', '不买同款'],
    ocrHint:
      '画面包含：自然光室内、米色西装外套+白色内搭+牛仔裤、深蓝衬衫/西装、黑色亮片吊带裙、背影转身、近景微笑。',
    defaultQuestion: '这个视频真正好看的结构是什么？我怎么变成自己的版本？',
    ctaText: '让九尾拆风格',
    requiresUserImage: true,
  },
  tianlu: {
    id: 'tianlu',
    videoSrc: '/videos/tianlu.mp4',
    lingruiName: '天禄',
    roleTitle: '活力型灵宠',
    feedTitle: 'Claude + DeepSeek 没多模态？两步加眼睛',
    feedAuthor: '@AI 实用技巧分享',
    feedDescription:
      '教程演示如何用豆包模型和 API Key，给 Claude/DeepSeek 做一个视觉识别调用脚本。',
    tags: ['AI工具', 'Claude', 'DeepSeek', '多模态', '执行清单'],
    ocrHint:
      '你的Claude+DeepSeek没有多模态看不了图片；两步让你的Claude拥有千倍强大眼睛；到Claude对话框输入文本；给你豆包模型和它的Key，帮我做个视觉识别模型；等它跑完脚本；python C:/tmp/vision.py <图片路径> [可选的自定义问题]。',
    defaultQuestion: '这条 AI 教程我怎么安全、快速地照着做？',
    ctaText: '让天禄跑第一步',
  },
  xuangui: {
    id: 'xuangui',
    videoSrc: '/videos/xuangui.mp4',
    lingruiName: '玄龟',
    roleTitle: '治愈型灵宠',
    feedTitle: '这是我备考的第 207 天，还有 58 天',
    feedAuthor: '@深夜备考记录',
    feedDescription:
      '昏暗图书馆/自习室里，一个女生在台灯下备考，字幕强调长期备考和倒计时压力。',
    tags: ['备考', '自律', '焦虑降噪', '低负担计划', '陪伴'],
    ocrHint: '这是我备考的第207天；还有58天；谁懂啊。画面为夜间自习、台灯、笔记、安静但压迫的备考氛围。',
    defaultQuestion: '我刷到这种备考视频有点焦虑，今天到底该怎么做？',
    ctaText: '让玄龟降噪',
  },
};

export function getScenarioConfig(id: ScenarioId): ScenarioConfig {
  return SCENARIOS[id];
}
