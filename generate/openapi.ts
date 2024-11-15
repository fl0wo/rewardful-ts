import {
    OpenApiGeneratorV3,
    // The exact same can be achieved by importing OpenApiGeneratorV31 instead:
    // OpenApiGeneratorV31
    OpenAPIRegistry,
    extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';

import { z } from 'zod';
import * as yaml from 'yaml';
import * as fs from 'fs';
import {readMethodsForAffiliates} from "../src/schemas/affiliate/read";
import {AffiliateSchema} from "../src/schemas/affiliate/schema";
import {writeMethodsForAffiliates} from "../src/schemas/affiliate/write";
import {addMagicLinkSchemaToRegistry} from "../src/schemas/affiliate/sso";
import {AffiliateLinkSchema} from "../src/schemas/link/schema";
import {addListAffiliateLinksSchemaToRegistry} from "../src/schemas/link/read";
import {addCreateAffiliateLinkSchemaToRegistry} from "../src/schemas/link/write";
import {AffiliateCouponSchema} from "../src/schemas/coupon/schema";
import {addListAndGetAffiliateCouponsSchemaToRegistry} from "../src/schemas/coupon/read";
import {addCreateAffiliateCouponSchemaToRegistry} from "../src/schemas/coupon/write";
import {ReferralSchema} from "../src/schemas/referral/schema";
import {addListReferralsSchemaToRegistry} from "../src/schemas/referral/read";
import {CommissionSchema} from "../src/schemas/commission/schema";
import {addGetCommissionSchemaToRegistry, addListCommissionsSchemaToRegistry} from "../src/schemas/commission/read";
import {
    addMarkCommissionAsPaidSchemaToRegistry,
    addUpdateCommissionSchemaToRegistry
} from "../src/schemas/commission/write";
import {addDeleteCommissionSchemaToRegistry} from "../src/schemas/commission/delete";
import {PayoutSchema} from "../src/schemas/payout/schema";
import {addGetPayoutSchemaToRegistry, addListPayoutsSchemaToRegistry} from "../src/schemas/payout/read";
import {addMarkPayoutAsPaidSchemaToRegistry} from "../src/schemas/payout/write";
import {CampaignSchema} from "../src/schemas/campain/schema";
import {addGetCampaignSchemaToRegistry, addListCampaignsSchemaToRegistry} from "../src/schemas/campain/read";
import {addCreateCampaignSchemaToRegistry, addUpdateCampaignSchemaToRegistry} from "../src/schemas/campain/write";

extendZodWithOpenApi(z);

function getOpenApiDocumentation() {
    const registry = new OpenAPIRegistry();

    registry.register('Affiliate', AffiliateSchema);
    readMethodsForAffiliates(registry, ['Affiliate']);
    writeMethodsForAffiliates(registry, ['Affiliate']);
    addMagicLinkSchemaToRegistry(registry, ['Affiliate']);

    registry.register('AffiliateLink', AffiliateLinkSchema);
    addListAffiliateLinksSchemaToRegistry(registry, ['AffiliateLink']);
    addCreateAffiliateLinkSchemaToRegistry(registry, ['AffiliateLink']);

    registry.register('AffiliateCoupon', AffiliateCouponSchema);
    addListAndGetAffiliateCouponsSchemaToRegistry(registry, ['AffiliateCoupon']);
    addCreateAffiliateCouponSchemaToRegistry(registry, ['AffiliateCoupon']);

    registry.register('ReferralSchema',ReferralSchema);
    addListReferralsSchemaToRegistry(registry, ['Referral']);

    registry.register('CommissionSchema',CommissionSchema);
    addListCommissionsSchemaToRegistry(registry, ['Commission']);
    addGetCommissionSchemaToRegistry(registry, ['Commission']);
    addMarkCommissionAsPaidSchemaToRegistry(registry, ['Commission']);
    addUpdateCommissionSchemaToRegistry(registry, ['Commission']);
    addDeleteCommissionSchemaToRegistry(registry, ['Commission']);

    registry.register('PayoutSchema', PayoutSchema);
    addListPayoutsSchemaToRegistry(registry, ['Payout']);
    addGetPayoutSchemaToRegistry(registry, ['Payout']);
    addMarkPayoutAsPaidSchemaToRegistry(registry, ['Payout']);

    registry.register('CampaignSchema', CampaignSchema);
    addListCampaignsSchemaToRegistry(registry, ['Campaign']);
    addCreateCampaignSchemaToRegistry(registry, ['Campaign']);
    addUpdateCampaignSchemaToRegistry(registry, ['Campaign']);
    addGetCampaignSchemaToRegistry(registry, ['Campaign']);

    const generator = new OpenApiGeneratorV3(registry.definitions);

    return generator.generateDocument({
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Rewardful API',
            description: 'Rewardful API Documentation',
        },
        servers: [{ url: 'v1' }],
    });
}

function writeDocumentation() {
    // OpenAPI JSON
    const docs = getOpenApiDocumentation();

    // YAML equivalent
    const fileContent = yaml.stringify(docs);

    fs.writeFileSync(`${__dirname}/../openapi/rewardful.yaml`, fileContent, {
        encoding: 'utf-8',
    });
}

writeDocumentation();