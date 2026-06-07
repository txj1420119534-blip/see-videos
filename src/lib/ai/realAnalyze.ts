import { AnalyzeRequest, AnalyzeResponse, AnalyzeResponseSchema } from './schema';
import { buildPrompts } from './promptBuilder';
import { callOpenAICompatible } from './providers/openaiCompatible';
import { getLingruiPersona } from './personas';
import { analyzeStyle, STYLE_REWRITE_PROMPT } from './styleLint';

export async function realAnalyze(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  const baseUrl = process.env.LLM_BASE_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;

  if (!baseUrl || !apiKey || !model) {
    throw new Error('MISSING_ENV');
  }

  const timeoutMs = Number(process.env.LLM_TIMEOUT_MS || 18000);
  const { system, userText } = buildPrompts(req);

  const callPayload = {
    baseUrl,
    apiKey,
    model,
    timeoutMs,
    system,
    userText,
    frameImageBase64: req.frameImageBase64,
    userImageBase64: req.userImageBase64,
  };

  const text = await callOpenAICompatible(callPayload);

  const checked = parseAndValidate(text, req);
  let data = checked.data;
  let styleRewrite = false;

  if (analyzeStyle(data).hasAISmell) {
    const rewriteText = await callOpenAICompatible({
      ...callPayload,
      system: [STYLE_REWRITE_PROMPT, system].join('\n\n---\n\n'),
      userText: JSON.stringify(stripDebug(data)),
      frameImageBase64: undefined,
      userImageBase64: undefined,
    });
    data = parseAndValidate(rewriteText, req).data;
    styleRewrite = true;

    if (analyzeStyle(data).hasAISmell) {
      throw new Error('LLM_AI_SMELL');
    }
  }

  return {
    ...data,
    mode: 'real',
    roleId: req.scenarioId,
    debug: {
      ...data.debug,
      usedVision: Boolean(req.frameImageBase64),
      usedUserImage: Boolean(req.userImageBase64),
      rawModelName: model,
      styleRewrite,
    },
  };
}

function normalizeModelJson(value: unknown, req: AnalyzeRequest): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const persona = getLingruiPersona(req.scenarioId);
  const source = value as Partial<AnalyzeResponse> & Record<string, unknown>;

  return {
    mode: 'real',
    roleId: req.scenarioId,
    roleName: persona.roleName,
    openingLine: persona.openingLine,
    shareQuote: persona.shareQuote,
    memorySeed: persona.memorySeedTemplate,
    tags: [],
    ...source,
  };
}

function parseAndValidate(text: string, req: AnalyzeRequest) {
  const rawJson = extractJsonObject(text);
  if (!rawJson) {
    throw new Error('LLM_JSON_PARSE_FAILED');
  }

  const checked = AnalyzeResponseSchema.safeParse(normalizeModelJson(rawJson, req));
  if (!checked.success) {
    console.error(
      '[realAnalyze] Model JSON failed schema validation:',
      checked.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        code: issue.code,
        message: issue.message,
      }))
    );
    throw new Error('LLM_SCHEMA_INVALID');
  }

  return checked;
}

function stripDebug(result: AnalyzeResponse) {
  return Object.fromEntries(
    Object.entries(result).filter(([key]) => key !== 'debug' && key !== 'mode')
  );
}

function extractJsonObject(text: string): unknown | null {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;

    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}
