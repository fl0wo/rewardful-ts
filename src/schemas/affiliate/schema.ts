import {z} from "zod";
import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

export const LinkSchema = z.object({
    id: z.string().uuid().openapi({ example: 'eb844960-6c42-4a3b-8009-f588a42d8506' }),
    url: z.string().url().openapi({ example: 'http://www.example.com/?via=adam' }),
    token: z.string().openapi({ example: 'adam' }),
    visitors: z.number().int().openapi({ example: 100 }),
    leads: z.number().int().openapi({ example: 42 }),
    conversions: z.number().int().openapi({ example: 18 })
}).openapi('Link');

export const CouponSchema = z.object({
    id: z.string().uuid().openapi({ example: '75434e84-255b-4314-a278-820df5e76813' }),
    external_id: z.string().openapi({ example: 'promo_1a2b3c' }),
    token: z.string().openapi({ example: 'CODE' }),
    leads: z.number().int().openapi({ example: 0 }),
    conversions: z.number().int().openapi({ example: 0 }),
    affiliate_id: z.string().uuid().openapi({ example: '95d48f70-f1d4-42d9-b929-21996b6d9eb4' })
}).openapi('Coupon');

// affiliate/schema.ts
export const AffiliateSchema = z.object({
    id: z.string().uuid(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    state: z.enum(['active', 'inactive']),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    confirmed_at: z.string().datetime().nullable(),
    paypal_email: z.string().email().nullable(),
    paypal_email_confirmed_at: z.string().datetime().nullable(),
    wise_email: z.string().email().nullable(),
    wise_email_confirmed_at: z.string().datetime().nullable(),
    receive_new_commission_notifications: z.boolean(),
    sign_in_count: z.number(),
    unconfirmed_email: z.string().email().nullable(),
    stripe_customer_id: z.string().nullable(),
    stripe_account_id: z.string().nullable(),
    visitors: z.number(),
    leads: z.number(),
    conversions: z.number(),
    campaign: z.object({
        id: z.string().uuid(),
        created_at: z.string().datetime(),
        updated_at: z.string().datetime(),
        name: z.string()
    }).optional()
}).openapi('Affiliate');


export type RewardfulAffiliate = z.infer<typeof AffiliateSchema>;
export type RewardfulLink = z.infer<typeof LinkSchema>;
export type RewardfulCoupon = z.infer<typeof CouponSchema>;