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
import {addMagicLinkSchemaToRegistry} from "../src/schemas/affiliate/link";

extendZodWithOpenApi(z);

function getOpenApiDocumentation() {
    const registry = new OpenAPIRegistry();

    registry.register('Affiliate', AffiliateSchema);

    readMethodsForAffiliates(registry);
    writeMethodsForAffiliates(registry);
    addMagicLinkSchemaToRegistry(registry);

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