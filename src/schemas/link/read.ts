import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {AffiliateLinkSchema} from "./schema";

extendZodWithOpenApi(z);

export const addListAffiliateLinksSchemaToRegistry = (
    registry: OpenAPIRegistry,
    tags: string[]
) => {
    // Define pagination schema for listing affiliate links
    const PaginationSchema = z.object({
        previous_page: z.number().nullable().openapi({ example: null }),
        current_page: z.number().openapi({ example: 1 }),
        next_page: z.number().nullable().openapi({ example: 2 }),
        count: z.number().openapi({ example: 25 }),
        limit: z.number().openapi({ example: 25 }),
        total_pages: z.number().openapi({ example: 10 }),
        total_count: z.number().openapi({ example: 250 }),
    }).openapi("Pagination");

    // Define response schema with pagination and data array
    const ListAffiliateLinksResponseSchema = z.object({
        pagination: PaginationSchema,
        data: z.array(AffiliateLinkSchema).openapi({ description: "List of affiliate links" }),
    }).openapi("ListAffiliateLinksResponse");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for listing affiliate links
    registry.registerPath({
        method: "get",
        path: "/affiliate_links",
        description: "Retrieve a list of all affiliate links with pagination",
        summary: "List all affiliate links",
        security: [{ [bearerAuth.name]: [] }],
        tags: tags,
        responses: {
            200: {
                description: "Object containing pagination info and an array of AffiliateLink objects.",
                content: {
                    "application/json": {
                        schema: ListAffiliateLinksResponseSchema.partial(),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions",
            },
        },
    });

    registry.registerPath({
        method: "get",
        path: "/affiliate_links/{id}",
        description: "Retrieve a single affiliate link by its unique ID",
        summary: "Get an affiliate link",
        tags: tags,
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: "The unique identifier of the affiliate link",
                    example: "d0ed8392-8880-4f39-8715-60230f9eceab",
                }),
            }),
        },
        responses: {
            200: {
                description: "AffiliateLink object for the specified ID.",
                content: {
                    "application/json": {
                        schema: AffiliateLinkSchema.partial(),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions",
            },
            404: {
                description: "Affiliate link not found",
            },
        },
    });
};
