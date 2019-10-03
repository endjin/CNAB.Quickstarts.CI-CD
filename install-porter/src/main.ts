import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';

export async function run() {
  try {
    const execa = require('execa');

    let installPath = core.getInput("install_path");
    let porterUrl = core.getInput("porter_url");
    let porterVersion = core.getInput("porter_version");
    let feedUrl = core.getInput("feed_url");
    let mixinsStr = core.getInput("mixins");
    let mixinsVersion = core.getInput("mixins_version");

    let workspacePath = <string>process.env.GITHUB_WORKSPACE;
    let fullInstallPath = path.join(workspacePath, installPath);
    let fullPorterUrl = `${porterUrl}/${porterVersion}/porter-linux-amd64`

    core.info(`Installing porter from ${fullPorterUrl} to ${fullInstallPath}`);

    let downloadPath = await tc.downloadTool(fullPorterUrl);
    fs.mkdir(fullInstallPath, { recursive: true }, (err) => { if(err) throw err; });
    let porterTool = path.join(fullInstallPath, 'porter');
    fs.copyFile(downloadPath, porterTool, (err) => { if(err) throw err; });
    fs.chmod(porterTool, 'x', (err) => { if(err) throw err; });

    let cachedPath = await tc.cacheDir(fullInstallPath, 'porter', porterVersion);
    core.addPath(cachedPath);

    core.info("Installed porter")

    core.info("Installing mixins")

    let mixins = mixinsStr.split(',');

    mixins.forEach(async mixin => {
      const {stdout, stderr} = await execa('porter', ['mixin', 'install', mixin, '--version', mixinsVersion, '--feed-url', feedUrl]);
      if (stdout) core.info(stdout);
      if (stderr) core.error(stderr);
    });

    core.info("Installed mixins")

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));