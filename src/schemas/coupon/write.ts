import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {AffiliateCouponSchema} from "./schema";

extendZodWithOpenApi(z);

export const addCreateAffiliateCouponSchemaToRegistry = (
    registry: OpenAPIRegistry,
    tags: string[]
) => {
    // Define the request schema for creating an affiliate coupon
    const CreateAffiliateCouponRequestSchema = z.object({
        affiliate_id: z.string().uuid().openapi({
            description: "The ID of the affiliate associated with this coupon.",
            example: "f46a912b-08bc-4332-8771-c857e11ad9dd",
        }),
        token: z.string().openapi({
            description: "The unique token or code for the affiliate coupon.",
            example: "MYCODE",
        }),
    }).openapi("CreateAffiliateCouponRequest");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for creating an affiliate coupon
    registry.registerPath({
        method: "post",
        path: "/affiliate_coupons",
        description: "Create a new affiliate coupon",
        summary: "Create an affiliate coupon",
        tags: tags,
        security: [{ [bearerAuth.name]: [] }],
        request: {
            body: {
                content: {
                    "application/x-www-form-urlencoded": {
                        schema: CreateAffiliateCouponRequestSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Affiliate coupon created successfully.",
                content: {
                    "application/json": {
                        schema: AffiliateCouponSchema.partial(),
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
};
