import type { AnalyzeRequest, AnalyzeResponse, ScenarioId } from './schema';

export const MOCK_RESULTS: Record<ScenarioId, AnalyzeResponse> = {
  bixie: {
    mode: 'mock',
    scenarioId: 'bixie',
    lingruiName: '辟邪',
    roleTitle: '反种草守护灵',
    resultTitle: '辟邪鼠标种草鉴定',
    oneLineJudgement: '慎买，不是不能买，是先把参数和手感核清楚。',
    confidenceLabel: '建议：慎买',
    tags: ['低价平替', '外设种草', '先核验'],
    sections: [
      {
        title: '它真正卖你的东西',
        items: ['67 块无线类 G102，是用低价锚点降低犹豫。', '网页驱动和灯条还原，是在强化“像大牌”的想象。'],
      },
      {
        title: '先别直接当真',
        items: ['“原汁原味”“完美还原”是视频说法，不等于已验证。', '手感、延迟、品控、售后和真实续航都要另查。'],
      },
      {
        title: '适合谁',
        items: ['预算很低、只想要入门无线鼠标的人可以观察。', '打竞技游戏、很吃手感和稳定性的人先别冲。'],
      },
      {
        title: '买前 3 问',
        items: ['有没有独立评测测延迟和续航？', '网页驱动支持哪些系统和功能？', '赠品是不是我真的需要的东西？'],
      },
    ],
    actionChips: ['列买前问题', '看核验点', '改成慎买清单'],
    shareCard: {
      title: '辟邪替我按住了低价鼠标冲动',
      subtitle: '结论：慎买，先核验',
      quote: '这条种草最会的不是讲鼠标，是让你觉得不买就亏。',
      bullets: ['低价是锚点', '类 G102 需核验', '赠品别当刚需'],
      footer: '灵瑞伴看 · 辟邪',
    },
    followUpQuestions: ['帮我列一份外设买前核验表', '这条视频哪些话最像营销？', '学生党应该怎么判断能不能买？'],
  },
  baize: {
    mode: 'mock',
    scenarioId: 'baize',
    lingruiName: '白泽',
    roleTitle: '教程拆解灵',
    resultTitle: '白泽备考行动卡',
    oneLineJudgement: '这条不是上岸保证书，是一份要降压执行的备考清单。',
    confidenceLabel: '已拆成 4 步',
    tags: ['备考规划', '行动卡', '不贩焦虑'],
    sections: [
      {
        title: '视频真正讲了什么',
        items: ['核心是把备考当长期项目，不是临时抱佛脚。', '它强调减少干扰、稳定刷题、谨慎选择报班。'],
      },
      {
        title: '照着做的 4 步',
        items: ['先写清考试类型、日期和每天可用时间。', '把一年拆成基础、强化、冲刺三个阶段。', '真题优先，模拟题只做补充。', '报班前先核课程、退款和口碑。'],
      },
      {
        title: '容易踩坑',
        items: ['推掉所有聚会不一定适合每个人，要保留恢复时间。', '机构选错会消耗钱和心态，不要被“包过感”带走。'],
      },
      {
        title: '今天先做一步',
        items: ['拿纸写下未来 7 天每天能学多久。', '只选一个科目，做 30 分钟真题摸底。'],
      },
    ],
    actionChips: ['生成 7 天计划', '拆第一步', '列报班核验点'],
    shareCard: {
      title: '白泽把上岸鸡血拆成了今天的一步',
      subtitle: '备考行动卡',
      quote: '先别被“一次性上岸”点燃，先把今天 30 分钟落地。',
      bullets: ['长期规划', '真题优先', '机构谨慎'],
      footer: '灵瑞伴看 · 白泽',
    },
    followUpQuestions: ['我只有三个月怎么改？', '帮我做低压力版备考表', '报班前要问机构什么？'],
  },
  jiuwei: {
    mode: 'mock',
    scenarioId: 'jiuwei',
    lingruiName: '九尾',
    roleTitle: '风格结构识别灵',
    resultTitle: '九尾风格结构拆解',
    oneLineJudgement: '别买同款，这条好看在日常到晚宴的结构切换。',
    confidenceLabel: '适合结构迁移',
    tags: ['不买同款', '风格迁移', '氛围感'],
    sections: [
      {
        title: '它为什么好看',
        items: ['米色西装和牛仔把办公室日常感稳住。', '深蓝西装让画面更冷静，亮片裙把晚宴感拉起来。'],
      },
      {
        title: '可以抄什么',
        items: ['抄“外套+内搭+利落下装”的层次。', '抄自然光、转身、近景微笑这种松弛镜头。', '抄从低调材质到亮面材质的反差。'],
      },
      {
        title: '你的版本怎么变',
        items: ['没有上传图时，先用衣柜里的西装或衬衫试结构。', '想更日常，就把亮片换成缎面、针织或小面积金属配饰。'],
      },
      {
        title: '别硬抄',
        items: ['别把博主滤镜当成衣服效果。', '别为了晚宴感牺牲自己的通勤场景。'],
      },
    ],
    actionChips: ['生成我的版本', '改成通勤版', '降低晚宴感'],
    shareCard: {
      title: '九尾说：别买同款，先抄结构',
      subtitle: '风格迁移卡',
      quote: '这条好看不是单品赢了，是日常感和晚宴感切换得顺。',
      bullets: ['西装稳结构', '材质做反差', '镜头给松弛'],
      footer: '灵瑞伴看 · 九尾',
    },
    followUpQuestions: ['我上传照片后帮我改', '帮我做上班版', '拍照姿态怎么学？'],
  },
  tianlu: {
    mode: 'mock',
    scenarioId: 'tianlu',
    lingruiName: '天禄',
    roleTitle: 'AI 技巧落地灵',
    resultTitle: '天禄 AI 技巧落地包',
    oneLineJudgement: '这条能做，但第一步是把 Key 放安全。',
    confidenceLabel: '可执行：安全版',
    tags: ['AI工具', '多模态', '安全落地'],
    sections: [
      {
        title: '目标是什么',
        items: ['用一个视觉模型给 Claude/DeepSeek 补“看图”能力。', '脚本输入图片路径和问题，输出图片理解结果。'],
      },
      {
        title: '准备什么',
        items: ['准备可用的视觉模型接口和本地 Python 环境。', 'API Key 放到本地环境变量，不写进前端和公开仓库。'],
      },
      {
        title: '执行步骤',
        items: ['让 AI 生成 vision.py，并说明输入参数格式。', '命令形如 python C:/tmp/vision.py <图片路径> [问题]。', '先用一张无隐私测试图跑通。'],
      },
      {
        title: 'Key 安全红线',
        items: ['不要把真实 Key 发到前端页面、截图或公开视频里。', '提交代码前检查 .env、日志和终端输出。'],
      },
      {
        title: '失败先查这 3 个',
        items: ['接口地址、模型名、Key 是否匹配。', '图片路径是否存在，格式是否被模型支持。', '报错先复制给 Codex 做最小修复。'],
      },
    ],
    actionChips: ['生成安全步骤', '列排错清单', '写 Codex 提示词'],
    shareCard: {
      title: '天禄把 AI 神技拆成了安全执行清单',
      subtitle: 'Claude/DeepSeek 视觉补强',
      quote: '别先炫技，先把 API Key 藏好。',
      bullets: ['Key 只放服务端', '先用测试图跑通', '失败查接口和路径'],
      footer: '灵瑞伴看 · 天禄',
    },
    followUpQuestions: ['帮我写一段给 Codex 的任务', 'Key 应该放在哪？', '脚本跑不通怎么排查？'],
  },
  xuangui: {
    mode: 'mock',
    scenarioId: 'xuangui',
    lingruiName: '玄龟',
    roleTitle: '备考降噪陪伴灵',
    resultTitle: '玄龟备考降噪卡',
    oneLineJudgement: '你不用复制 207 天，先保住今天的一小步。',
    confidenceLabel: '低电量版优先',
    tags: ['备考降噪', '低负担', '稳住今天'],
    sections: [
      {
        title: '先把压力放小',
        items: ['“还有 58 天”会让人紧，但它不是审判。', '别人的第 207 天，不等于你的今天必须满格。'],
      },
      {
        title: '真正有用的点',
        items: ['固定场景能减少进入学习的阻力。', '台灯、笔记、安静环境，本质是在帮大脑进入状态。'],
      },
      {
        title: '三档计划',
        items: ['低电量版：打开书，标出今天一页。', '标准版：做 25 分钟真题或背诵。', '爆发版：两轮 25 分钟，中间休息 5 分钟。'],
      },
      {
        title: '今天只做一件事',
        items: ['选一个最小任务，完成就收工也可以。', '不要在焦虑时重排整个人生计划。'],
      },
    ],
    actionChips: ['只做 25 分钟', '再降一档', '写今日小任务'],
    shareCard: {
      title: '玄龟替我把备考焦虑降噪了',
      subtitle: '低负担行动卡',
      quote: '你不用复制别人的 207 天，先保住今天的一小步。',
      bullets: ['先降噪', '只做一件事', '累了就用低电量版'],
      footer: '灵瑞伴看 · 玄龟',
    },
    followUpQuestions: ['我今天只剩 10 分钟怎么办？', '帮我改成低电量版', '明天怎么继续？'],
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
      ? withJiuweiUserImageCopy(getMockResult(scenarioId))
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

function withJiuweiUserImageCopy(result: AnalyzeResponse): AnalyzeResponse {
  return {
    ...result,
    confidenceLabel: '已结合上传图',
    sections: result.sections.map((section) =>
      section.title === '你的版本怎么变'
        ? {
            ...section,
            items: [
              '我会以你上传图里可见的穿搭/场景为准，只迁移结构不评价外貌。',
              '优先保留你自己的日常基底，再加入西装层次、材质反差或更柔和的光线。',
            ],
          }
        : section
    ),
    shareCard: {
      ...result.shareCard,
      subtitle: '已结合上传图的风格迁移卡',
      bullets: ['保留你的日常基底', '只抄结构不抄人', '用材质做反差'],
    },
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
