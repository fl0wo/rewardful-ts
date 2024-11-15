import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {PayoutSchema} from "./schema";

extendZodWithOpenApi(z);

export const addListPayoutsSchemaToRegistry = (
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
    const ListPayoutsResponseSchema = z.object({
        pagination: PaginationSchema,
        data: z.array(PayoutSchema).openapi({ description: "List of payouts" }),
    }).openapi("ListPayoutsResponse");

    // Define the query schema for filtering, expansion, and pagination
    const StateEnum = z.enum(["paid", "processing", "due", "pending", "completed", "failed"]).openapi({
        description: "The state of the payout.",
        example: "paid",
    });

    const listPayoutsQuerySchema = z.object({
        expand: z.array(z.enum(["affiliate", "commissions"])).optional().openapi({
            description: "Expand nested affiliate and/or commissions data in the response.",
            example: ["affiliate", "commissions"],
        }),
        affiliate_id: z.string().uuid().optional().openapi({
            description: "Filter payouts by specific affiliate ID.",
            example: "5768bd90-7953-493f-ae6c-6562eb4d7e72",
        }),
        state: z.array(StateEnum).optional().openapi({
            description: "Filter payouts by state(s), such as 'paid', 'due', or 'pending'.",
            example: ["due", "pending"],
        }),
        page: z.number().optional().openapi({
            description: "Page number for pagination.",
            example: 3,
        }),
        limit: z.number().optional().openapi({
            description: "Number of results per page for pagination.",
            example: 50,
        }),
    }).openapi("ListPayoutsQuery");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for listing payouts with query parameters
    registry.registerPath({
        method: "get",
        path: "/payouts",
        description: "Retrieve a list of payouts with optional filtering, expansion, and pagination.",
        summary: "List payouts with filters",
        tags: tags,
        security: [{ [bearerAuth.name]: [] }],
        request: {
            query: listPayoutsQuerySchema,
        },
        responses: {
            200: {
                description: "Object containing pagination info and an array of Payout objects.",
                content: {
                    "application/json": {
                        schema: ListPayoutsResponseSchema.partial(),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions.",
            },
        },
    });
};

extendZodWithOpenApi(z);

export const addGetPayoutSchemaToRegistry = (
    registry: OpenAPIRegistry,
    tags: string[]
) => {
    // Define the error response schema
    const ErrorResponseSchema = z.object({
        error: z.string().openapi({
            description: "Description of the error.",
            example: "Payout not found: 3b03791a-3fb5-4bd6-8ec3-614c9fd978ca",
        }),
    }).openapi("ErrorResponse");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for retrieving a single payout by ID
    registry.registerPath({
        method: "get",
        path: "/payouts/{id}",
        description: "Retrieve a single payout by its unique ID",
        summary: "Get a payout",
        tags: tags,
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: "The unique identifier of the payout",
                    example: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca",
                }),
            }),
        },
        responses: {
            200: {
                description: "Payout object for the specified ID.",
                content: {
                    "application/json": {
                        schema: PayoutSchema.partial(),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions",
                content: {
                    "application/json": {
                        schema: ErrorResponseSchema,
                    },
                },
            },
            404: {
                description: "Payout not found",
                content: {
                    "application/json": {
                        schema: ErrorResponseSchema,
                    },
                },
            },
        },
    });
};

