import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {CommissionSchema} from "./schema";
import {PayoutSchema} from "../payout/schema";

extendZodWithOpenApi(z);


export const addMarkCommissionAsPaidSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for marking a commission as paid
    registry.registerPath({
        method: "put",
        path: "/payouts/{id}/pay",
        description: "Mark a payout and its commissions as paid.",
        summary: "Mark commission as paid",
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: "The unique identifier of the payout to mark as paid.",
                    example: "3b03791a-3fb5-4bd6-8ec3-614c9fd978ca",
                }),
            }),
        },
        responses: {
            200: {
                description: "Payout object with updated state and paid commissions.",
                content: {
                    "application/json": {
                        schema: PayoutSchema.partial(),
                    },
                },
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions.",
            },
            404: {
                description: "Payout not found.",
            },
        },
    });
};

export const addUpdateCommissionSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define the request schema for updating a commission
    const UpdateCommissionRequestSchema = z.object({
        paid_at: z.string().datetime().nullable().optional().openapi({
            description: "Timestamp to mark the commission as paid. Use null to mark as unpaid.",
            example: "2020-08-23T20:37:59.256Z",
        }),
        due_at: z.string().datetime().nullable().optional().openapi({
            description: "Timestamp to set the commission's due date.",
            example: "2020-08-23T20:37:59.256Z",
        }),
    }).openapi("UpdateCommissionRequest");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for updating a commission
    registry.registerPath({
        method: "put",
        path: "/commissions/{id}",
        description: "Update a commission's paid or due date status.",
        summary: "Update commission",
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: "The unique identifier of the commission to update.",
                    example: "01342824-914a-4aee-9f42-de823a8b74e2",
                }),
            }),
            body: {
                content: {
                    "application/x-www-form-urlencoded": {
                        schema: UpdateCommissionRequestSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Commission object with updated status.",
                content: {
                    "application/json": {
                        schema: CommissionSchema.partial(),
                    },
                },
            },
            400: {
                description: "Bad Request - Invalid input data.",
            },
            401: {
                description: "Unauthorized - Invalid API key or permissions.",
            },
            404: {
                description: "Commission not found.",
            },
        },
    });
};



