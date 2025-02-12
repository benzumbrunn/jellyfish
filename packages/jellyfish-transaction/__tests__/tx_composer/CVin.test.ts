import { CVin, Vin } from '../../src'
import { OP_PUSHDATA } from '../../src/script'
import { expectHexBufferToObject, expectObjectToHexBuffer } from './index'

describe('CVin', () => {
  describe('P2KH (UNSIGNED)', () => {
    const hex = 'fff7f7881a8099afa6940d42d1e7f6362bec38171ea3edf433541db4e4ad969f0000000000eeffffff'
    const data: Vin = {
      txid: 'fff7f7881a8099afa6940d42d1e7f6362bec38171ea3edf433541db4e4ad969f',
      index: 0x00000000,
      script: {
        stack: []
      },
      sequence: 0xffffffee
    }

    it('should compose from Buffer to Composable to Object', () => {
      expectHexBufferToObject(hex, data, buffer => new CVin(buffer))
    })

    it('should compose from Object to Composable to Buffer', () => {
      expectObjectToHexBuffer(data, hex, data => new CVin(data))
    })
  })

  describe('P2KH (SIGNED)', () => {
    const hex = 'fff7f7881a8099afa6940d42d1e7f6362bec38171ea3edf433541db4e4ad969f00000000494830450221008b9d1dc26ba6a9cb62127b02742fa9d754cd3bebf337f7a55d114c8e5cdd30be022040529b194ba3f9281a99f2b1c0a19c0489bc22ede944ccf4ecbab4cc618ef3ed01eeffffff'
    const data: Vin = {
      txid: 'fff7f7881a8099afa6940d42d1e7f6362bec38171ea3edf433541db4e4ad969f',
      index: 0x00000000,
      script: {
        stack: [
          new OP_PUSHDATA(Buffer.from('30450221008b9d1dc26ba6a9cb62127b02742fa9d754cd3bebf337f7a55d114c8e5cdd30be022040529b194ba3f9281a99f2b1c0a19c0489bc22ede944ccf4ecbab4cc618ef3ed01', 'hex'), 'little')
        ]
      },
      sequence: 0xffffffee
    }

    it('should compose from Buffer to Composable to Object', () => {
      expectHexBufferToObject(hex, data, buffer => new CVin(buffer))
    })

    it('should compose from Object to Composable to Buffer', () => {
      expectObjectToHexBuffer(data, hex, data => new CVin(data))
    })
  })

  describe('P2WPKH (SEGWIT)', () => {
    const hex = 'ef51e1b804cc89d182d279655c3aa89e815b1b309fe287d9b2b55d57b90ec68a0100000000ffffffff'
    const data: Vin = {
      txid: 'ef51e1b804cc89d182d279655c3aa89e815b1b309fe287d9b2b55d57b90ec68a',
      index: 0x00000001,
      script: {
        stack: []
      },
      sequence: 0xffffffff
    }

    it('should compose from Buffer to Composable to Object', () => {
      expectHexBufferToObject(hex, data, buffer => new CVin(buffer))
    })

    it('should compose from Object to Composable to Buffer', () => {
      expectObjectToHexBuffer(data, hex, data => new CVin(data))
    })
  })

  describe('P2SH-P2WPKH (UNSIGNED)', () => {
    const hex = 'db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a54770100000000feffffff'
    const data: Vin = {
      txid: 'db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a5477',
      index: 0x00000001,
      script: {
        stack: []
      },
      sequence: 0xfffffffe
    }

    it('should compose from Buffer to Composable to Object', () => {
      expectHexBufferToObject(hex, data, buffer => new CVin(buffer))
    })

    it('should compose from Object to Composable to Buffer', () => {
      expectObjectToHexBuffer(data, hex, data => new CVin(data))
    })
  })

  describe('P2SH-P2WPKH (SIGNED-SEGWIT)', () => {
    const hex = 'db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a5477010000001716001479091972186c449eb1ded22b78e40d009bdf0089feffffff'
    const data: Vin = {
      txid: 'db6b1b20aa0fd7b23880be2ecbd4a98130974cf4748fb66092ac4d3ceb1a5477',
      index: 0x00000001,
      script: {
        stack: [
          new OP_PUSHDATA(Buffer.from('001479091972186c449eb1ded22b78e40d009bdf0089', 'hex'), 'little')
        ]
      },
      sequence: 0xfffffffe
    }

    it('should compose from Buffer to Composable to Object', () => {
      expectHexBufferToObject(hex, data, buffer => new CVin(buffer))
    })

    it('should compose from Object to Composable to Buffer', () => {
      expectObjectToHexBuffer(data, hex, data => new CVin(data))
    })
  })
})
