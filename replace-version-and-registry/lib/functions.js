"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const docker_reference_parser_1 = require("docker-reference-parser");
function updateManifest(manifest, version, registry, tag) {
    manifest.version = version;
    let bundleTag = docker_reference_parser_1.parse(manifest.tag);
    let newBundle = `${registry}/${bundleTag.path}`;
    if (tag) {
        newBundle += `:${tag}`;
    }
    manifest.tag = newBundle;
    return manifest;
}
exports.updateManifest = updateManifest;
function getRegistryTag(manifest) {
    let registryTag = manifest.tag;
    let bundleTag = docker_reference_parser_1.parse(registryTag);
    if (!bundleTag.tag) {
        registryTag += ":" + manifest.version;
    }
    return registryTag;
}
exports.getRegistryTag = getRegistryTag;
