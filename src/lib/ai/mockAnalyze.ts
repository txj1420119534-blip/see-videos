import type { AnalyzeRequest, AnalyzeResponse, ScenarioId } from './schema';

export const MOCK_RESULTS: Record<ScenarioId, AnalyzeResponse> = {
  bixie: {
    mode: 'mock',
    roleId: 'bixie',
    roleName: '辟邪',
    openingLine: '辟邪提醒你，慎重！',
    emotionRead: '这条很会让人心动：67 块、无线、像经典款，还有首发福利，手指确实容易往购买键上飘。',
    videoRead: '辟邪看见它主打前行者 A6、67 块 1 毛 5、无线类 G102、网页驱动和灯条还原。',
    coreInsight: '这不是不能买，而是别只因为“像 G102 又便宜”就立刻买。',
    sections: [
      {
        title: '辟邪先替你挡住的草',
        items: ['低价是第一钩子，容易压过你对手感和售后的判断。', '“无线类 G102”是平替叙事，不等于实际手感完全一样。', '首发福利会制造时间压力，适合先查清再下单。'],
      },
      {
        title: '买前 3 问',
        items: ['你的手型和握法真的适合它吗？', '续航、重量、传感器和售后有没有查到可靠信息？', '你是缺鼠标，还是只是被 67 元的氛围撞了一下？'],
      },
    ],
    nextActions: ['先看 2 条非带货测评', '查清售后和退换规则', '24 小时后还想买再下单'],
    memorySeed: '下次看到低价平替，辟邪会先提醒你把心跳和刚需分开。',
    shareQuote: '辟邪替我挡住了一口草。',
    tags: ['慎买', '种草避坑', '先别急'],
    confidenceNote: '辟邪只按当前视频信息提醒，关键参数还要再核实。',
  },
  baize: {
    mode: 'mock',
    roleId: 'baize',
    roleName: '白泽',
    openingLine: '白泽帮你把这团线拆开。',
    emotionRead: '“一次性上岸”这类话会让人很想立刻照做，白泽先把口号和方法分开。',
    videoRead: '白泽看见这条在讲考公考编：至少留一年、推掉聚会、别只刷模拟题、报班要谨慎。',
    coreInsight: '这条可以当备考提醒，但不能当上岸保证书。',
    sections: [
      {
        title: '白泽拆出的三根线',
        items: ['第一根是时间线：长期备考比临时冲刺更稳。', '第二根是方法线：真题和复盘比只刷模拟题更关键。', '第三根是风险线：报班不是护身符，选错会耗钱耗心力。'],
      },
      {
        title: '今天先落一小步',
        items: ['写下考试类型、剩余时间和每天可用时长。', '只选一个科目做 30 分钟真题摸底。', '把“我要上岸”改成“今天先弄懂一类题”。'],
      },
    ],
    nextActions: ['列 7 天可用时间', '做 30 分钟真题', '整理报班核验问题'],
    memorySeed: '下次看到备考经验，白泽会先帮你分清“方法”和“口号”。',
    shareQuote: '白泽把收藏变成了第一步。',
    tags: ['看懂', '行动卡', '不承诺上岸'],
    confidenceNote: '白泽不替任何机构背书，也不承诺考试结果。',
  },
  jiuwei: {
    mode: 'mock',
    roleId: 'jiuwei',
    roleName: '九尾',
    openingLine: '九尾觉得，你这样真好看。',
    emotionRead: '这类变装视频容易让人想变成画面里的人，但九尾先把你拉回来：你不用换掉自己。',
    videoRead: '九尾看见这条靠自然光、白色房间、米色西装牛仔、深蓝职场感和黑色亮片晚宴感撑起氛围。',
    coreInsight: '这套好看的重点不是同款衣服，而是干净背景、明确轮廓和动作里的松弛感。',
    sections: [
      {
        title: '九尾拆到的风格结构',
        items: ['白色空间让整个人更干净。', '米色和深蓝形成从温柔到利落的切换。', '转身和长发动态让画面有故事感。'],
      },
      {
        title: '别硬抄的部分',
        items: ['不要只买同款外套。', '不要忽略光线和背景。', '不要把博主的身形当成风格本身。'],
      },
    ],
    nextActions: ['先找一面干净浅色墙', '用同色系外套替代同款', '拍照时保留一次转身或侧身动作'],
    memorySeed: '九尾会记住：你适合先保留自己，再借一点风格的光。',
    shareQuote: '九尾说，我不用变成别人。',
    tags: ['识风格', '不买同款', '做自己'],
  },
  tianlu: {
    mode: 'mock',
    roleId: 'tianlu',
    roleName: '天禄',
    openingLine: '天禄接住了，咱们先跑第一步。',
    emotionRead: '这条教程看着很神，很容易收藏后就睡在收藏夹里。天禄先把路铺短一点。',
    videoRead: '天禄看见它在讲 Claude + DeepSeek 没多模态时，用豆包模型、API Key 和脚本补视觉识别能力。',
    coreInsight: '这条能落地，但第一步不是炫技，是把 Key 放安全。',
    sections: [
      {
        title: '天禄先备好三样',
        items: ['一个可用的视觉模型接口。', '本地 Python 环境和一张测试图。', '只放在服务端或本地环境变量里的 API Key。'],
      },
      {
        title: '最小开跑路线',
        items: ['先让 AI 生成 vision.py。', '用测试图跑一次命令。', '跑通后再接进 Claude 或 Codex 的工作流。'],
      },
      {
        title: '安全小铃铛',
        items: ['Key 不进前端。', 'Key 不进公开仓库。', 'Key 不出现在截图和群聊里。'],
      },
    ],
    nextActions: ['先建本地 .env', '用测试图跑一次', '失败先查 base_url 和模型名'],
    memorySeed: '下次看到教程，天禄会先帮你找最小可执行步骤。',
    shareQuote: '天禄把收藏夹推成了开始。',
    tags: ['开跑', 'AI教程', 'Key安全'],
    confidenceNote: '天禄会认真守住 API Key，不诱导你暴露密钥。',
  },
  xuangui: {
    mode: 'mock',
    roleId: 'xuangui',
    roleName: '玄龟',
    openingLine: '玄龟在这儿，先把声音调小。',
    emotionRead: '看到“备考第 207 天”和“还有 58 天”，人很容易被别人的进度压住。玄龟先陪你把这口气放平。',
    videoRead: '玄龟听见这条视频里有倒计时、长期备考和“谁懂啊”的压力感。',
    coreInsight: '这条视频可以提醒你继续走，但不该拿来羞辱今天的自己。',
    sections: [
      {
        title: '低电量版',
        items: ['打开资料，只做 15 分钟。', '不用追进度，只标出一个不会的点。'],
      },
      {
        title: '标准版',
        items: ['完成一个小节。', '做 5 道题并订正。'],
      },
      {
        title: '想冲一把版',
        items: ['做一套限时小练习。', '结束后写 3 行复盘。'],
      },
    ],
    nextActions: ['今天只做一件事：开始 15 分钟', '把倒计时从屏幕上挪开', '完成后给自己留一个可继续的入口'],
    memorySeed: '玄龟会记住：你不适合被猛推，适合被稳稳接住。',
    shareQuote: '玄龟说，先别熄灭就好。',
    tags: ['低电量', '稳住', '备考降噪'],
  },
};

export async function mockAnalyze(
  reqOrScenarioId: AnalyzeRequest | ScenarioId | undefined,
  fallbackReason?: string
): Promise<AnalyzeResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const scenarioId = getScenarioId(reqOrScenarioId);
  const request = typeof reqOrScenarioId === 'object' ? reqOrScenarioId : undefined;
  const result =
    scenarioId === 'jiuwei' && request?.userImageBase64
      ? withJiuweiUserImageCopy(getMockResult(scenarioId), request.question)
      : getMockResult(scenarioId);

  return withDebug(result, {
    usedVision: Boolean(request?.frameImageBase64),
    usedUserImage: Boolean(request?.userImageBase64),
    fallbackReason,
  });
}

export function getMockResult(scenarioId: ScenarioId): AnalyzeResponse {
  return clone(MOCK_RESULTS[scenarioId] ?? MOCK_RESULTS.bixie);
}

function getScenarioId(reqOrScenarioId: AnalyzeRequest | ScenarioId | undefined): ScenarioId {
  if (!reqOrScenarioId) return 'bixie';
  if (typeof reqOrScenarioId === 'string') return reqOrScenarioId;
  return reqOrScenarioId.scenarioId;
}

function withDebug(
  result: AnalyzeResponse,
  debug: NonNullable<AnalyzeResponse['debug']>
): AnalyzeResponse {
  return {
    ...result,
    mode: 'mock',
    debug,
  };
}

function withJiuweiUserImageCopy(result: AnalyzeResponse, question = ''): AnalyzeResponse {
  const isNotRecommendedDemo = /男|男生|male|boy/i.test(question);

  return {
    ...result,
    openingLine: isNotRecommendedDemo ? '九尾先把光挪一挪，不硬套。' : '九尾觉得，你这样真好看。',
    emotionRead: isNotRecommendedDemo
      ? '如果这套女装方向让你有点犹豫，九尾不推你硬套，我们换一种方式靠近它。'
      : '这张图里的你不用变成博主，九尾只借一点风格的光给你。',
    coreInsight: isNotRecommendedDemo ? '亮片和吊带别整套照搬，保留轮廓和光线就够靠近。' : '这套可以试，先保留自己，再借一点西装层次和材质反差。',
    sections: [
      {
        title: isNotRecommendedDemo ? '九尾轻轻改一版' : '九尾往你身上挪一点',
        items: isNotRecommendedDemo
          ? ['保留西装外套的利落线条。', '把亮片缩小到领口、耳饰或包上。', '吊带裙可以换成深色上衣或垂坠衬衫。']
          : ['米色或深色外套都可以先试。', '亮片不必全身上，小面积就会发光。', '拍照时留一个侧身或转身动作。'],
      },
      {
        title: '九尾不让你丢掉自己',
        items: ['不按颜值打分。', '不把博主身形当成标准。', '只抄结构、光线和松弛感。'],
      },
    ],
    nextActions: isNotRecommendedDemo ? ['先试深色外套', '亮片只用小面积', '拍一张侧身光线照'] : ['找一件外套试轮廓', '选一个亮面小配饰', '拍一张自然光侧身'],
    memorySeed: '九尾会记住：你不喜欢被改造成别人，只想把风格挪近一点。',
    shareQuote: isNotRecommendedDemo ? '九尾说，不硬套，也能靠近那束光。' : '九尾说，我不用变成别人。',
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
