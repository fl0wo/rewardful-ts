import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import { id } from "./common";
import { Affiliate } from "./common";
import { Campaign } from "./common";
import { Link } from "./common";
import { Coupon } from "./common";
import { affiliate_id } from "./common";
import { page } from "./common";
import { limit } from "./common";
import { Pagination } from "./common";
import { ErrorResponse } from "./common";

type Payout = Partial<{
  id: string;
  currency: string;
  paid_at: string | null;
  state: "paid" | "processing" | "completed" | "failed";
  paid_by_id: string | null;
  created_at: string;
  updated_at: string;
  amount: number;
  affiliate: Affiliate;
  commissions: Array<CommissionItem>;
}>;
type CommissionItem = {
  id: string;
  currency: string;
  stripe_account_id: string | null;
  due_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  amount: number;
};
type ListPayoutsResponse = Partial<{
  pagination: Pagination &
    Partial<{
      previous_page: number | null;
      current_page: number;
      next_page: number | null;
      count: number;
      limit: number;
      total_pages: number;
      total_count: number;
    }>;
  data: Array<
    Payout & {
      id: string;
      currency: string;
      paid_at: string | null;
      state: "paid" | "processing" | "completed" | "failed";
      paid_by_id: string | null;
      created_at: string;
      updated_at: string;
      amount: number;
      affiliate: Affiliate;
      commissions: Array<CommissionItem>;
    }
  >;
}>;

const CommissionItem: z.ZodType<CommissionItem> = z.object({
  id: z.string().uuid().describe("The unique identifier of the commission."),
  currency: z.string().describe("The currency of the commission amount."),
  stripe_account_id: z
    .string()
    .describe("The Stripe account ID associated with the commission.")
    .nullable(),
  due_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the commission is due.")
    .nullable(),
  paid_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the commission was paid.")
    .nullable(),
  created_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the commission was created."),
  updated_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the commission was last updated."),
  amount: z.number().int().describe("The amount of the commission in cents."),
});
const Payout: z.ZodType<Payout> = z
  .object({
    id: z.string().uuid().describe("The unique identifier of the payout."),
    currency: z.string().describe("The currency of the payout."),
    paid_at: z
      .string()
      .datetime({ offset: true })
      .describe("Timestamp when the payout was marked as paid.")
      .nullable(),
    state: z
      .enum(["paid", "processing", "completed", "failed"])
      .describe("The current state of the payout."),
    paid_by_id: z
      .string()
      .uuid()
      .describe(
        "The ID of the user who marked the payout as paid, if applicable."
      )
      .nullable(),
    created_at: z
      .string()
      .datetime({ offset: true })
      .describe("Timestamp when the payout was created."),
    updated_at: z
      .string()
      .datetime({ offset: true })
      .describe("Timestamp when the payout was last updated."),
    amount: z.number().int().describe("The amount of the payout in cents."),
    affiliate: Affiliate,
    commissions: z
      .array(CommissionItem)
      .describe("List of commissions included in the payout."),
  })
  .partial();
const ListPayoutsResponse: z.ZodType<ListPayoutsResponse> = z
  .object({
    pagination: Pagination.and(
      z
        .object({
          previous_page: z.number().nullable(),
          current_page: z.number(),
          next_page: z.number().nullable(),
          count: z.number(),
          limit: z.number(),
          total_pages: z.number(),
          total_count: z.number(),
        })
        .partial()
    ),
    data: z
      .array(
        Payout.and(
          z.object({
            id: z
              .string()
              .uuid()
              .describe("The unique identifier of the payout."),
            currency: z.string().describe("The currency of the payout."),
            paid_at: z
              .string()
              .datetime({ offset: true })
              .describe("Timestamp when the payout was marked as paid.")
              .nullable(),
            state: z
              .enum(["paid", "processing", "completed", "failed"])
              .describe("The current state of the payout."),
            paid_by_id: z
              .string()
              .uuid()
              .describe(
                "The ID of the user who marked the payout as paid, if applicable."
              )
              .nullable(),
            created_at: z
              .string()
              .datetime({ offset: true })
              .describe("Timestamp when the payout was created."),
            updated_at: z
              .string()
              .datetime({ offset: true })
              .describe("Timestamp when the payout was last updated."),
            amount: z
              .number()
              .int()
              .describe("The amount of the payout in cents."),
            affiliate: Affiliate,
            commissions: z
              .array(CommissionItem)
              .describe("List of commissions included in the payout."),
          })
        )
      )
      .describe("List of payouts"),
  })
  .partial();
const expand__4 = z.array(z.enum(["affiliate", "commissions"])).optional();
const state__2 = z
  .array(
    z
      .enum(["paid", "processing", "due", "pending", "completed", "failed"])
      .describe("The state of the payout.")
  )
  .optional();

export const schemas = {
  CommissionItem,
  Payout,
  ListPayoutsResponse,
  expand__4,
  state__2,
};

export const endpoints = makeApi([
  {
    method: "put",
    path: "/payouts/:id/pay",
    alias: "putPayoutsIdpay",
    description: `Mark a payout as paid. This queues the payout for processing.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: id,
      },
    ],
    response: Payout,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions.`,
        schema: z.object({
          error: z
            .string()
            .describe("Error message describing the authentication failure."),
        }),
      },
      {
        status: 404,
        description: `Payout not found.`,
        schema: z.object({
          error: z
            .string()
            .describe("Error message indicating the payout was not found."),
        }),
      },
    ],
  },
  {
    method: "get",
    path: "/payouts",
    alias: "getPayouts",
    description: `Retrieve a list of payouts with optional filtering, expansion, and pagination.`,
    requestFormat: "json",
    parameters: [
      {
        name: "expand",
        type: "Query",
        schema: expand__4,
      },
      {
        name: "affiliate_id",
        type: "Query",
        schema: affiliate_id,
      },
      {
        name: "state",
        type: "Query",
        schema: state__2,
      },
      {
        name: "page",
        type: "Query",
        schema: page,
      },
      {
        name: "limit",
        type: "Query",
        schema: limit,
      },
    ],
    response: ListPayoutsResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions.`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/payouts/:id",
    alias: "getPayoutsId",
    description: `Retrieve a single payout by its unique ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: id,
      },
    ],
    response: Payout,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Payout not found`,
        schema: ErrorResponse,
      },
    ],
  },
]);

export const PayoutApi = new Zodios(
  "https://api.getrewardful.com/v1",
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
