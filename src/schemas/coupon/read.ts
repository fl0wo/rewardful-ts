import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {AffiliateCouponSchema} from "./schema";

extendZodWithOpenApi(z);

export const addListAndGetAffiliateCouponsSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define pagination schema for listing affiliate coupons
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
    const ListAffiliateCouponsResponseSchema = z.object({
        pagination: PaginationSchema,
        data: z.array(AffiliateCouponSchema).openapi({ description: "List of affiliate coupons" }),
    }).openapi("ListAffiliateCouponsResponse");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for listing affiliate coupons
    registry.registerPath({
        method: "get",
        path: "/affiliate_coupons",
        description: "Retrieve a list of all affiliate coupons with pagination",
        summary: "List all affiliate coupons",
        security: [{ [bearerAuth.name]: [] }],
        responses: {
            200: {
                description: "Object containing pagination info and an array of AffiliateCoupon objects.",
                content: {
                    "application/json": {
                        schema: ListAffiliateCouponsResponseSchema,
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions",
            },
        },
    });

    // Register the path for retrieving a single affiliate coupon by ID
    registry.registerPath({
        method: "get",
        path: "/affiliate_coupons/{id}",
        description: "Retrieve a single affiliate coupon by its unique ID",
        summary: "Get an affiliate coupon",
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: "The unique identifier of the affiliate coupon",
                    example: "d0ed8392-8880-4f39-8715-60230f9eceab",
                }),
            }),
        },
        responses: {
            200: {
                description: "AffiliateCoupon object for the specified ID.",
                content: {
                    "application/json": {
                        schema: AffiliateCouponSchema,
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions",
            },
            404: {
                description: "Affiliate coupon not found",
            },
        },
    });
};
