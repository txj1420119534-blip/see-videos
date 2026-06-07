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
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .max(12)
    .optional(),
  userContext: z
    .object({
      nickname: z.string().optional(),
      currentState: z.enum(['low_energy', 'normal', 'want_to_push', 'unknown']).optional(),
      budget: z.string().optional(),
      timeAvailable: z.string().optional(),
      city: z.string().optional(),
      preferences: z.array(z.string()).optional(),
      lingruiMemory: z
        .object({
          callCount: z.number(),
          lastChoice: z.string().optional(),
          lastMemorySeed: z.string().optional(),
          updatedAt: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const AnalyzeResponseSchema = z.object({
  mode: z.enum(['real', 'mock']),
  roleId: ScenarioIdSchema,
  roleName: z.string(),
  openingLine: z.string(),
  emotionRead: z.string(),
  videoRead: z.string(),
  coreInsight: z.string(),
  tags: z.array(z.string()),
  sections: z
    .array(
      z.object({
        title: z.string(),
        items: z.array(z.string()).min(1),
      })
    )
    .min(2)
    .max(5),
  nextActions: z.array(z.string()).max(3),
  memorySeed: z.string(),
  shareQuote: z.string(),
  confidenceNote: z.string().optional(),
  debug: z
    .object({
      usedVision: z.boolean(),
      usedUserImage: z.boolean(),
      fallbackReason: z.string().optional(),
      rawModelName: z.string().optional(),
      styleRewrite: z.boolean().optional(),
    })
    .optional(),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
