import BigNumber from 'bignumber.js'
import { SmartBuffer } from 'smart-buffer'
import { Bech32, WIF } from '@defichain/jellyfish-crypto'
import { CTransaction, CTransactionSegWit, SignInputOption, TransactionSigner } from '../../src'
import { OP_CODES } from '../../src/script'

// From Address P2WPKH
const input = {
  bech32: 'bcrt1qykj5fsrne09yazx4n72ue4fwtpx8u65zac9zhn',
  privKey: 'cQSsfYvYkK5tx3u1ByK2ywTTc9xJrREc1dd67ZrJqJUEMwgktPWN'
}

const unsigned = '040000000193c90783761bf94838ced5a8313eb355c3bdd053cdbdbb3f9e0f3dbc3243609b0000000000ffffffff020065cd1d000000001600144ab4391ce5a732e36139e72d79a28e01b7b080340080ce341d0000000016001425a544c073cbca4e88d59f95ccd52e584c7e6a820000000000'
const signed = '0400000000010193c90783761bf94838ced5a8313eb355c3bdd053cdbdbb3f9e0f3dbc3243609b0000000000ffffffff020065cd1d000000001600144ab4391ce5a732e36139e72d79a28e01b7b080340080ce341d0000000016001425a544c073cbca4e88d59f95ccd52e584c7e6a82000247304402201142c461b7b52323654710b14074928dd8e623d75141f9eb8c2132b7cb2d47c202202883fde993e1ecf0cf3955235522e9fe948b523b568d0e6b427f83c6f1b3efd9012103987aec2e508e124468f0f07a836d185b329026e7aaf75be48cf12be8f18cbe8100000000'

it('bi-directional unsigned buffer', () => {
  const fromBuffer = SmartBuffer.fromBuffer(Buffer.from(unsigned, 'hex'))
  const tx = new CTransaction(fromBuffer)

  const toBuffer = new SmartBuffer()
  tx.toBuffer(toBuffer)
  expect(toBuffer.toBuffer().toString('hex')).toBe(unsigned)
})

it('bi-directional signed buffer', () => {
  const fromBuffer = SmartBuffer.fromBuffer(Buffer.from(signed, 'hex'))
  const tx = new CTransactionSegWit(fromBuffer)

  const toBuffer = new SmartBuffer()
  tx.toBuffer(toBuffer)

  expect(toBuffer.toBuffer().toString('hex')).toBe(signed)
})

it('sign transaction', async () => {
  const txUnsigned = new CTransaction(
    SmartBuffer.fromBuffer(Buffer.from(unsigned, 'hex'))
  )

  const inputs: SignInputOption[] = [{
    prevout: {
      script: {
        stack: [
          OP_CODES.OP_0,
          OP_CODES.OP_PUSHDATA(Bech32.toHash160(input.bech32, 'bcrt', 0x00), 'little')
        ]
      },
      value: new BigNumber('10'),
      tokenId: 0
    },
    ellipticPair: WIF.asEllipticPair(input.privKey)
  }]
  const txSigned = new CTransactionSegWit(await TransactionSigner.sign(txUnsigned, inputs))

  const toBuffer = new SmartBuffer()
  txSigned.toBuffer(toBuffer)

  expect(toBuffer.toBuffer().toString('hex')).toBe(signed)
})
