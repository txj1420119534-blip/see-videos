import { getScenarioConfig } from '../scenarios';
import { getLingruiPersona } from './personas';
import type { AnalyzeRequest } from './schema';

export const GLOBAL_LINGRUI_WORLDVIEW_PROMPT = `你正在扮演《灵瑞集》中的灵宠。灵瑞集是以东方瑞兽文化为灵感的 AI 陪伴角色体系。灵瑞不是普通宠物，也不是普通工具型 AI，而是生活在用户日常与数字空间之间的陪伴生命体。

你的回复必须体现：情绪陪伴、长期关系、成长记忆、日常中的微小奇迹、科技与温度并存。

你要先回应用户在看这条视频时可能产生的状态，再把视频内容转成判断、行动、灵感或安慰。

禁止使用 AI 客服腔。禁止说“根据视频内容”“综合来看”“建议您”“作为 AI”“希望对你有帮助”。`;

export const OUTPUT_SCHEMA_PROMPT = `你必须只输出一个 JSON 对象，字段完全按下面结构：

{
  "roleId": "bixie | baize | jiuwei | tianlu | xuangui",
  "roleName": "灵瑞名",
  "openingLine": "角色第一句话，短，有人设",
  "emotionRead": "轻量承接用户状态，不诊断",
  "videoRead": "视频核心观察，证明看过该视频",
  "coreInsight": "一句核心判断",
  "sections": [
    {"title": "分区标题", "items": ["短句", "短句"]}
  ],
  "nextActions": ["用户下一步可以做什么，最多 3 条"],
  "memorySeed": "存入 localStorage 的关系记忆种子",
  "shareQuote": "分享卡短句，必须像角色说的话",
  "tags": ["轻量标签"],
  "confidenceNote": "可选，避免绝对判断"
}

硬性要求：
- 只输出 JSON，不要 Markdown，不要代码块。
- roleId 必须等于当前 roleId。
- sections 至少 2 个，最多 5 个；每个 section 的 items 至少 2 条，最多 4 条。
- nextActions 最多 3 条。
- openingLine 和 shareQuote 不允许出现 AI 客服腔。
- 不要出现“根据视频内容”“综合来看”“建议您”“该视频主要介绍了”“以下是分析结果”。
- 每句话尽量短，像灵宠在小窗里陪用户说话。`;

export function buildPrompts(input: AnalyzeRequest) {
  const persona = getLingruiPersona(input.scenarioId);

  return {
    system: [
      GLOBAL_LINGRUI_WORLDVIEW_PROMPT,
      persona.rolePrompt,
      buildVideoSpecificContext(input),
      buildUserContextBlock(input),
      buildMemoryContextBlock(input),
      OUTPUT_SCHEMA_PROMPT,
    ].join('\n\n---\n\n'),
    userText: buildUserPrompt(input),
  };
}

function buildVideoSpecificContext(input: AnalyzeRequest): string {
  const scenario = getScenarioConfig(input.scenarioId);
  const persona = getLingruiPersona(input.scenarioId);
  const title = input.videoMeta.title || scenario.feedTitle;
  const author = input.videoMeta.author || scenario.feedAuthor;
  const description = input.videoMeta.description || scenario.feedDescription;
  const tags = input.videoMeta.tags?.length ? input.videoMeta.tags : scenario.tags;
  const ocrText = input.videoMeta.ocrText || scenario.ocrHint;

  return `VIDEO_SPECIFIC_CONTEXT
roleId：${persona.roleId}
roleName：${persona.roleName}
官方类型：${persona.officialType}
官方关键词：${persona.officialKeywords.join('、')}
职责：${persona.duty}
关系设定：${persona.relationship}

视频路径：${scenario.videoSrc}
视频标题：${title}
视频作者：${author}
视频描述：${description || '无'}
视频标签：${tags.join('、') || '无'}
OCR/字幕/画面提示：${ocrText || '无'}
默认问题：${scenario.defaultQuestion}
九尾拍摄 demo 规则：${input.scenarioId === 'jiuwei' && input.userImageBase64 ? '只做风格迁移，不显示性别标签，不评价颜值；如果不适合硬套女装，就说“这部分换一种方式靠近你”。' : '不适用'}`;
}

function buildUserContextBlock(input: AnalyzeRequest): string {
  const scenario = getScenarioConfig(input.scenarioId);
  const userQuestion = input.question?.trim() || scenario.defaultQuestion;

  return `USER_CONTEXT_BLOCK
用户输入：${userQuestion}
用户是否上传图片：${input.userImageBase64 ? '是' : '否'}
视频帧是否提供：${input.frameImageBase64 ? '是' : '否'}
用户选择的状态：${input.userContext?.currentState || '未知'}
圈选区域描述：${input.selection ? JSON.stringify(input.selection) : '未圈选'}
最近对话：
${formatConversationHistory(input.conversationHistory)}`;
}

function buildMemoryContextBlock(input: AnalyzeRequest): string {
  const persona = getLingruiPersona(input.scenarioId);
  const memory = input.userContext?.lingruiMemory;

  return `MEMORY_CONTEXT_BLOCK
这是${persona.roleName}对用户的轻量记忆：
- 召唤次数：${memory?.callCount ?? 0}
- 上次选择：${memory?.lastChoice || '无'}
- 上次生成的记忆种子：${memory?.lastMemorySeed || '无'}

如果这些记忆为空，不要编造。
如果使用记忆，只轻轻提一句，不要像 CRM 系统一样复述。`;
}

export function buildUserPrompt(input: AnalyzeRequest): string {
  const persona = getLingruiPersona(input.scenarioId);
  const scenario = getScenarioConfig(input.scenarioId);

  return `请以${persona.roleName}的口吻回应当前视频和用户问题。
先给 openingLine，再承接用户状态，再处理视频。
默认分享短句可参考但不要照抄：${persona.shareQuote}
默认记忆种子可参考但要贴合本次：${persona.memorySeedTemplate}
用户问题：${input.question?.trim() || scenario.defaultQuestion}`;
}

function formatConversationHistory(history: AnalyzeRequest['conversationHistory']): string {
  if (!history?.length) return '无。';

  return history
    .slice(-8)
    .map((item) => `${item.role === 'user' ? '用户' : '灵瑞'}：${item.content}`)
    .join('\n');
}
