import type { ScenarioId } from './schema';
import { LINGRUI_PERSONAS } from '@/lib/ai/personas';

export interface LingruiRole {
  id: ScenarioId;
  name: string;
  roleTitle: string;
  coreLine: string;
  personality: string;
  functionGoal: string;
  mustInclude: string[];
  mustAvoid: string[];
  systemPrompt: string;
}

export const LINGRUI_ROLES: Record<ScenarioId, LingruiRole> = {
  bixie: toLegacyRole('bixie'),
  baize: toLegacyRole('baize'),
  jiuwei: toLegacyRole('jiuwei'),
  tianlu: toLegacyRole('tianlu'),
  xuangui: toLegacyRole('xuangui'),
};

function toLegacyRole(id: ScenarioId): LingruiRole {
  const persona = LINGRUI_PERSONAS[id];

  return {
    id,
    name: persona.roleName,
    roleTitle: persona.officialType,
    coreLine: persona.openingLine,
    personality: `${persona.relationship} 说话方式：${persona.voice.join('、')}。`,
    functionGoal: persona.duty,
    mustInclude: [
      `保持${persona.roleName}的${persona.officialType}定位`,
      `围绕关键词：${persona.officialKeywords.join('、')}`,
      '输出必须像灵宠陪伴，不像客服、报告或导购',
    ],
    mustAvoid: persona.bannedPhrases,
    systemPrompt: persona.rolePrompt,
  };
}
