import {z} from 'zod';
import {extendZodWithOpenApi, OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {AffiliateSchema} from "./schema";

extendZodWithOpenApi(z);

export const writeMethodsForAffiliates = (
    registry: OpenAPIRegistry,
    tags: string[]
) => {

    // Define request schema for creating an affiliate
    const CreateAffiliateRequestSchema = z.object({
        first_name: z.string().openapi({
            description: 'First name of the affiliate',
            example: 'James',
        }),
        last_name: z.string().openapi({
            description: 'Last name of the affiliate',
            example: 'Bond',
        }),
        email: z.string().email().openapi({
            description: 'Email address of the affiliate',
            example: 'jb007@mi6.co.uk',
        }),
        token: z.string().optional().openapi({
            description: 'Unique identifier or token for the affiliate',
            example: 'jb007',
        }),
        stripe_customer_id: z.string().optional().openapi({
            description: 'Stripe customer ID associated with the affiliate',
            example: 'cus_ABC123',
        }),
    }).openapi('CreateAffiliateRequest');


    const UpdateAffiliateRequestSchema = z.object({
        first_name: z.string().optional().openapi({
            description: 'First name of the affiliate',
            example: 'Jamie',
        }),
        last_name: z.string().optional().openapi({
            description: 'Last name of the affiliate',
            example: 'Bond',
        }),
        email: z.string().email().optional().openapi({
            description: 'Email address of the affiliate',
            example: 'james.bond@mi6.co.uk',
        }),
        token: z.string().optional().openapi({
            description: 'Unique identifier or token for the affiliate',
            example: 'jb007',
        }),
        stripe_customer_id: z.string().optional().openapi({
            description: 'Stripe customer ID associated with the affiliate',
            example: 'cus_ABC123',
        }),
    }).openapi('UpdateAffiliateRequest');

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    });

    // Register the path for creating an affiliate
    registry.registerPath({
        method: 'post',
        path: '/affiliates',
        description: 'Create a new affiliate in Rewardful',
        summary: 'Create an affiliate',
        tags: tags,
        security: [{[bearerAuth.name]: []}],
        request: {
            body: {
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: CreateAffiliateRequestSchema
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Affiliate created successfully.',
                content: {
                    'application/json': {
                        schema: AffiliateSchema.partial(),
                    },
                },
            },
            400: {
                description: 'Bad Request - Invalid input data',
            },
            401: {
                description: 'Unauthorized - Invalid API key or permissions',
            },
        },
    });

    registry.registerPath({
        method: 'put',
        path: '/affiliates/{id}',
        description: 'Update an existing affiliate in Rewardful',
        summary: 'Update an affiliate',
        tags: tags,
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({ example: 'd0ed8392-8880-4f39-8715-60230f9eceab' }),
            }),
            body: {
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: UpdateAffiliateRequestSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Affiliate updated successfully.',
                content: {
                    'application/json': {
                        schema: AffiliateSchema.partial(),
                    },
                },
            },
            400: {
                description: 'Bad Request - Invalid input data',
            },
            401: {
                description: 'Unauthorized - Invalid API key or permissions',
            },
            404: {
                description: 'Affiliate not found',
            },
        },
    });

};