import { generateZodClientFromOpenAPI } from "openapi-zod-client";
import { OpenAPIObject } from "openapi3-ts/oas30";
import SwaggerParser from "@apidevtools/swagger-parser";

const main = async () => {
    const openApiDoc = (await SwaggerParser.parse("./openapi/rewardful.yaml")) as OpenAPIObject;
    const result = await generateZodClientFromOpenAPI({
        openApiDoc,
        distPath: "./src/client.ts",
        options: {
            apiClientName: "RewardfulApiClient",
            baseUrl: "https://api.getrewardful.com/v1",

            withDescription: true,
            withAlias: true, // getAffiliatesId(...

            shouldExportAllSchemas: false,
            exportAllNamedSchemas: false,

            shouldExportAllTypes: false,
            additionalPropertiesDefaultValue: false,
        }
    });

    console.log("Generated client", result.split("\n").length, "lines of code");
};

main();