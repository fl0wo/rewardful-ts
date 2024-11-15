import { generateZodClientFromOpenAPI } from "openapi-zod-client";
import { OpenAPIObject } from "openapi3-ts/oas30";
import SwaggerParser from "@apidevtools/swagger-parser";

import fs from "fs/promises";
import path from "path";

const clientPath = "./src/client"; // Path to generated files

const main = async () => {
    const openApiDoc = (await SwaggerParser.parse("./openapi/rewardful.yaml")) as OpenAPIObject;
    const result = await generateZodClientFromOpenAPI({
        openApiDoc,
        distPath: clientPath,
        options: {
            apiClientName: "RewardfulApiClient",
            baseUrl: "https://api.getrewardful.com/v1",
            withDescription: true,
            withAlias: true,
            shouldExportAllSchemas: true, // Ensures all schemas are exported
            exportAllNamedSchemas: true, // Ensures named schemas are exported
            shouldExportAllTypes: true,
            additionalPropertiesDefaultValue: false,

            groupStrategy: "tag-file", // Groups files based on tags
            complexityThreshold: 0, // Ensures schemas are assigned to variables
        }
    });

    makeEndpointsExported();

    console.log(
        "Generated client",
        Object.entries(result).length,
        "files with",
        Object.entries(result)
        .map(([_,val]) => val.length).reduce((a, b) => a + b),
        "lines of code"
    );
};

main();

// FIXME: I'm forced to do this as Zodios does not support "exportEndpoints: true" option
export const makeEndpointsExported = async () => {
    const files = await fs.readdir(clientPath);

    // Iterate over all files in the directory
    for (const file of files) {
        const filePath = path.join(clientPath, file);
        const content = await fs.readFile(filePath, "utf-8");

        // Check if the file defines `const endpoints = ...`
        if (content.includes("const endpoints = makeApi([")) {
            const updatedContent = content.replace(
                "const endpoints = makeApi([",
                "export const endpoints = makeApi(["
            );

            // Write back the updated file with `export` keyword
            await fs.writeFile(filePath, updatedContent, "utf-8");
            console.log(`Updated ${file} to export 'endpoints'`);
        }
    }
};