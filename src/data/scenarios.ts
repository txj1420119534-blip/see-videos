import { SCENARIO_ORDER, SCENARIOS, type ScenarioId } from '@/lib/scenarios';
import { LINGRUI_PERSONAS } from '@/lib/ai/personas';

export type { ScenarioId };

export interface Scenario {
  id: ScenarioId;
  lingruiName: string;
  lingruiTitle: string;
  lingruiImage: string;
  videoTitle: string;
  author: string;
  description: string;
  tags: string[];
  videoSrc: string;
  posterSrc: string;
  ocrHint: string;
  defaultQuestion: string;
  hookLine: string;
  cta: string;
  userPromptPlaceholder: string;
  needsUserImage?: boolean;
  analysisIntent: string;
  themeColor: string;
  bgGradient: string;
}

const PRESENTATION: Record<
  ScenarioId,
  Pick<Scenario, 'lingruiImage' | 'posterSrc' | 'hookLine' | 'analysisIntent' | 'themeColor' | 'bgGradient'>
> = {
  bixie: {
    lingruiImage: '/assets/lingrui/bixie.png',
    posterSrc: '/assets/posters/bixie-seeding.png',
    hookLine: '等一下，这条鼠标种草我闻到一点营销味。',
    analysisIntent: '识别低价鼠标种草里的卖点、证据缺口、适合人群和买前核验点，给出能买/慎买/先别买判断。',
    themeColor: '#ef4444',
    bgGradient: 'from-red-900/30 to-orange-900/20',
  },
  baize: {
    lingruiImage: '/assets/lingrui/baize.png',
    posterSrc: '/assets/posters/baize-tutorial.png',
    hookLine: '这条备考建议信息密度高，我帮你拆成今天能做的一步。',
    analysisIntent: '把考公考编备考建议拆成行动卡，区分原则、风险和今天可执行的第一步。',
    themeColor: '#3b82f6',
    bgGradient: 'from-blue-900/30 to-cyan-900/20',
  },
  jiuwei: {
    lingruiImage: '/assets/lingrui/jiuwei.png',
    posterSrc: '/assets/posters/jiuwei-style.png',
    hookLine: '别急着买同款，先看它到底好看在哪。',
    analysisIntent: '分析变装视频里的风格结构，并结合用户上传图给出不冒犯的个人化迁移建议。',
    themeColor: '#a855f7',
    bgGradient: 'from-purple-900/30 to-pink-900/20',
  },
  tianlu: {
    lingruiImage: '/assets/lingrui/tianlu.png',
    posterSrc: '/assets/posters/tianlu-ai.png',
    hookLine: '这条不是神技围观，我帮你拆成能跑的步骤。',
    analysisIntent: '把 Claude/DeepSeek 多模态补强教程拆成安全、可执行、可排错的 AI 技巧落地清单。',
    themeColor: '#06b6d4',
    bgGradient: 'from-cyan-900/30 to-sky-900/20',
  },
  xuangui: {
    lingruiImage: '/assets/lingrui/xuangui.png',
    posterSrc: '/assets/posters/xuangui-selfdiscipline.png',
    hookLine: '这条备考记录有压迫感，但你不需要被它推着跑。',
    analysisIntent: '把长期备考视频降噪，提取有用原则，改成适合用户今天状态的低负担行动。',
    themeColor: '#10b981',
    bgGradient: 'from-emerald-900/30 to-teal-900/20',
  },
};

export const scenarios: Scenario[] = SCENARIO_ORDER.map((id) => {
  const config = SCENARIOS[id];
  const presentation = PRESENTATION[id];
  const persona = LINGRUI_PERSONAS[id];

  return {
    id,
    lingruiName: config.lingruiName,
    lingruiTitle: persona.officialType,
    lingruiImage: presentation.lingruiImage,
    videoTitle: config.feedTitle,
    author: config.feedAuthor,
    description: config.feedDescription,
    tags: config.tags.map((tag) => `#${tag}`),
    videoSrc: config.videoSrc,
    posterSrc: presentation.posterSrc,
    ocrHint: config.ocrHint,
    defaultQuestion: config.defaultQuestion,
    hookLine: persona.floatingLine,
    cta: persona.ctaText,
    userPromptPlaceholder: config.defaultQuestion,
    needsUserImage: config.requiresUserImage,
    analysisIntent: presentation.analysisIntent,
    themeColor: presentation.themeColor,
    bgGradient: presentation.bgGradient,
  };
});

export function getScenarioById(id: ScenarioId): Scenario | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}
