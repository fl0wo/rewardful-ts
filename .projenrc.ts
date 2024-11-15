import {typescript} from 'projen';
import {NodePackageManager} from "projen/lib/javascript";

const project = new typescript.TypeScriptProject({
    defaultReleaseBranch: 'main',
    name: 'rewardful-ts',
    description: 'Unofficial Rewardful\'s API client for Node.js and Browser',
    packageName: 'rewardful-ts',

    // AUTHOR
    authorName: 'Florian Sabani',
    authorEmail: 'sabaniflorian@gmail.com',

    // GITHUB
    repository: 'https://github.com/fl0wo/rewardful-ts.git',

    // PACKAGE RELEASE CONFIGURATION
    releaseToNpm: true,
    npmDistTag: 'latest',
    releaseWorkflowSetupSteps: [],

    pnpmVersion: '9.12.1',

    maxNodeVersion: '22',
    workflowNodeVersion: '22',

    release: true,
    eslint: false,
    projenrcTs: true,

    npmTokenSecret: "NPM_TOKEN",
    npmRegistryUrl: "https://registry.npmjs.org",

    packageManager: NodePackageManager.PNPM,

    jest: true,

    gitignore: [
        'secret.ts',
        '.idea'
    ],

    keywords: [
        'rewardful', 'affiliate', 'api', 'client', 'typescript', 'nodejs', 'sdk',
        'zod', 'openapi', 'axios', 'http', 'request', 'browser'
    ],

    tsconfig: {
        exclude: [
            'node_modules',
            'dist',
            'coverage',
            'schema',
            'generate',
            '*/schemas/*',
            '*/mock/*'
        ]
    },

    deps: [
        '@zodios/core'
    ],
    devDeps: [
        '@asteasolutions/zod-to-openapi',
        'openapi-zod-client',
        '@apidevtools/swagger-parser',
        'openapi3-ts',
        'prettier',
        'nock',
        'zod'
    ]
});

project.addPackageIgnore('secret.ts');
project.addPackageIgnore('secret.example.ts');
project.addPackageIgnore('.idea');
project.addPackageIgnore( 'generate');
project.addPackageIgnore('*/schemas/*');
project.addPackageIgnore('*/mock/*');

project.addScripts({
    'generate:openapi': 'tsx generate/openapi.ts',
    'generate:client': 'tsx generate/client.ts',
    'generate': 'pnpm generate:openapi && pnpm generate:client'
});

project.synth();