interface OpenAICompatibleRequest {
  baseUrl: string;
  apiKey: string;
  model: string;
  timeoutMs: number;
  system: string;
  userText: string;
  frameImageBase64?: string;
  userImageBase64?: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
}

type MessageContent = NonNullable<ChatCompletionResponse['choices']>[number]['message'] extends infer Message
  ? Message extends { content?: infer Content }
    ? Content
    : never
  : never;

export async function callOpenAICompatible(req: OpenAICompatibleRequest): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), req.timeoutMs);

  try {
    const response = await fetch(toChatCompletionsUrl(req.baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${req.apiKey}`,
      },
      body: JSON.stringify({
        model: req.model,
        messages: [
          { role: 'system', content: req.system },
          { role: 'user', content: buildUserContent(req) },
        ],
        temperature: 0.7,
        max_tokens: 1800,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`LLM_HTTP_ERROR:${response.status}`);
    }

    const data = (await response.json()) as ChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content;
    const text = extractMessageText(content);

    if (!text) {
      throw new Error('LLM_EMPTY_RESPONSE');
    }

    return text;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('LLM_TIMEOUT');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function buildUserContent(req: OpenAICompatibleRequest) {
  return [
    { type: 'text', text: req.userText },
    req.frameImageBase64
      ? { type: 'image_url', image_url: { url: toDataUrl(req.frameImageBase64) } }
      : null,
    req.userImageBase64
      ? { type: 'image_url', image_url: { url: toDataUrl(req.userImageBase64) } }
      : null,
  ].filter(Boolean);
}

function toDataUrl(value: string): string {
  return value.startsWith('data:') ? value : `data:image/png;base64,${value}`;
}

function toChatCompletionsUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, '');
  if (trimmed.endsWith('/chat/completions')) return trimmed;
  return `${trimmed}/chat/completions`;
}

function extractMessageText(content: MessageContent | undefined): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (part.type === 'text' ? part.text ?? '' : ''))
      .join('')
      .trim();
  }
  return '';
}
