import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import { Pagination } from "./common";
import { Affiliate } from "./common";
import { Campaign } from "./common";
import { Link } from "./common";
import { Coupon } from "./common";
import { id } from "./common";

type ListAllAffiliatesResponse = Partial<{
  pagination: Pagination;
  data: Array<Affiliate>;
}>;
type MagicLinkResponse = Partial<{
  sso: SSO;
  affiliate: AffiliateBasic;
}>;
type SSO = {
  url: string;
  expires: string;
};
type AffiliateBasic = {
  id: string;
  email: string;
};

const ListAllAffiliatesResponse: z.ZodType<ListAllAffiliatesResponse> = z
  .object({
    pagination: Pagination,
    data: z.array(Affiliate).describe("List of affiliates"),
  })
  .partial();
const SSO: z.ZodType<SSO> = z.object({
  url: z
    .string()
    .url()
    .describe("URL for the SSO login link for the affiliate"),
  expires: z
    .string()
    .datetime({ offset: true })
    .describe("Expiration timestamp of the SSO link"),
});
const AffiliateBasic: z.ZodType<AffiliateBasic> = z.object({
  id: z.string().uuid().describe("Affiliate ID"),
  email: z.string().email().describe("Email address of the affiliate"),
});
const MagicLinkResponse: z.ZodType<MagicLinkResponse> = z
  .object({ sso: SSO, affiliate: AffiliateBasic })
  .partial();
const expand = z.enum(["campaign", "links", "commission_stats"]).optional();
const campaign_id = z.string().uuid().optional();
const email = z.string().email().optional();
const CreateAffiliateRequest = z.object({
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
});
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
  .partial();

export const schemas = {
  ListAllAffiliatesResponse,
  SSO,
  AffiliateBasic,
  MagicLinkResponse,
  expand,
  campaign_id,
  email,
  CreateAffiliateRequest,
  UpdateAffiliateRequest,
};

export const endpoints = makeApi([
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
        schema: expand,
      },
      {
        name: "campaign_id",
        type: "Query",
        schema: campaign_id,
      },
      {
        name: "email",
        type: "Query",
        schema: email,
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
        schema: id,
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
        schema: id,
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
        schema: id,
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

export const AffiliateApi = new Zodios(
  "https://api.getrewardful.com/v1",
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
