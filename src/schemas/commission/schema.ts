import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {ReferralSchema} from "../referral/schema";
import {AffiliateSchema} from "../affiliate/schema";
import {CampaignSchema} from "../campain/schema";

extendZodWithOpenApi(z);

// Define nested schemas

const SaleSchema = z.object({
    id: z.string().uuid().openapi({
        description: "The unique identifier for the sale.",
        example: "74e37d3b-03c5-4bfc-841c-a79d5799551a",
    }),
    currency: z.string().openapi({
        description: "The currency used for the sale.",
        example: "USD",
    }),
    charged_at: z.string().datetime().openapi({
        description: "Timestamp when the sale was charged.",
        example: "2020-08-19T16:28:25.000Z",
    }),
    stripe_account_id: z.string().nullable().openapi({
        description: "The Stripe account ID associated with the sale.",
        example: "acct_ABC123",
    }),
    stripe_charge_id: z.string().nullable().openapi({
        description: "The Stripe charge ID associated with the sale.",
        example: "ch_ABC123",
    }),
    invoiced_at: z.string().datetime().nullable().openapi({
        description: "Timestamp when the sale was invoiced.",
        example: "2020-08-19T16:28:25.000Z",
    }),
    created_at: z.string().datetime().openapi({
        description: "Timestamp when the sale was created.",
        example: "2020-08-19T16:28:31.102Z",
    }),
    updated_at: z.string().datetime().openapi({
        description: "Timestamp when the sale was last updated.",
        example: "2020-08-19T16:28:31.102Z",
    }),
    charge_amount_cents: z.number().int().openapi({
        description: "The charged amount in cents.",
        example: 10000,
    }),
    refund_amount_cents: z.number().int().openapi({
        description: "The refunded amount in cents.",
        example: 0,
    }),
    tax_amount_cents: z.number().int().openapi({
        description: "The tax amount in cents.",
        example: 0,
    }),
    sale_amount_cents: z.number().int().openapi({
        description: "The sale amount in cents.",
        example: 10000,
    }),
    referral: ReferralSchema,
    affiliate: AffiliateSchema,
}).openapi("Sale");

// Define the main Commission schema
export const CommissionSchema = z.object({
    id: z.string().uuid().openapi({
        description: "The unique identifier for the commission.",
        example: "39e68c88-d84a-4510-b3b4-43c75016a080",
    }),
    created_at: z.string().datetime().openapi({
        description: "Timestamp when the commission was created.",
        example: "2020-08-19T16:28:31.164Z",
    }),
    updated_at: z.string().datetime().openapi({
        description: "Timestamp when the commission was last updated.",
        example: "2020-08-19T16:28:31.164Z",
    }),
    amount: z.number().int().openapi({
        description: "The amount of the commission in cents.",
        example: 3000,
    }),
    currency: z.string().openapi({
        description: "The currency of the commission amount.",
        example: "USD",
    }),
    due_at: z.string().datetime().nullable().openapi({
        description: "Timestamp when the commission is due.",
        example: "2020-09-18T16:28:25.000Z",
    }),
    paid_at: z.string().datetime().nullable().openapi({
        description: "Timestamp when the commission was paid.",
        example: null,
    }),
    campaign: CampaignSchema,
    sale: SaleSchema,
}).openapi("Commission");

// Define the Commission schema within the payout object
export const CommissionItemSchema = z.object({
    id: z.string().uuid().openapi({
        description: "The unique identifier of the commission.",
        example: "3a4a775c-b660-4d7f-a733-6f259a2646a7",
    }),
    currency: z.string().openapi({
        description: "The currency of the commission amount.",
        example: "USD",
    }),
    stripe_account_id: z.string().nullable().openapi({
        description: "The Stripe account ID associated with the commission.",
        example: "acct_1GWIyRDLlKlZvFB2",
    }),
    due_at: z.string().datetime().nullable().openapi({
        description: "Timestamp when the commission is due.",
        example: "2022-07-31T15:55:19.000Z",
    }),
    paid_at: z.string().datetime().nullable().openapi({
        description: "Timestamp when the commission was paid.",
        example: "2022-08-08T09:07:11.242Z",
    }),
    created_at: z.string().datetime().openapi({
        description: "Timestamp when the commission was created.",
        example: "2022-07-01T15:57:18.742Z",
    }),
    updated_at: z.string().datetime().openapi({
        description: "Timestamp when the commission was last updated.",
        example: "2022-07-01T15:57:18.742Z",
    }),
    amount: z.number().int().openapi({
        description: "The amount of the commission in cents.",
        example: 1470,
    }),
}).openapi("CommissionItem");


export type RewardfulCommission = z.infer<typeof CommissionSchema>;
export type RewardfulCommissionItem = z.infer<typeof CommissionItemSchema>;
export type RewardfulSale = z.infer<typeof SaleSchema>;