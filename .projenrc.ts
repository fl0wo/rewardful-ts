import {typescript} from 'projen';
import {NodePackageManager} from "projen/lib/javascript";

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'rewardful-ts',
  description: 'Unofficial Rewardful\'s API client for Node.js and Browser',
  packageName: 'rewardful-ts',

  projenrcTs: true,

  release: true,
  releaseToNpm: true,
  npmTokenSecret: "NPM_TOKEN",
  npmRegistryUrl: "https://registry.npmjs.org",

  packageManager: NodePackageManager.PNPM,

  deps: [],
});

project.synth();