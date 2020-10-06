import { updateManifest, getRegistryTag } from '../src/functions'

test('update manifest, no tags', async () => {

    const before = {
        name: "sql-server-always-on",
        version: "0.1.0",
        description: "SQL Server Always On for AKS",
        dockerfile: "cnab/app/Dockerfile.base",
        tag: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on'
    }

    const after = {
        name: "sql-server-always-on",
        version: "0.2.0-feature1.1",
        description: "SQL Server Always On for AKS",
        dockerfile: "cnab/app/Dockerfile.base",
        tag: 'myregistry.io/porter/sql-server-always-on'
    }

    let version = "0.2.0-feature1.1"
    let registry = "myregistry.io"

    let manifestContents = updateManifest(before, version, registry);

    expect(manifestContents).toEqual(after);
});

test('update manifest, tag in original', async () => {

    const before = {
        name: "sql-server-always-on",
        version: "0.1.0",
        description: "SQL Server Always On for AKS",
        dockerfile: "cnab/app/Dockerfile.base",
        tag: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on:customtag'
    }

    const after = {
        name: "sql-server-always-on",
        version: "0.2.0-feature1.1",
        description: "SQL Server Always On for AKS",
        dockerfile: "cnab/app/Dockerfile.base",
        tag: 'myregistry.io/porter/sql-server-always-on'
    }

    let version = "0.2.0-feature1.1"
    let registry = "myregistry.io"

    let manifestContents = updateManifest(before, version, registry);

    expect(manifestContents).toEqual(after);
});

test('update manifest, tag in original and new tag', async () => {

    const before = {
        name: "sql-server-always-on",
        version: "0.1.0",
        description: "SQL Server Always On for AKS",
        dockerfile: "cnab/app/Dockerfile.base",
        tag: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on:customtag'
    }

    const after = {
        name: "sql-server-always-on",
        version: "0.2.0-feature1.1",
        description: "SQL Server Always On for AKS",
        dockerfile: "cnab/app/Dockerfile.base",
        tag: 'myregistry.io/porter/sql-server-always-on:latest'
    }

    let version = "0.2.0-feature1.1"
    let registry = "myregistry.io"
    let tag = "latest"

    let manifestContents = updateManifest(before, version, registry, tag);

    expect(manifestContents).toEqual(after);
});

test('get registry tag, no tag', async () => {

    const manifest = {
        name: "sql-server-always-on",
        version: "0.1.0",
        tag: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on'
    }

    let registryTag = getRegistryTag(manifest);

    expect(registryTag).toEqual("cnabquickstarts.azurecr.io/porter/sql-server-always-on:0.1.0");
});

test('get registry tag, with tag', async () => {

    const manifest = {
        name: "sql-server-always-on",
        version: "0.1.0",
        tag: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on:latest'
    }

    let registryTag = getRegistryTag(manifest);

    expect(registryTag).toEqual("cnabquickstarts.azurecr.io/porter/sql-server-always-on:latest");
});