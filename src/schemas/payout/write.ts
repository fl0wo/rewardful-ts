import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {PayoutSchema} from "./schema";

extendZodWithOpenApi(z);

export const addMarkPayoutAsPaidSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for marking a payout as paid
    registry.registerPath({
        method: "put",
        path: "/payouts/{id}/pay",
        description: "Mark a payout as paid. This queues the payout for processing.",
        summary: "Mark payout as paid",
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
                description: "Payout object with updated state, typically set to 'processing'.",
                content: {
                    "application/json": {
                        schema: PayoutSchema,
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
                description: "Payout not found.",
                content: {
                    "application/json": {
                        schema: z.object({
                            error: z.string().openapi({
                                description: "Error message indicating the payout was not found.",
                                example: "Payout not found: 3b03791a-3fb5-4bd6-8ec3-614c9fd978ca",
                            }),
                        }),
                    },
                },
            },
        },
    });
};
