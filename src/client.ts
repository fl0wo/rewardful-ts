import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const Pagination = z
  .object({
    previous_page: z.number().nullable(),
    current_page: z.number(),
    next_page: z.number().nullable(),
    count: z.number(),
    limit: z.number(),
    total_pages: z.number(),
    total_count: z.number(),
  })
  .passthrough();
const Campaign = z
  .object({
    id: z.string().uuid(),
    created_at: z.string().datetime({ offset: true }),
    updated_at: z.string().datetime({ offset: true }),
    name: z.string(),
  })
  .passthrough();
const Link = z
  .object({
    id: z.string().uuid(),
    url: z.string().url(),
    token: z.string(),
    visitors: z.number().int(),
    leads: z.number().int(),
    conversions: z.number().int(),
  })
  .passthrough();
const Coupon = z
  .object({
    id: z.string().uuid(),
    external_id: z.string(),
    token: z.string(),
    leads: z.number().int(),
    conversions: z.number().int(),
    affiliate_id: z.string().uuid(),
  })
  .passthrough();
const Affiliate = z
  .object({
    id: z.string().uuid(),
    created_at: z.string().datetime({ offset: true }),
    updated_at: z.string().datetime({ offset: true }),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    paypal_email: z.string().email().nullable(),
    state: z.enum(["active", "inactive"]),
    stripe_customer_id: z.string().nullish(),
    stripe_account_id: z.string().nullish(),
    visitors: z.number().int(),
    leads: z.number().int(),
    conversions: z.number().int(),
    campaign: Campaign.nullish(),
    links: z.array(Link).optional(),
    coupon: Coupon.nullish(),
  })
  .passthrough();
const ListAllAffiliatesResponse = z
  .object({
    pagination: Pagination,
    data: z.array(Affiliate).describe("List of affiliates"),
  })
  .passthrough();
const CreateAffiliateRequest = z
  .object({
    first_name: z.string().describe("First name of the affiliate"),
    last_name: z.string().describe("Last name of the affiliate"),
    email: z.string().email().describe("Email address of the affiliate"),
    token: z
      .string()
      .describe("Unique identifier or token for the affiliate")
      .optional(),
    stripe_customer_id: z
      .string()
      .describe("Stripe customer ID associated with the affiliate")
      .optional(),
  })
  .passthrough();
const UpdateAffiliateRequest = z
  .object({
    first_name: z.string().describe("First name of the affiliate"),
    last_name: z.string().describe("Last name of the affiliate"),
    email: z.string().email().describe("Email address of the affiliate"),
    token: z.string().describe("Unique identifier or token for the affiliate"),
    stripe_customer_id: z
      .string()
      .describe("Stripe customer ID associated with the affiliate"),
  })
  .partial()
  .passthrough();
const SSO = z
  .object({
    url: z
      .string()
      .url()
      .describe("URL for the SSO login link for the affiliate"),
    expires: z
      .string()
      .datetime({ offset: true })
      .describe("Expiration timestamp of the SSO link"),
  })
  .passthrough();
const AffiliateBasic = z
  .object({
    id: z.string().uuid().describe("Affiliate ID"),
    email: z.string().email().describe("Email address of the affiliate"),
  })
  .passthrough();
const MagicLinkResponse = z
  .object({ sso: SSO, affiliate: AffiliateBasic })
  .passthrough();

export const schemas = {
  Pagination,
  Campaign,
  Link,
  Coupon,
  Affiliate,
  ListAllAffiliatesResponse,
  CreateAffiliateRequest,
  UpdateAffiliateRequest,
  SSO,
  AffiliateBasic,
  MagicLinkResponse,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/affiliates",
    alias: "getAffiliates",
    description: `Retrieve a list of all affiliates with pagination, optional expansion, and filtering by campaign or email.`,
    requestFormat: "json",
    parameters: [
      {
        name: "expand",
        type: "Query",
        schema: z.enum(["campaign", "links", "commission_stats"]).optional(),
      },
      {
        name: "campaign_id",
        type: "Query",
        schema: z.string().uuid().optional(),
      },
      {
        name: "email",
        type: "Query",
        schema: z.string().email().optional(),
      },
    ],
    response: ListAllAffiliatesResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/affiliates",
    alias: "postAffiliates",
    description: `Create a new affiliate in Rewardful`,
    requestFormat: "form-url",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateAffiliateRequest,
      },
    ],
    response: Affiliate,
    errors: [
      {
        status: 400,
        description: `Bad Request - Invalid input data`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/affiliates/:id",
    alias: "getAffiliatesId",
    description: `Retrieve a single affiliate by its unique ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Affiliate,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Affiliate not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/affiliates/:id",
    alias: "putAffiliatesId",
    description: `Update an existing affiliate in Rewardful`,
    requestFormat: "form-url",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateAffiliateRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: Affiliate,
    errors: [
      {
        status: 400,
        description: `Bad Request - Invalid input data`,
        schema: z.void(),
      },
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Affiliate not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/affiliates/:id/sso",
    alias: "getAffiliatesIdsso",
    description: `Generate an SSO link for an affiliate, allowing them to access their account`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: MagicLinkResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Affiliate not found`,
        schema: z.void(),
      },
    ],
  },
]);

export const RewardfulApiClient = new Zodios(
  "https://api.getrewardful.com/v1",
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
