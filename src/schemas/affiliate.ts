import { z } from 'zod';
import {extendZodWithOpenApi, OpenAPIRegistry} from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

export const addAffiliateSchemaToRegistry = (registry:OpenAPIRegistry) => {

    const CampaignSchema = z.object({
        id: z.string().uuid().openapi({ example: 'a638ebe4-291d-47cd-a1dc-1519f9331bbd' }),
        created_at: z.string().datetime().openapi({ example: '2019-04-27T18:13:13.123Z' }),
        updated_at: z.string().datetime().openapi({ example: '2019-05-05T20:58:24.200Z' }),
        name: z.string().openapi({ example: 'Best Friends of Kyle' })
    }).openapi('Campaign');

    const LinkSchema = z.object({
        id: z.string().uuid().openapi({ example: 'eb844960-6c42-4a3b-8009-f588a42d8506' }),
        url: z.string().url().openapi({ example: 'http://www.example.com/?via=adam' }),
        token: z.string().openapi({ example: 'adam' }),
        visitors: z.number().int().openapi({ example: 100 }),
        leads: z.number().int().openapi({ example: 42 }),
        conversions: z.number().int().openapi({ example: 18 })
    }).openapi('Link');

    const CouponSchema = z.object({
        id: z.string().uuid().openapi({ example: '75434e84-255b-4314-a278-820df5e76813' }),
        external_id: z.string().openapi({ example: 'promo_1a2b3c' }),
        token: z.string().openapi({ example: 'CODE' }),
        leads: z.number().int().openapi({ example: 0 }),
        conversions: z.number().int().openapi({ example: 0 }),
        affiliate_id: z.string().uuid().openapi({ example: '95d48f70-f1d4-42d9-b929-21996b6d9eb4' })
    }).openapi('Coupon');

    const AffiliateSchema = z.object({
        id: z.string().uuid().openapi({ example: 'd0ed8392-8880-4f39-8715-60230f9eceab' }),
        created_at: z.string().datetime().openapi({ example: '2019-05-09T16:18:59.920Z' }),
        updated_at: z.string().datetime().openapi({ example: '2019-05-09T16:25:42.614Z' }),
        first_name: z.string().openapi({ example: 'Adam' }),
        last_name: z.string().openapi({ example: 'Jones' }),
        email: z.string().email().openapi({ example: 'adam.jones@example.com' }),
        paypal_email: z.string().email().nullable().openapi({ example: null }),
        state: z.enum(['active', 'inactive']).openapi({ example: 'active' }),
        stripe_customer_id: z.string().nullable().optional().openapi({ example: 'cus_ABCDEF123456' }),
        stripe_account_id: z.string().nullable().optional().openapi({ example: 'acct_ABCDEF123456' }),
        visitors: z.number().int().openapi({ example: 100 }),
        leads: z.number().int().openapi({ example: 42 }),
        conversions: z.number().int().openapi({ example: 18 }),
        campaign: CampaignSchema.nullable().optional(),
        links: z.array(LinkSchema).optional(),
        coupon: CouponSchema.nullable().optional()
    }).openapi('Affiliate');



    registry.register('Affiliate', AffiliateSchema);

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

// Define the response schema for listAllAffiliates
    const ListAllAffiliatesResponseSchema = z.object({
        pagination: PaginationSchema,
        data: z.array(AffiliateSchema).openapi({ description: 'List of affiliates' })
    }).openapi('ListAllAffiliatesResponse');

// Register the path for listAllAffiliates
    registry.registerPath({
        method: 'get',
        path: '/affiliates',
        description: 'Retrieve a list of all affiliates with pagination',
        summary: 'List all affiliates',
        security: [{ [bearerAuth.name]: [] }],
        responses: {
            200: {
                description: 'Object containing pagination info and array of Affiliate objects.',
                content: {
                    'application/json': {
                        schema: ListAllAffiliatesResponseSchema
                    },
                },
            },
            401: {
                description: 'Unauthorized - Invalid API key or permissions',
            },
        },
    });
}