import { BigNumber } from '../src'

/**
 * Why JavaScript default number should not be used as it lose precision
 */
describe('number will lose precision', () => {
  it('1200000000.00000003 should not lose precision as a number but it does', () => {
    const dfi = 1200000000.00000003

    expect(() => {
      expect(dfi.toString()).toBe('1200000000.00000003')
    }).toThrow()
  })

  it('12.00000003 * 1000000 should be 12000000.03 but its not', () => {
    const obj = JSON.parse('{"dfi": 12.00000003}')
    const dfi = obj.dfi * 1000000

    expect(() => {
      expect(dfi).toBe(12000000.03)
    }).toThrow()
  })
})

/**
 * BigNumber from 'bignumber.js' implementations will not lose precision
 */
describe('BigNumber should not lose precision', () => {
  it('1200000000.00000003 should not lose precision', () => {
    const dfi = new BigNumber('1200000000.00000003')

    expect(dfi.toString()).toBe('1200000000.00000003')
  })

  it('12.00000003 * 1000000 should be 12000000.03', () => {
    const obj = { dfi: new BigNumber('12.00000003') }
    const dfi = obj.dfi.multipliedBy(1000000)

    expect(dfi.toString()).toBe('12000000.03')
  })
})
