import BigNumber from 'bignumber.js'
import { parse, stringify, LosslessNumber } from 'lossless-json'

export { BigNumber, LosslessNumber }

/**
 * Numeric precision to parse RPC payload as.
 *
 * 'lossless' uses LosslessJSON that parses numeric values as LosslessNumber. With LosslessNumber, one can perform
 * regular numeric operations, and it will throw an error when this would result in losing information.
 *
 * 'bignumber' parse all numeric values as 'BigNumber' using bignumber.js library.
 *
 * 'number' parse all numeric values as 'Number' and precision will be loss if it exceeds IEEE-754 standard.
 */
export type Precision = 'lossless' | 'bignumber' | 'number'

/**
 * Revive lossless as a type
 */
const reviveLosslessAs = (transformer: (string: string) => any) => {
  return (key: string, value: any) => {
    if (value instanceof LosslessNumber) {
      return transformer(value.toString())
    }

    return value
  }
}

/**
 * JellyfishJSON allows parsing of JSON with 'lossless', 'bignumber' and 'number' numeric precision.
 */
export const JellyfishJSON = {
  /**
   * @param text JSON string to parse into object.
   * @param precision Numeric precision to parse RPC payload as.
   */
  parse (text: string, precision: Precision): any {
    switch (precision) {
      case 'lossless':
        return parse(text)

      case 'bignumber':
        return parse(text, reviveLosslessAs(string => new BigNumber(string)))

      case 'number':
        return parse(text, reviveLosslessAs(string => Number(string)))

      default:
        throw new Error(`JellyfishJson.parse ${precision as string} precision is not supported`)
    }
  },

  /**
   * @param value Object to stringify, with no risk of losing precision.
   */
  stringify (value: any): string {
    const replacer = (key: string, value: any): any => {
      if (value instanceof BigNumber) {
        return new LosslessNumber(value.toString())
      }
      return value
    }

    return stringify(value, replacer)
  }
}