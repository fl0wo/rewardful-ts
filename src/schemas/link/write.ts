import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {AffiliateLinkSchema} from "./schema";

extendZodWithOpenApi(z);

export const addCreateAffiliateLinkSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define the request schema for creating an affiliate link
    const CreateAffiliateLinkRequestSchema = z.object({
        affiliate_id: z.string().uuid().openapi({
            description: "The ID of the affiliate associated with this link.",
            example: "f46a912b-08bc-4332-8771-c857e11ad9dd",
        }),
        token: z.string().openapi({
            description: "The unique token for the affiliate link, usually a short identifier.",
            example: "luke-skywalker",
        }),
    }).openapi("CreateAffiliateLinkRequest");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for creating an affiliate link
    registry.registerPath({
        method: "post",
        path: "/affiliate_links",
        description: "Create a new affiliate link",
        summary: "Create an affiliate link",
        security: [{ [bearerAuth.name]: [] }],
        request: {
            body: {
                content: {
                    "application/x-www-form-urlencoded": {
                        schema: CreateAffiliateLinkRequestSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Affiliate link created successfully.",
                content: {
                    "application/json": {
                        schema: AffiliateLinkSchema,
                    },
                },
            },
            400: {
                description: "Bad Request - Invalid input data",
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions",
            },
        },
    });

    // Define the request schema for updating an affiliate link
    const UpdateAffiliateLinkRequestSchema = z.object({
        token: z.string().optional().openapi({
            description: "The new unique token for the affiliate link.",
            example: "darth-vader",
        }),
    }).openapi("UpdateAffiliateLinkRequest");

    // Register the path for updating an affiliate link
    registry.registerPath({
        method: "put",
        path: "/affiliate_links/{id}",
        description: "Update an existing affiliate link by its unique ID",
        summary: "Update an affiliate link",
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: "The unique identifier of the affiliate link to update.",
                    example: "d0ed8392-8880-4f39-8715-60230f9eceab",
                }),
            }),
            body: {
                content: {
                    "application/x-www-form-urlencoded": {
                        schema: UpdateAffiliateLinkRequestSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Affiliate link updated successfully.",
                content: {
                    "application/json": {
                        schema: AffiliateLinkSchema,
                    },
                },
            },
            400: {
                description: "Bad Request - Invalid input data",
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
