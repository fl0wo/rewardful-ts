import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import { affiliate_id } from "./common";
import { page } from "./common";
import { limit } from "./common";
import { Pagination } from "./common";
import { Campaign } from "./common";
import { Referral } from "./common";
import { Link } from "./common";
import { Customer } from "./common";
import { Affiliate } from "./common";
import { Coupon } from "./common";
import { id } from "./common";

type ListCommissionsResponse = Partial<{
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
  data: Array<Commission>;
}>;
type Commission = {
  id: string;
  created_at: string;
  updated_at: string;
  amount: number;
  currency: string;
  due_at: string | null;
  paid_at: string | null;
  campaign: Campaign;
  sale: Sale;
};
type Sale = {
  id: string;
  currency: string;
  charged_at: string;
  stripe_account_id: string | null;
  stripe_charge_id: string | null;
  invoiced_at: string | null;
  created_at: string;
  updated_at: string;
  charge_amount_cents: number;
  refund_amount_cents: number;
  tax_amount_cents: number;
  sale_amount_cents: number;
  referral: Referral;
  affiliate: Affiliate;
};

const Sale: z.ZodType<Sale> = z.object({
  id: z.string().uuid().describe("The unique identifier for the sale."),
  currency: z.string().describe("The currency used for the sale."),
  charged_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the sale was charged."),
  stripe_account_id: z
    .string()
    .describe("The Stripe account ID associated with the sale.")
    .nullable(),
  stripe_charge_id: z
    .string()
    .describe("The Stripe charge ID associated with the sale.")
    .nullable(),
  invoiced_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the sale was invoiced.")
    .nullable(),
  created_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the sale was created."),
  updated_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the sale was last updated."),
  charge_amount_cents: z
    .number()
    .int()
    .describe("The charged amount in cents."),
  refund_amount_cents: z
    .number()
    .int()
    .describe("The refunded amount in cents."),
  tax_amount_cents: z.number().int().describe("The tax amount in cents."),
  sale_amount_cents: z.number().int().describe("The sale amount in cents."),
  referral: Referral,
  affiliate: Affiliate,
});
const Commission: z.ZodType<Commission> = z.object({
  id: z.string().uuid().describe("The unique identifier for the commission."),
  created_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the commission was created."),
  updated_at: z
    .string()
    .datetime({ offset: true })
    .describe("Timestamp when the commission was last updated."),
  amount: z.number().int().describe("The amount of the commission in cents."),
  currency: z.string().describe("The currency of the commission amount."),
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
  campaign: Campaign.nullable(),
  sale: Sale,
});
const ListCommissionsResponse: z.ZodType<ListCommissionsResponse> = z
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
    data: z.array(Commission).describe("List of commissions"),
  })
  .partial();
const expand__3 = z.array(z.literal("sale")).optional();
const state = z
  .array(
    z.enum(["paid", "due", "pending"]).describe("The state of the commission.")
  )
  .optional();
const UpdateCommissionRequest = z
  .object({
    paid_at: z
      .string()
      .datetime({ offset: true })
      .describe(
        "Timestamp to mark the commission as paid. Use null to mark as unpaid."
      )
      .nullable(),
    due_at: z
      .string()
      .datetime({ offset: true })
      .describe("Timestamp to set the commission's due date.")
      .nullable(),
  })
  .partial();
const DeleteCommissionResponse = z
  .object({
    object: z.literal("commission").describe("Indicates the object type."),
    id: z
      .string()
      .uuid()
      .describe("The unique identifier of the deleted commission."),
    deleted: z
      .boolean()
      .describe("Indicates if the commission was successfully deleted."),
  })
  .partial();

export const schemas = {
  Sale,
  Commission,
  ListCommissionsResponse,
  expand__3,
  state,
  UpdateCommissionRequest,
  DeleteCommissionResponse,
};

export const endpoints = makeApi([
  {
    method: "get",
    path: "/commissions",
    alias: "getCommissions",
    description: `Retrieve a list of commissions with optional filtering, expansion, and pagination.`,
    requestFormat: "json",
    parameters: [
      {
        name: "expand",
        type: "Query",
        schema: expand__3,
      },
      {
        name: "affiliate_id",
        type: "Query",
        schema: affiliate_id,
      },
      {
        name: "state",
        type: "Query",
        schema: state,
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
    response: ListCommissionsResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/commissions/:id",
    alias: "getCommissionsId",
    description: `Retrieve a single commission by its unique ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: id,
      },
    ],
    response: Commission,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Commission not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/commissions/:id",
    alias: "putCommissionsId",
    description: `Update a commission&#x27;s paid or due date status.`,
    requestFormat: "form-url",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateCommissionRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: id,
      },
    ],
    response: Commission,
    errors: [
      {
        status: 400,
        description: `Bad Request - Invalid input data.`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Commission not found.`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/commissions/:id",
    alias: "deleteCommissionsId",
    description: `Delete a commission by its unique ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: id,
      },
    ],
    response: DeleteCommissionResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions.`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Commission not found.`,
        schema: z.void(),
      },
    ],
  },
]);

export const CommissionApi = new Zodios(
  "https://api.getrewardful.com/v1",
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
