import { updateManifest } from '../src/functions'

test('update manifest, no tags', async () => {

    const before = 
`name: sql-server-always-on
version: 0.1.0
description: SQL Server Always On for AKS
dockerfile: cnab/app/Dockerfile.base
tag: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on'
`
    
    const after = 
`name: sql-server-always-on
version: 0.2.0-feature1.1
description: SQL Server Always On for AKS
dockerfile: cnab/app/Dockerfile.base
tag: myregistry.io/porter/sql-server-always-on
`

    let version = "0.2.0-feature1.1"
    let registry = "myregistry.io"

    let manifestContents = updateManifest(before, version, registry);

    expect(manifestContents).toBe(after);
});

test('update manifest, tag in original', async () => {

    const before = 
`name: sql-server-always-on
version: 0.1.0
description: SQL Server Always On for AKS
dockerfile: cnab/app/Dockerfile.base
tag: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on:customtag'
`
    
    const after = 
`name: sql-server-always-on
version: 0.2.0-feature1.1
description: SQL Server Always On for AKS
dockerfile: cnab/app/Dockerfile.base
tag: myregistry.io/porter/sql-server-always-on
`

    let version = "0.2.0-feature1.1"
    let registry = "myregistry.io"

    let manifestContents = updateManifest(before, version, registry);

    expect(manifestContents).toBe(after);
});

test('update manifest, tag in original and new tag', async () => {

    const before = 
`name: sql-server-always-on
version: 0.1.0
description: SQL Server Always On for AKS
dockerfile: cnab/app/Dockerfile.base
tag: 'cnabquickstarts.azurecr.io/porter/sql-server-always-on:customtag'
`
    
    const after = 
`name: sql-server-always-on
version: 0.2.0-feature1.1
description: SQL Server Always On for AKS
dockerfile: cnab/app/Dockerfile.base
tag: 'myregistry.io/porter/sql-server-always-on:latest'
`

    let version = "0.2.0-feature1.1"
    let registry = "myregistry.io"
    let tag = "latest"

    let manifestContents = updateManifest(before, version, registry, tag);

    expect(manifestContents).toBe(after);
});