import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {CampaignSchema} from "./schema";

extendZodWithOpenApi(z);

export const addCreateCampaignSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define the request schema for creating a new campaign
    const CreateCampaignRequestSchema = z.object({
        name: z.string().openapi({
            description: "The campaign's name",
            example: "My Campaign"
        }),
        url: z.string().url().openapi({
            description: "Base URL for generating affiliate links",
            example: "https://example.com"
        }),
        private: z.boolean().nullable().optional().openapi({
            description: "If true, campaign is invite-only. Default: false",
            example: false
        }),
        reward_type: z.enum(["percent", "amount"]).openapi({
            description: "Type of reward - percent or amount",
            example: "percent"
        }),
        commission_percent: z.number().optional().openapi({
            description: "Commission percentage (required if reward_type is percent)",
            example: 20.0
        }),
        commission_amount_cents: z.number().optional().openapi({
            description: "Fixed commission amount in cents (required if reward_type is amount)",
            example: 1000
        }),
        commission_amount_currency: z.string().optional().openapi({
            description: "Currency code for fixed commission (required if reward_type is amount)",
            example: "USD"
        }),
        minimum_payout_cents: z.number().nullable().optional().openapi({
            description: "Minimum cumulative commissions for payout. Default: 0",
            example: 5000
        }),
        stripe_coupon_id: z.string().nullable().optional().openapi({
            description: "Stripe coupon ID for double-sided incentives (Growth/Enterprise only)",
            example: "promo_123"
        })
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
                        schema: CampaignSchema,
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
            422: {
                description: "Unprocessable Entity - Invalid input data.",
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
            }
        },
    });
};

export const addUpdateCampaignSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define the request schema for updating a campaign
    const UpdateCampaignRequestSchema = z.object({
        name: z.string().optional().openapi({
            description: "The campaign's name",
            example: "My Campaign"
        }),
        url: z.string().url().optional().openapi({
            description: "Base URL for generating affiliate links",
            example: "https://example.com"
        }),
        private: z.boolean().nullable().optional().openapi({
            description: "If true, campaign is invite-only",
            example: false
        }),
        //// Reward type can't be blank
        reward_type: z.enum(["percent", "amount"]).openapi({
            description: "Type of reward - percent or amount",
            example: "percent"
        }),
        // Commission percent can't be blank
        commission_percent: z.number().openapi({
            description: "Commission percentage (required if reward_type is percent)",
            example: 20.0
        }),
        // Commission amount cents can't be blank
        commission_amount_cents: z.number().openapi({
            description: "Fixed commission amount in cents (required if reward_type is amount)",
            example: 1000
        }),
        commission_amount_currency: z.string().optional().openapi({
            description: "Currency code for fixed commission (required if reward_type is amount)",
            example: "USD"
        }),
        minimum_payout_cents: z.number().nullable().optional().openapi({
            description: "Minimum cumulative commissions for payout",
            example: 5000
        }),
        stripe_coupon_id: z.string().nullable().optional().openapi({
            description: "Stripe coupon ID for double-sided incentives (Growth/Enterprise only)",
            example: "promo_123"
        })
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
                        schema: CampaignSchema,
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
