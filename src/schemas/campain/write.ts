import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {CampaignSchema} from "./schema";

extendZodWithOpenApi(z);

export const addCreateCampaignSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define the request schema for creating a new campaign
    const CreateCampaignRequestSchema = z.object({
        name: z.string().openapi({
            description: "The name of the campaign.",
            example: "Special Friends of Rewardful",
        }),
        url: z.string().url().openapi({
            description: "The URL associated with the campaign.",
            example: "https://rewardful.com",
        }),
        private: z.boolean().openapi({
            description: "Indicates if the campaign is private.",
            example: true,
        }),
        reward_type: z.enum(["percent", "flat"]).openapi({
            description: "Type of reward for the campaign, either 'percent' or 'flat'.",
            example: "percent",
        }),
        commission_percent: z.number().optional().openapi({
            description: "Commission percentage if the reward type is 'percent'.",
            example: 50.0,
        }),
        minimum_payout_cents: z.number().int().openapi({
            description: "The minimum payout amount in cents.",
            example: 5000,
        }),
    }).openapi("CreateCampaignRequest");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for creating a new campaign
    registry.registerPath({
        method: "post",
        path: "/campaigns",
        description: "Create a new campaign with specified attributes.",
        summary: "Create campaign",
        security: [{ [bearerAuth.name]: [] }],
        request: {
            body: {
                content: {
                    "application/x-www-form-urlencoded": {
                        schema: CreateCampaignRequestSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "The newly created Campaign object.",
                content: {
                    "application/json": {
                        schema: CampaignSchema.partial(),
                    },
                },
            },
            400: {
                description: "Bad Request - Invalid input data.",
                content: {
                    "application/json": {
                        schema: z.object({
                            error: z.string().openapi({
                                description: "Error message describing the issue with the input.",
                                example: "Invalid input data.",
                            }),
                        }),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions.",
                content: {
                    "application/json": {
                        schema: z.object({
                            error: z.string().openapi({
                                description: "Error message describing the authentication failure.",
                                example: "Invalid API Secret.",
                            }),
                        }),
                    },
                },
            },
        },
    });
};

export const addUpdateCampaignSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define the request schema for updating a campaign
    const UpdateCampaignRequestSchema = z.object({
        name: z.string().optional().openapi({
            description: "The updated name of the campaign.",
            example: "Best All Time Friends of Rewardful",
        }),
        minimum_payout_cents: z.number().int().optional().openapi({
            description: "The updated minimum payout amount in cents.",
            example: 1000,
        }),
    }).openapi("UpdateCampaignRequest");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for updating a campaign
    registry.registerPath({
        method: "put",
        path: "/campaigns/{id}",
        description: "Update a specific campaign by its unique ID.",
        summary: "Update campaign",
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: "The unique identifier of the campaign to update.",
                    example: "ceaef6d9-767e-49aa-a6ab-46c02aa79604",
                }),
            }),
            body: {
                content: {
                    "application/x-www-form-urlencoded": {
                        schema: UpdateCampaignRequestSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "The updated Campaign object.",
                content: {
                    "application/json": {
                        schema: CampaignSchema.partial(),
                    },
                },
            },
            400: {
                description: "Bad Request - Invalid input data.",
                content: {
                    "application/json": {
                        schema: z.object({
                            error: z.string().openapi({
                                description: "Error message describing the issue with the input.",
                                example: "Invalid input data.",
                            }),
                        }),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions.",
                content: {
                    "application/json": {
                        schema: z.object({
                            error: z.string().openapi({
                                description: "Error message describing the authentication failure.",
                                example: "Invalid API Secret.",
                            }),
                        }),
                    },
                },
            },
            404: {
                description: "Campaign not found.",
                content: {
                    "application/json": {
                        schema: z.object({
                            error: z.string().openapi({
                                description: "Error message indicating the campaign was not found.",
                                example: "Campaign not found: ceaef6d9-767e-49aa-a6ab-46c02aa79604",
                            }),
                        }),
                    },
                },
            },
        },
    });
};
