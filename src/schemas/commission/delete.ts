import { z } from "zod";
import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const addDeleteCommissionSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define the response schema for a successful deletion
    const DeleteCommissionResponseSchema = z.object({
        object: z.literal("commission").openapi({
            description: "Indicates the object type.",
            example: "commission",
        }),
        id: z.string().uuid().openapi({
            description: "The unique identifier of the deleted commission.",
            example: "39e68c88-d84a-4510-b3b4-43c75016a080",
        }),
        deleted: z.boolean().openapi({
            description: "Indicates if the commission was successfully deleted.",
            example: true,
        }),
    }).openapi("DeleteCommissionResponse");

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });

    // Register the path for deleting a commission
    registry.registerPath({
        method: "delete",
        path: "/commissions/{id}",
        description: "Delete a commission by its unique ID",
        summary: "Delete commission",
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: "The unique identifier of the commission to delete.",
                    example: "39e68c88-d84a-4510-b3b4-43c75016a080",
                }),
            }),
        },
        responses: {
            200: {
                description: "Confirmation that the commission was deleted.",
                content: {
                    "application/json": {
                        schema: DeleteCommissionResponseSchema,
                    },
                },
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
