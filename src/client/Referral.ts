import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import { affiliate_id } from "./common";
import { page } from "./common";
import { limit } from "./common";
import { Pagination } from "./common";
import { Referral } from "./common";
import { Link } from "./common";
import { Customer } from "./common";
import { Affiliate } from "./common";
import { Campaign } from "./common";
import { Coupon } from "./common";

type ListReferralsResponse = Partial<{
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
  data: Array<Referral>;
}>;

const ListReferralsResponse: z.ZodType<ListReferralsResponse> = z
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
    data: z.array(Referral).describe("List of referrals"),
  })
  .partial();
const expand__2 = z.array(z.literal("affiliate")).optional();
const conversion_state = z
  .array(
    z
      .enum(["conversion", "lead", "visitor"])
      .describe(
        "The state of the referral conversion, either 'conversion', 'lead', or 'visitor'."
      )
  )
  .optional();

export const schemas = {
  ListReferralsResponse,
  expand__2,
  conversion_state,
};

export const endpoints = makeApi([
  {
    method: "get",
    path: "/referrals",
    alias: "getReferrals",
    description: `Retrieve a list of referrals with optional filtering, expansion, and pagination.`,
    requestFormat: "json",
    parameters: [
      {
        name: "expand",
        type: "Query",
        schema: expand__2,
      },
      {
        name: "affiliate_id",
        type: "Query",
        schema: affiliate_id,
      },
      {
        name: "conversion_state",
        type: "Query",
        schema: conversion_state,
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
    response: ListReferralsResponse,
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions`,
        schema: z.void(),
      },
    ],
  },
]);

export const ReferralApi = new Zodios(
  "https://api.getrewardful.com/v1",
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
