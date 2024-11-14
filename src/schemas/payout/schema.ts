import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {AffiliateSchema} from "../affiliate/schema";
import {CommissionItemSchema} from "../commission/schema";

extendZodWithOpenApi(z);

// Define the main Payout schema
export const PayoutSchema = z.object({
    id: z.string().uuid().openapi({
        description: "The unique identifier of the payout.",
        example: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca",
    }),
    currency: z.string().openapi({
        description: "The currency of the payout.",
        example: "USD",
    }),
    paid_at: z.string().datetime().nullable().openapi({
        description: "Timestamp when the payout was marked as paid.",
        example: "2022-10-12T14:55:11.242Z",
    }),
    state: z.enum(["paid", "processing", "completed", "failed"]).openapi({
        description: "The current state of the payout.",
        example: "paid",
    }),
    paid_by_id: z.string().uuid().nullable().openapi({
        description: "The ID of the user who marked the payout as paid, if applicable.",
        example: "3e5c04ae-af80-4964-b280-23df034690d4",
    }),
    created_at: z.string().datetime().openapi({
        description: "Timestamp when the payout was created.",
        example: "2022-10-12T14:54:52.148Z",
    }),
    updated_at: z.string().datetime().openapi({
        description: "Timestamp when the payout was last updated.",
        example: "2022-10-12T14:55:11.276Z",
    }),
    amount: z.number().int().openapi({
        description: "The amount of the payout in cents.",
        example: 1470,
    }),
    affiliate: AffiliateSchema,
    commissions: z.array(CommissionItemSchema).openapi({
        description: "List of commissions included in the payout.",
    }),
}).openapi("Payout");


export type RewardfulPayout = z.infer<typeof PayoutSchema>;