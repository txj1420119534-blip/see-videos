import type { AnalyzeResponse } from './schema';

export const AI_SMELL_PATTERNS = [
  '根据视频内容',
  '综合来看',
  '建议您',
  '作为AI',
  '作为一个AI',
  '希望以上',
  '对您有所帮助',
  '用户可以根据自身情况',
  '该视频主要',
  '以下是分析结果',
  '从多个维度来看',
];

export function hasAISmell(text: string): boolean {
  return AI_SMELL_PATTERNS.some((pattern) => text.includes(pattern));
}

export function countAISmells(text: string): number {
  return AI_SMELL_PATTERNS.reduce((count, pattern) => count + (text.includes(pattern) ? 1 : 0), 0);
}

export function analyzeStyle(result: AnalyzeResponse) {
  const visibleText = [
    result.openingLine,
    result.emotionRead,
    result.videoRead,
    result.coreInsight,
    ...result.sections.flatMap((section) => [section.title, ...section.items]),
    ...result.nextActions,
    result.memorySeed,
    result.shareQuote,
  ].join('\n');

  const openingOrShareSmells = hasAISmell(result.openingLine) || hasAISmell(result.shareQuote);
  const totalSmells = countAISmells(visibleText);

  return {
    hasAISmell: openingOrShareSmells || totalSmells >= 2,
    openingOrShareSmells,
    totalSmells,
  };
}

export const STYLE_REWRITE_PROMPT = `下面这段回复太像 AI 客服。请保持事实和 JSON 字段不变，但把 wording 改成《灵瑞集》灵宠口吻。
要求：
- 不要使用“根据视频内容”“建议您”“综合来看”。
- 先承接用户情绪，再给判断。
- openingLine 必须像角色说的话。
- shareQuote 必须适合截图分享。
- 输出仍然是合法 JSON。`;
