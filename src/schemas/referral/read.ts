import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {ReferralSchema} from "./schema";

extendZodWithOpenApi(z);

export const addListReferralsSchemaToRegistry = (
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
    const ListReferralsResponseSchema = z.object({
        pagination: PaginationSchema,
        data: z.array(ReferralSchema).openapi({ description: "List of referrals" }),
    }).openapi("ListReferralsResponse");

    // Define the query schema for filtering, expansion, and pagination
    const ConversionStateEnum = z.enum(["conversion", "lead", "visitor"]).openapi({
        description: "The state of the referral conversion, either 'conversion', 'lead', or 'visitor'.",
        example: "lead",
    });

    const listReferralsQuerySchema = z.object({
        expand: z.array(z.literal("affiliate")).optional().openapi({
            description: "Expand nested affiliate object in the response.",
            example: ["affiliate"],
        }),
        affiliate_id: z.string().uuid().optional().openapi({
            description: "Filter referrals by specific affiliate ID.",
            example: "b533bfca-7c70-4dec-9691-e136a8d9a26c",
        }),
        conversion_state: z.array(ConversionStateEnum).optional().openapi({
            description: "Filter referrals by conversion state(s). Can include multiple values, e.g., 'lead' and 'conversion'.",
            example: ["lead", "conversion"],
        }),
        page: z.number().optional().openapi({
            description: "Page number for pagination.",
            example: 3,
        }),
        limit: z.number().optional().openapi({
            description: "Number of results per page for pagination.",
            example: 50,
        }),
    }).openapi("ListReferralsQuery");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for listing referrals with query parameters
    registry.registerPath({
        method: "get",
        path: "/referrals",
        description: "Retrieve a list of referrals with optional filtering, expansion, and pagination.",
        summary: "List referrals with filters",
        tags: tags,
        security: [{ [bearerAuth.name]: [] }],
        request: {
            query: listReferralsQuerySchema,
        },
        responses: {
            200: {
                description: "Object containing pagination info and an array of Referral objects.",
                content: {
                    "application/json": {
                        schema: ListReferralsResponseSchema.partial(),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions",
            },
        },
    });
};


