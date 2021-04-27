import BigNumber from 'bignumber.js'
import { MasterNodeRegTestContainer } from '@defichain/testcontainers'
import { JsonRpcClient } from '@defichain/jellyfish-api-jsonrpc'
import { PoolPairInfo } from '@defichain/jellyfish-api-core'
import { OP_CODES } from '../src/script'
import { decodeAsEllipticPair, HASH160 } from '@defichain/jellyfish-crypto'
import { broadcastTx, createTx, signTx, setupVin } from './craft_utility'

const container = new MasterNodeRegTestContainer()
let client: JsonRpcClient

beforeAll(async () => {
  await container.start()
  await container.waitForReady()
  await container.waitForWalletCoinbaseMaturity()
  client = new JsonRpcClient(await container.getCachedRpcUrl())
})

afterAll(async () => {
  await container.stop()
})

beforeEach(async () => {
  await container.waitForWalletBalanceGTE(200)
})

async function setupPair (symbol: string): Promise<PoolPairInfo> {
  const tokenCollateralAddress = await client.wallet.getNewAddress()
  const poolPairOwnerAddress = await client.wallet.getNewAddress()
  const accountAddress = await client.wallet.getNewAddress()

  // Setup Token & Mint 1000
  await client.token.createToken({
    symbol: symbol,
    name: symbol,
    isDAT: true,
    mintable: true,
    tradeable: true,
    collateralAddress: tokenCollateralAddress
  })
  await container.generate(1)
  await container.call('utxostoaccount', [{ [accountAddress]: '50@0' }])
  await container.call('minttokens', [`50@${symbol}`])
  await container.generate(1)

  // Setup PoolPair
  await client.poolpair.createPoolPair({
    tokenA: 'DFI',
    tokenB: symbol,
    commission: 0.001,
    status: true,
    ownerAddress: poolPairOwnerAddress
  })
  await container.generate(1)

  const result = await client.poolpair.getPoolPair(`DFI-${symbol}`, true)
  const key = Object.keys(result)[0]
  return result[key]
}

async function getTokenNum (symbol: string): Promise<number> {
  if (symbol === 'DFI') {
    return 0
  }
  const result = await client.token.getToken('PAL')
  return Number.parseInt(Object.keys(result)[0])
}

it('should PoolAddLiquidity with custom tx created with buffer', async () => {
  await setupPair('PAL')
  const ellipticPair = decodeAsEllipticPair('cQSsfYvYkK5tx3u1ByK2ywTTc9xJrREc1dd67ZrJqJUEMwgktPWN')
  const vin = await setupVin(ellipticPair, container)

  // TODO(fuxingloh): wait for canonbrother PR
  //  send DFI & PAL to address

  // Fund a UTXO and create, sign and broadcast transaction.
  const tx = await createTx(vin)
  tx.vout.push({
    script: {
      stack: [
        OP_CODES.OP_RETURN,
        OP_CODES.OP_DEFI_TX_POOL_ADD_LIQUIDITY({
          from: [{
            balances: [
              {
                amount: new BigNumber('10.88889999'),
                token: await getTokenNum('DFI')
              },
              {
                amount: new BigNumber('20.40501111'),
                token: await getTokenNum('PAL')
              }
            ],
            script: {
              stack: [
                OP_CODES.OP_0,
                OP_CODES.OP_PUSHDATA(HASH160(await ellipticPair.publicKey()), 'little')
              ]
            }
          }],
          shareAddress: {
            stack: [
              OP_CODES.OP_0,
              OP_CODES.OP_PUSHDATA(HASH160(await ellipticPair.publicKey()), 'little')
            ]
          }
        })
      ]
    },
    value: new BigNumber(0),
    dct_id: 0
  })
  const signed = await signTx(vin, tx)
  await broadcastTx(client, signed)
  await container.generate(1)

  // TODO(fuxingloh): validate you actually added liquidity

  // TODO(fuxingloh): do a pool swap

  // TODO(fuxingloh): do a pool remove
})
