import { z } from 'zod';

// Base message schema
export const BaseMessageSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.unknown(),
});

// Chat message schema
export const ChatMessageSchema = BaseMessageSchema.merge(z.object({
  type: z.literal('chat'),
  data: z.object({
    content: z.string(),
    timestamp: z.string(),
  }),
}));

// Product backfilled schema
export const ProductBackfilledSchema = BaseMessageSchema.merge(z.object({
  type: z.literal('productBackfilled'),
  data: z.object({
    content: z.string(),
    productName: z.string().optional(),
    productLink: z.string().optional(),
    timestamp: z.string(),
  }),
}));

// Vendor onboarding schema
export const VendorOnboardSchema = BaseMessageSchema.merge(z.object({
  type: z.literal('vendorOnboard'),
  data: z.object({
    content: z.string(),
    vendorId: z.string(),
    caseId: z.string(),
    timestamp: z.string(),
  }),
}));

// Combined message schema
export const MessageSchema = z.discriminatedUnion('type', [
  ChatMessageSchema,
  VendorOnboardSchema,
  ProductBackfilledSchema,
]);

// Type inference
export type Message = z.infer<typeof MessageSchema>;
export type ChatMessageContent = z.infer<typeof ChatMessageSchema>;
export type VendorOnboard = z.infer<typeof VendorOnboardSchema>; 
export type ProductBackfilled = z.infer<typeof ProductBackfilledSchema>;