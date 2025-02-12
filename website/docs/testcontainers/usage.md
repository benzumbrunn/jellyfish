---
id: usage
title: Testcontainers usage
sidebar_label: Testcontainers usage
slug: /testcontainers/usage
---

## Installation

Install as dev only as you don't need this in production. **Please don't use this in production!**

```shell
npm i -D @defichain/testcontainers
```

## Containers

* `RegTestContainer` provides a defid node managed in Docker.
* `MasterNodeRegTestContainer` provides a pre-configured masternode with coins auto minting.
* You can use your favourite test runner and set it up as part of the test lifecycle.

### RegTest

```ts
import {RegTestContainer} from '@defichain/testcontainers'

describe('reg test container', () => {
  const container = new RegTestContainer()

  beforeEach(async () => {
    await container.start()
    await container.waitForReady()
  })

  afterEach(async () => {
    await container.stop()
  })

  it('should getmintinginfo and chain should be regtest', async () => {
    // Using node.call('method', []), the built-in minimalistic rpc call
    const result = await container.call('getmintinginfo', [])
    expect(result.chain).toBe('regtest')
  })
})
```

### MasterNodeRegTest

With `MasterNodeRegTestContainer`, you can run a preconfigured masternode with staking enabled to auto mint every
second. Additionally, you can use `waitForWalletCoinbaseMaturity` to wait for coinbase maturity for your minted coins 
to be spendable.

```js
import {MasterNodeRegTestContainer} from '@defichain/testcontainers'
import waitForExpect from "wait-for-expect";

describe('master node pos minting', () => {
  const container = new MasterNodeRegTestContainer()

  beforeEach(async () => {
    await container.start()
    await container.waitForReady()
    await container.waitForWalletCoinbaseMaturity()
  })

  afterEach(async () => {
    await container.stop()
  })

  it('should wait until coinbase maturity with spendable balance', async () => {
    await waitForExpect(async () => {
      const info = await container.getMintingInfo()
      expect(info.blocks).toBeGreaterThan(100)
    })

    // perform utxostoaccount rpc
    const address = await container.getNewAddress()
    const payload: { [key: string]: string } = {}
    payload[address] = "100@0"
    await container.call("utxostoaccount", [payload])
  })
})
```

## Convenience methods

### getCachedRpcUrl

```js
const container = new RegTestContainer()

// they are dynmaically assigned to host, you can run multiple concurrent tests!
const rpcURL = await container.getCachedRpcUrl()
```

### call('method', [])

```js
const container = new RegTestContainer()

// raw calls
const {blocks} = await container.call('getmintinginfo')
const address = await container.call('getnewaddress', ['label', 'legacy'])

// basic included methods
const count = await container.getBlockCount()
const info = await container.getMintingInfo()
const newAddress = await container.getNewAddress()
```
