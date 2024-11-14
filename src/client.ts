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

export const schemas = {
  Pagination,
  Campaign,
  Link,
  Coupon,
  Affiliate,
  ListAllAffiliatesResponse,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/affiliates",
    alias: "getAffiliates",
    description: `Retrieve a list of all affiliates with pagination`,
    requestFormat: "json",
    response: ListAllAffiliatesResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions`,
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
