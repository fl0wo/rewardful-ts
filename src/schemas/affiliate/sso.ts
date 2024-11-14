import { z } from 'zod';
import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const addMagicLinkSchemaToRegistry = (registry: OpenAPIRegistry) => {
    // Define the SSO link response schema
    const SSOSchema = z.object({
        url: z.string().url().openapi({
            description: 'URL for the SSO login link for the affiliate',
            example: 'https://affiliates.example.com/sso?token=eyJhbGciOiJIUzI1NiJ9',
        }),
        expires: z.string().datetime().openapi({
            description: 'Expiration timestamp of the SSO link',
            example: '2020-08-28T05:32:02.471Z',
        }),
    }).openapi('SSO');

    const AffiliateBasicSchema = z.object({
        id: z.string().uuid().openapi({
            description: 'Affiliate ID',
            example: 'd049c0c6-5caf-440e-a774-8d5e87086d0b',
        }),
        email: z.string().email().openapi({
            description: 'Email address of the affiliate',
            example: 'jason@example.com',
        }),
    }).openapi('AffiliateBasic');

    const MagicLinkResponseSchema = z.object({
        sso: SSOSchema,
        affiliate: AffiliateBasicSchema,
    }).openapi('MagicLinkResponse');

    // Define the bearer authentication scheme
    const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    });

    // Register the path for generating an SSO link for an affiliate
    registry.registerPath({
        method: 'get',
        path: '/affiliates/{id}/sso',
        description: 'Generate an SSO link for an affiliate, allowing them to access their account',
        summary: 'Generate SSO link for affiliate',
        security: [{ [bearerAuth.name]: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({
                    description: 'The unique identifier of the affiliate',
                    example: 'd049c0c6-5caf-440e-a774-8d5e87086d0b',
                }),
            }),
        },
        responses: {
            200: {
                description: 'SSO link and affiliate information successfully generated.',
                content: {
                    'application/json': {
                        schema: MagicLinkResponseSchema.partial(),
                    },
                },
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
