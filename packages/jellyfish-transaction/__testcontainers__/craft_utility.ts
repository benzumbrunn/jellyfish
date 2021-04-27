import BigNumber from 'bignumber.js'
import {
  CTransactionSegWit,
  DeFiTransactionConstants,
  Transaction,
  TransactionSegWit,
  TransactionSigner
} from '../src'
import { OP_CODES } from '../src/script'
import { EllipticPair, HASH160, toBech32 } from '@defichain/jellyfish-crypto'
import { SmartBuffer } from 'smart-buffer'
import { JsonRpcClient } from '@defichain/jellyfish-api-jsonrpc'
import { MasterNodeRegTestContainer } from '@defichain/testcontainers'

export interface CraftInput {
  index: number
  txid: string
  amount: BigNumber
  ellipticPair: EllipticPair
}

export async function setupVin (ellipticPair: EllipticPair, container: MasterNodeRegTestContainer): Promise<CraftInput> {
  const address = toBech32(await ellipticPair.publicKey(), 'bcrt')

  const amount = new BigNumber(10)
  const { txid, vout } = await container.fundAddress(address, amount.toNumber())
  return {
    amount: amount,
    ellipticPair: ellipticPair,
    index: vout,
    txid: Buffer.from(txid, 'hex').reverse().toString('hex')
  }
}

export async function createTx (input: CraftInput): Promise<Transaction> {
  return {
    version: DeFiTransactionConstants.Version,
    vin: [
      {
        index: input.index,
        txid: input.txid,
        script: { stack: [] },
        sequence: 0xffffffff
      }
    ],
    vout: [
      {
        value: input.amount.minus(0.0001), // 0.0001 as fees
        script: {
          stack: [
            OP_CODES.OP_0,
            OP_CODES.OP_PUSHDATA(HASH160(await input.ellipticPair.publicKey()), 'little')
          ]
        },
        dct_id: 0x00
      }
    ],
    lockTime: 0x00000000
  }
}

export async function signTx (input: CraftInput, transaction: Transaction): Promise<TransactionSegWit> {
  return await TransactionSigner.sign(transaction, [{
    prevout: {
      value: input.amount,
      script: {
        stack: [
          OP_CODES.OP_0,
          OP_CODES.OP_PUSHDATA(HASH160(await input.ellipticPair.publicKey()), 'little')
        ]
      },
      dct_id: 0x00
    },
    ellipticPair: input.ellipticPair
  }])
}

export async function broadcastTx (client: JsonRpcClient, transaction: TransactionSegWit): Promise<void> {
  const buffer = new SmartBuffer()
  new CTransactionSegWit(transaction).toBuffer(buffer)

  await client.rawtx.sendRawTransaction(
    buffer.toBuffer().toString('hex')
  )
}
