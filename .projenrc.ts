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

  deps: [],
});

project.synth();