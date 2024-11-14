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
import {addAffiliateSchemaToRegistry} from "../src/schemas/affiliate/read";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

addAffiliateSchemaToRegistry(registry);

function getOpenApiDocumentation() {
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