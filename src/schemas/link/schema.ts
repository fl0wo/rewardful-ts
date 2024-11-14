import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const AffiliateLinkSchema = z.object({
    id: z.string().uuid().openapi({
        description: "The unique identifier for the affiliate link.",
        example: "f46a912b-08bc-4332-8771-c857e11ad9dd",
    }),
    url: z.string().url().openapi({
        description: "The URL associated with the affiliate link.",
        example: "https://www.demo.com:8081/?via=luke",
    }),
    token: z.string().openapi({
        description: "The unique token for the affiliate link, usually a short identifier.",
        example: "luke",
    }),
    visitors: z.number().int().openapi({
        description: "The number of visitors who have used this affiliate link.",
        example: 10,
    }),
    leads: z.number().int().openapi({
        description: "The number of leads generated by this affiliate link.",
        example: 5,
    }),
    conversions: z.number().int().openapi({
        description: "The number of conversions generated by this affiliate link.",
        example: 3,
    }),
    affiliate_id: z.string().uuid().openapi({
        description: "The ID of the affiliate associated with this link.",
        example: "aaac9869-4242-4db9-afb1-f3518ef627c5",
    }),
}).openapi("AffiliateLink");
