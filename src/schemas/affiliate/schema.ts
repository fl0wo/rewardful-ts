import {z} from "zod";
import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
import {CampaignSchema} from "../campain/schema";
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

export const AffiliateSchema = z.object({
    id: z.string().uuid().openapi({ example: 'd0ed8392-8880-4f39-8715-60230f9eceab' }),
    created_at: z.string().datetime().openapi({ example: '2019-05-09T16:18:59.920Z' }),
    updated_at: z.string().datetime().openapi({ example: '2019-05-09T16:25:42.614Z' }),
    first_name: z.string().openapi({ example: 'Adam' }),
    last_name: z.string().openapi({ example: 'Jones' }),
    email: z.string().email().openapi({ example: 'adam.jones@example.com' }),
    paypal_email: z.string().email().nullable().openapi({ example: null }),
    state: z.enum(['active', 'inactive']).openapi({ example: 'active' }),
    stripe_customer_id: z.string().nullable().optional().openapi({ example: 'cus_ABCDEF123456' }),
    stripe_account_id: z.string().nullable().optional().openapi({ example: 'acct_ABCDEF123456' }),
    visitors: z.number().int().openapi({ example: 100 }),
    leads: z.number().int().openapi({ example: 42 }),
    conversions: z.number().int().openapi({ example: 18 }),
    campaign: CampaignSchema.nullable().optional(),
    links: z.array(LinkSchema).optional(),
    coupon: CouponSchema.nullable().optional()
}).openapi('Affiliate');


export type RewardfulAffiliate = z.infer<typeof AffiliateSchema>;
export type RewardfulLink = z.infer<typeof LinkSchema>;
export type RewardfulCoupon = z.infer<typeof CouponSchema>;