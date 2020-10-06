import * as core from '@actions/core';
import { promises as fs } from 'fs';
import { getRegistryTag, updateManifest } from './functions'
import * as yaml from 'js-yaml'

export async function run() {
  try {

    let manifestPath = core.getInput("manifest_path");
    let version = core.getInput("version");
    let tag = core.getInput("tag");
    let registry = core.getInput("registry");

    let manifestContents = await fs.readFile(manifestPath, 'utf8');
    let manifest = yaml.safeLoad(manifestContents);

    manifest = updateManifest(manifestContents, version, registry, tag);

    let registryTag = getRegistryTag(manifest)

    core.setOutput("registry_tag", registryTag)

    manifestContents = yaml.safeDump(manifest);

    core.info("Updated manifest:\n");
    core.info(manifestContents);

    await fs.writeFile(manifestPath, manifestContents);

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));