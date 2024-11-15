import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const CampaignSchema = z.object({
    id: z.string().uuid().optional().openapi({
        description: "The unique identifier of the campaign.",
        example: "ceaef6d9-767e-49aa-a6ab-46c02aa79604"
    }),
    created_at: z.string().datetime().optional().openapi({
        description: "Creation timestamp",
        example: "2021-11-24T06:31:06.672Z"
    }),
    updated_at: z.string().datetime().optional().openapi({
        description: "Last update timestamp",
        example: "2022-02-22T23:17:55.119Z"
    }),
    name: z.string().optional().openapi({
        description: "Campaign name",
        example: "Best Friends of Rewardful"
    }),
    url: z.string().url().optional().openapi({
        description: "Campaign URL",
        example: "https://rewardful.com/"
    }),
    private: z.boolean().optional().openapi({
        description: "Private campaign flag",
        example: false
    }),
    private_tokens: z.boolean().optional().openapi({
        description: "Private tokens flag",
        example: false
    }),
    commission_amount_cents: z.number().nullable().optional().openapi({
        description: "Fixed commission amount in cents",
        example: null
    }),
    commission_amount_currency: z.string().nullable().optional().openapi({
        description: "Commission amount currency",
        example: null
    }),
    minimum_payout_cents: z.number().optional().openapi({
        description: "Minimum payout in cents",
        example: 0
    }),
    max_commission_period_months: z.number().nullable().optional().openapi({
        description: "Maximum commission period in months",
        example: null
    }),
    max_commissions: z.number().nullable().optional().openapi({
        description: "Maximum number of commissions",
        example: null
    }),
    days_before_referrals_expire: z.number().optional().openapi({
        description: "Days until referral expiration",
        example: 30
    }),
    days_until_commissions_are_due: z.number().optional().openapi({
        description: "Days until commission due date",
        example: 30
    }),
    affiliate_dashboard_text: z.string().optional().openapi({
        description: "Dashboard text for affiliates",
        example: ""
    }),
    custom_reward_description: z.string().optional().openapi({
        description: "Custom reward description",
        example: ""
    }),
    welcome_text: z.string().optional().openapi({
        description: "Welcome message",
        example: ""
    }),
    customers_visible_to_affiliates: z.boolean().optional().openapi({
        description: "Customer visibility flag",
        example: false
    }),
    sale_description_visible_to_affiliates: z.boolean().optional().openapi({
        description: "Sale description visibility flag",
        example: true
    }),
    parameter_type: z.enum(["query", "hash", "path"]).optional().openapi({
        description: "Parameter type",
        example: "query"
    }),
    stripe_coupon_id: z.string().nullable().optional().openapi({
        description: "Stripe coupon ID",
        example: "jo45MTj3"
    }),
    default: z.boolean().optional().openapi({
        description: "Default campaign flag",
        example: false
    }),
    reward_type: z.enum(["percent", "flat"]).optional().openapi({
        description: "Reward type",
        example: "percent"
    }),
    commission_percent: z.number().nullable().optional().openapi({
        description: "Commission percentage",
        example: 30.0
    }),
    minimum_payout_currency: z.string().optional().openapi({
        description: "Minimum payout currency",
        example: "USD"
    }),
    visitors: z.number().optional().openapi({
        description: "Visitor count",
        example: 150
    }),
    leads: z.number().optional().openapi({
        description: "Lead count",
        example: 39
    }),
    conversions: z.number().optional().openapi({
        description: "Conversion count",
        example: 7
    }),
    affiliates: z.number().optional().openapi({
        description: "Affiliate count",
        example: 12
    })
}).openapi("Campaign");
