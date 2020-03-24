import * as core from '@actions/core';
import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import * as exec from '@actions/exec';

export async function run() {
  try {
    let manifestPath = core.getInput("manifest_path");

    let manifestContents = await fs.readFile(manifestPath, 'utf8');

    let manifest = yaml.safeLoad(manifestContents);
    let mixins = manifest.mixins;

    for (let i = 0; i < mixins.length; i++) {
      const mixin = mixins[i];
      
      // <Workaround> 
      // For Helm3 mixin - can remove when mixin is added to official Porter mixin feed
      if (mixin == "helm3") {
        await exec.exec('porter', ['mixin', 'install', 'helm3', '--url', 'https://github.com/squillace/porter-helm3/releases/download', '--version', 'v0.1.helm3-beta4']);
        continue
      }
      // </Workaround>
      
      await exec.exec('porter', ['mixin', 'install', mixin]);
    }

    core.setOutput("mixins", mixins.join(','));
   
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));