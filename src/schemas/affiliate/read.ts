import { z } from 'zod';
import {extendZodWithOpenApi, OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
import {AffiliateSchema} from "./schema";
extendZodWithOpenApi(z);

export const readMethodsForAffiliates = (registry:OpenAPIRegistry) => {
    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    });

// Define Pagination Schema
    const PaginationSchema = z.object({
        previous_page: z.number().nullable().openapi({ example: null }),
        current_page: z.number().openapi({ example: 1 }),
        next_page: z.number().nullable().openapi({ example: 2 }),
        count: z.number().openapi({ example: 25 }),
        limit: z.number().openapi({ example: 25 }),
        total_pages: z.number().openapi({ example: 141 }),
        total_count: z.number().openapi({ example: 3525 })
    }).openapi('Pagination');


    // Add optional expand field for querying expanded resources
    const ExpandEnum = z.enum([
        'campaign', 'links', 'commission_stats'
    ]).openapi({
        description: 'Fields that can be expanded in the response.',
        example: 'campaign',
    });

    // Add optional campaign_id and email fields for filtering affiliates
    const listAllAffiliatesQuerySchema = z.object({
        expand: ExpandEnum.optional(),
        campaign_id: z.string().uuid().optional().openapi({
            description: 'Filter by campaign ID.',
            example: 'c3482343-8680-40c5-af9a-9efa119713b5',
        }),
        email: z.string().email().optional().openapi({
            description: 'Filter by email address.',
            example: 'joe@example.com',
        }),
    }).openapi('ListAllAffiliatesQuery');

    const ListAllAffiliatesResponseSchema = z.object({
        pagination: PaginationSchema,
        data: z.array(AffiliateSchema).openapi({ description: 'List of affiliates' })
    }).openapi('ListAllAffiliatesResponse');

    // Register the modified path for listAllAffiliates with filtering options
    registry.registerPath({
        method: 'get',
        path: '/affiliates',
        description: 'Retrieve a list of all affiliates with pagination, optional expansion, and filtering by campaign or email.',
        summary: 'List all affiliates with filtering',
        security: [{ [bearerAuth.name]: [] }],
        request: {
            query: listAllAffiliatesQuerySchema
        },
        responses: {
            200: {
                description: 'Object containing pagination info and array of Affiliate objects.',
                content: {
                    'application/json': {
                        schema: ListAllAffiliatesResponseSchema.partial(),
                    },
                },
            },
            401: {
                description: 'Unauthorized - Invalid API key or permissions',
            },
        },
    });

    // Register the path for getAffiliate
    registry.registerPath({
        method: 'get',
        path: '/affiliates/{id}',
        description: 'Retrieve a single affiliate by its unique ID',
        summary: 'Get an affiliate',
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({ example: 'd0ed8392-8880-4f39-8715-60230f9eceab' })
            }),
        },
        responses: {
            200: {
                description: 'Affiliate object for the specified ID.',
                content: {
                    'application/json': {
                        schema: AffiliateSchema.partial(),
                    },
                },
            },
            404: {
                description: 'Affiliate not found',
            },
            401: {
                description: 'Unauthorized - Invalid API key or permissions',
            },
        },
    });
}