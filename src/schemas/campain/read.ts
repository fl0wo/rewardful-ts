import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {CampaignSchema} from "./schema";

extendZodWithOpenApi(z);

export const addListCampaignsSchemaToRegistry = (
    registry: OpenAPIRegistry,
    tags: string[]
) => {

    // Define pagination schema
    const PaginationSchema = z.object({
        previous_page: z.number().nullable().openapi({ example: null }),
        current_page: z.number().openapi({ example: 1 }),
        next_page: z.number().nullable().openapi({ example: 2 }),
        count: z.number().openapi({ example: 25 }),
        limit: z.number().openapi({ example: 50 }),
        total_pages: z.number().openapi({ example: 10 }),
        total_count: z.number().openapi({ example: 250 }),
    }).openapi("Pagination");

    // Define response schema with pagination and data array
    const ListCampaignsResponseSchema = z.object({
        pagination: PaginationSchema,
        data: z.array(CampaignSchema).openapi({ description: "List of campaigns" }),
    }).openapi("ListCampaignsResponse");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for listing campaigns
    registry.registerPath({
        method: "get",
        path: "/campaigns",
        description: "Retrieve a list of all campaigns with pagination.",
        summary: "List campaigns",
        tags: tags,
        security: [{ [bearerAuth.name]: [] }],
        responses: {
            200: {
                description: "Object containing pagination info and an array of Campaign objects.",
                content: {
                    "application/json": {
                        schema: ListCampaignsResponseSchema.partial(),
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

export const addGetCampaignSchemaToRegistry = (
    registry: OpenAPIRegistry,
    tags: string[]
) => {
    // Define the error response schema
    const ErrorResponseSchema = z.object({
        error: z.string().openapi({
            description: "Description of the error.",
            example: "Campaign not found: ceaef6d9-767e-49aa-a6ab-46c02aa79604",
        }),
    }).openapi("ErrorResponse");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for retrieving a single campaign by ID
    registry.registerPath({
        method: "get",
        path: "/campaigns/{id}",
        description: "Retrieve a single campaign by its unique ID.",
        summary: "Get a campaign",
        tags: tags,
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: "The unique identifier of the campaign to retrieve.",
                    example: "ceaef6d9-767e-49aa-a6ab-46c02aa79604",
                }),
            }),
        },
        responses: {
            200: {
                description: "Campaign object for the specified ID.",
                content: {
                    "application/json": {
                        schema: CampaignSchema.partial(),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions.",
                content: {
                    "application/json": {
                        schema: ErrorResponseSchema,
                    },
                },
            },
            404: {
                description: "Campaign not found.",
                content: {
                    "application/json": {
                        schema: ErrorResponseSchema,
                    },
                },
            },
        },
    });
};
