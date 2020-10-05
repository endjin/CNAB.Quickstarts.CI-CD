import * as yaml from 'js-yaml'
import { parse } from 'docker-reference-parser';

export function updateManifest(manifestContents: string, version: string, registry: string, tag?: string) : string {
    let manifest = yaml.safeLoad(manifestContents);

    manifest.version = version;

    let bundle = manifest.tag;
    let bundleParsed = parse(bundle);

    let newBundle = `${registry}/${bundleParsed.path}`;
    if (tag) {
        newBundle += `:${tag}`
    }
    manifest.tag = newBundle;

    manifestContents = yaml.safeDump(manifest);

    return manifestContents;
}