import { parse } from 'docker-reference-parser';

export function updateManifest(manifest: any, version: string, registry: string, tag?: string) : string {
    manifest.version = version;

    let bundleTag = parse(manifest.tag);

    let newBundle = `${registry}/${bundleTag.path}`;
    if (tag) {
        newBundle += `:${tag}`
    }
    manifest.tag = newBundle;

    return manifest;
}

export function getRegistryTag(manifest: any) {
    let registryTag = manifest.tag

    let bundleTag = parse(registryTag);

    if (!bundleTag.tag) {
        registryTag += ":" + manifest.version
    }

    return registryTag
}