import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {CommissionSchema} from "./schema";

extendZodWithOpenApi(z);

export const addListCommissionsSchemaToRegistry = (
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
    const ListCommissionsResponseSchema = z.object({
        pagination: PaginationSchema,
        data: z.array(CommissionSchema).openapi({ description: "List of commissions" }),
    }).openapi("ListCommissionsResponse");

    // Define the query schema for filtering, expansion, and pagination
    const StateEnum = z.enum(["paid", "due", "pending"]).openapi({
        description: "The state of the commission.",
        example: "paid",
    });

    const listCommissionsQuerySchema = z.object({
        expand: z.array(z.literal("sale")).optional().openapi({
            description: "Expand nested sale object in the response.",
            example: ["sale"],
        }),
        affiliate_id: z.string().uuid().optional().openapi({
            description: "Filter commissions by specific affiliate ID.",
            example: "b533bfca-7c70-4dec-9691-e136a8d9a26c",
        }),
        state: z.array(StateEnum).optional().openapi({
            description: "Filter commissions by state(s), e.g., 'paid', 'due', or 'pending'.",
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
    }).openapi("ListCommissionsQuery");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for listing commissions with query parameters
    registry.registerPath({
        method: "get",
        path: "/commissions",
        description: "Retrieve a list of commissions with optional filtering, expansion, and pagination.",
        summary: "List commissions with filters",
        tags: tags,
        security: [{ [bearerAuth.name]: [] }],
        request: {
            query: listCommissionsQuerySchema,
        },
        responses: {
            200: {
                description: "Object containing pagination info and an array of Commission objects.",
                content: {
                    "application/json": {
                        schema: ListCommissionsResponseSchema.partial(),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions",
            },
        },
    });
};

export const addGetCommissionSchemaToRegistry = (
    registry: OpenAPIRegistry,
    tags: string[]
) => {
    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for retrieving a single commission by ID
    registry.registerPath({
        method: "get",
        path: "/commissions/{id}",
        description: "Retrieve a single commission by its unique ID",
        summary: "Get a commission",
        tags: tags,
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: "The unique identifier of the commission",
                    example: "39e68c88-d84a-4510-b3b4-43c75016a080",
                }),
            }),
        },
        responses: {
            200: {
                description: "Commission object for the specified ID.",
                content: {
                    "application/json": {
                        schema: CommissionSchema.partial(),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions",
            },
            404: {
                description: "Commission not found",
            },
        },
    });
};
