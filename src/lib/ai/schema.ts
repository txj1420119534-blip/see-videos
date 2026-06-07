import { z } from 'zod';

export const ScenarioIdSchema = z.enum(['bixie', 'baize', 'jiuwei', 'tianlu', 'xuangui']);
export type ScenarioId = z.infer<typeof ScenarioIdSchema>;

export const AnalyzeRequestSchema = z.object({
  scenarioId: ScenarioIdSchema,
  videoMeta: z.object({
    title: z.string().min(1),
    author: z.string().default(''),
    description: z.string().default(''),
    tags: z.array(z.string()).default([]),
    transcript: z.string().optional(),
    ocrText: z.string().optional(),
  }),
  question: z.string().optional(),
  selection: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
  frameImageBase64: z.string().optional(),
  userImageBase64: z.string().optional(),
  userContext: z
    .object({
      nickname: z.string().optional(),
      currentState: z.enum(['low_energy', 'normal', 'want_to_push', 'unknown']).optional(),
      budget: z.string().optional(),
      timeAvailable: z.string().optional(),
      city: z.string().optional(),
      preferences: z.array(z.string()).optional(),
    })
    .optional(),
});

export const AnalyzeResponseSchema = z.object({
  mode: z.enum(['real', 'mock']),
  scenarioId: ScenarioIdSchema,
  lingruiName: z.string(),
  roleTitle: z.string(),
  resultTitle: z.string(),
  oneLineJudgement: z.string(),
  confidenceLabel: z.string(),
  tags: z.array(z.string()),
  sections: z
    .array(
      z.object({
        title: z.string(),
        items: z.array(z.string()).min(1),
      })
    )
    .min(3)
    .max(5),
  actionChips: z.array(z.string()),
  shareCard: z.object({
    title: z.string(),
    subtitle: z.string(),
    quote: z.string(),
    bullets: z.array(z.string()).length(3),
    footer: z.string(),
  }),
  followUpQuestions: z.array(z.string()).max(3),
  debug: z
    .object({
      usedVision: z.boolean(),
      usedUserImage: z.boolean(),
      fallbackReason: z.string().optional(),
      rawModelName: z.string().optional(),
    })
    .optional(),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
