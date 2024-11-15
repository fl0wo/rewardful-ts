import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

import { Pagination } from "./common";
import { Campaign } from "./common";
import { id } from "./common";
import { ErrorResponse } from "./common";

type ListCampaignsResponse = Partial<{
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
  data: Array<Campaign>;
}>;

const ListCampaignsResponse: z.ZodType<ListCampaignsResponse> = z
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
    data: z.array(Campaign).describe("List of campaigns"),
  })
  .partial();
const CreateCampaignRequest = z.object({
  name: z.string().describe("The name of the campaign."),
  url: z.string().url().describe("The URL associated with the campaign."),
  private: z.boolean().describe("Indicates if the campaign is private."),
  reward_type: z
    .enum(["percent", "flat"])
    .describe("Type of reward for the campaign, either 'percent' or 'flat'."),
  commission_percent: z
    .number()
    .describe("Commission percentage if the reward type is 'percent'.")
    .optional(),
  minimum_payout_cents: z
    .number()
    .int()
    .describe("The minimum payout amount in cents."),
});
const UpdateCampaignRequest = z
  .object({
    name: z.string().describe("The updated name of the campaign."),
    minimum_payout_cents: z
      .number()
      .int()
      .describe("The updated minimum payout amount in cents."),
  })
  .partial();

export const schemas = {
  ListCampaignsResponse,
  CreateCampaignRequest,
  UpdateCampaignRequest,
};

export const endpoints = makeApi([
  {
    method: "get",
    path: "/campaigns",
    alias: "getCampaigns",
    description: `Retrieve a list of all campaigns with pagination.`,
    requestFormat: "json",
    response: ListCampaignsResponse,
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
    ],
  },
  {
    method: "post",
    path: "/campaigns",
    alias: "postCampaigns",
    description: `Create a new campaign with specified attributes.`,
    requestFormat: "form-url",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateCampaignRequest,
      },
    ],
    response: Campaign.nullable(),
    errors: [
      {
        status: 400,
        description: `Bad Request - Invalid input data.`,
        schema: z.object({
          error: z
            .string()
            .describe("Error message describing the issue with the input."),
        }),
      },
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions.`,
        schema: z.object({
          error: z
            .string()
            .describe("Error message describing the authentication failure."),
        }),
      },
    ],
  },
  {
    method: "put",
    path: "/campaigns/:id",
    alias: "putCampaignsId",
    description: `Update a specific campaign by its unique ID.`,
    requestFormat: "form-url",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateCampaignRequest,
      },
      {
        name: "id",
        type: "Path",
        schema: id,
      },
    ],
    response: Campaign.nullable(),
    errors: [
      {
        status: 400,
        description: `Bad Request - Invalid input data.`,
        schema: z.object({
          error: z
            .string()
            .describe("Error message describing the issue with the input."),
        }),
      },
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
        description: `Campaign not found.`,
        schema: z.object({
          error: z
            .string()
            .describe("Error message indicating the campaign was not found."),
        }),
      },
    ],
  },
  {
    method: "get",
    path: "/campaigns/:id",
    alias: "getCampaignsId",
    description: `Retrieve a single campaign by its unique ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: id,
      },
    ],
    response: Campaign.nullable(),
    errors: [
      {
        status: 401,
        description: `Unauthorized - Invalid API key or permissions.`,
        schema: ErrorResponse.and(
          z
            .object({ error: z.string().describe("Description of the error.") })
            .partial()
        ),
      },
      {
        status: 404,
        description: `Campaign not found.`,
        schema: ErrorResponse.and(
          z
            .object({ error: z.string().describe("Description of the error.") })
            .partial()
        ),
      },
    ],
  },
]);

export const CampaignApi = new Zodios(
  "https://api.getrewardful.com/v1",
  endpoints
);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
