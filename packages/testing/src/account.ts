import { MasterNodeRegTestContainer } from '@defichain/testcontainers'
import { getNewAddress } from './wallet'

/**
 * send utxos to account
 *
 * @param {MasterNodeRegTestContainer} container
 * @param {number} amount
 * @param {UtxosToAccountOptions} [options]
 * @param {string} [options.address]
 * @return {Promise<void>}
 */
export async function utxosToAccount (
  container: MasterNodeRegTestContainer,
  amount: number,
  options?: UtxosToAccountOptions
): Promise<void> {
  const address = options?.address ?? await getNewAddress(container)
  const payload: { [key: string]: string } = {}
  payload[address] = `${amount.toString()}@0`
  await container.call('utxostoaccount', [payload])
  await container.generate(1)
}

/**
 * send utxos from account to account
 *
 * @param {MasterNodeRegTestContainer} container
 * @param {string} symbol
 * @param {number} amount
 * @param {AccountToAccountOptions} options
 * @param {string} options.from
 * @param {string} [options.to]
 * @return {Promise<string>}
 */
export async function accountToAccount (
  container: MasterNodeRegTestContainer,
  symbol: string,
  amount: number,
  options: AccountToAccountOptions
): Promise<string> {
  const to = options?.to ?? await getNewAddress(container)

  await container.call('accounttoaccount', [options.from, { [to]: `${amount.toString()}@${symbol}` }])
  await container.generate(1)

  return to
}

/**
 * @param {MasterNodeRegTestContainer} container
 * @param {string} address to send to
 * @param {number} amount to send
 * @param {string} symbol of the token to send
 * @return {string} hash of transaction
 */
export async function sendTokensToAddress (
  container: MasterNodeRegTestContainer,
  address: string,
  amount: number,
  symbol: string
): Promise<string> {
  return await container.call('sendtokenstoaddress', [{}, { [address]: [`${amount}@${symbol}`] }])
}

export interface UtxosToAccountOptions {
  address?: string
}

interface AccountToAccountOptions {
  from: string
  to?: string
}
