import {
  ApiClient,
  ClientApiError,
  JellyfishJSON,
  RpcApiError,
  Precision
} from '@defichain/jellyfish-api-core'
import fetch from 'cross-fetch'
import { Response } from 'cross-fetch/lib.fetch'
import AbortController from 'abort-controller'
import { PrecisionPath } from '@defichain/jellyfish-json'

/**
 * ClientOptions for JsonRpc
 */
export interface ClientOptions {
  /**
   * Millis before RPC request is aborted
   * @default 60000 ms
   */
  timeout?: number

  /**
   * Headers to include in the RPC request
   * @default []
   */
  headers?: string[][] | Record<string, string>
}

/**
 * JsonRpcClient default client options
 */
export const defaultOptions: ClientOptions = {
  timeout: 60000,
  headers: undefined
}

/**
 * A JSON-RPC client implementation for connecting to a DeFiChain node.
 */
export class JsonRpcClient extends ApiClient {
  private readonly url: string
  private readonly options: ClientOptions

  /**
   * Construct a Jellyfish client to connect to a DeFiChain node via JSON-RPC.
   *
   * @param {string} url endpoint
   * @param {ClientOptions} [options] Optional ClientOptions
   * timeout: default to 60000ms
   * headers: none
   */
  constructor (url: string, options?: ClientOptions) {
    super()
    this.url = url
    this.options = Object.assign(defaultOptions, options ?? {})
  }

  /**
   * Implements JSON-RPC 1.0 specification for ApiClient
   */
  async call<T> (method: string, params: any[], precision: Precision | PrecisionPath): Promise<T> {
    const body = JsonRpcClient.stringify(method, params)
    const response = await this.fetchTimeout(body)
    const text = await response.text()

    switch (response.status) {
      case 200:
      default:
        return JsonRpcClient.parse(text, precision)

      case 401:
      case 404:
        throw new ClientApiError(`${response.status} - ${response.statusText}`)
    }
  }

  private static stringify (method: string, params: any[]): string {
    return JellyfishJSON.stringify({
      jsonrpc: '1.0',
      id: Math.floor(Math.random() * 100000000000000),
      method: method,
      params: params
    })
  }

  private static parse (text: string, precision: Precision | PrecisionPath): any {
    const { result, error } = JellyfishJSON.parse(text, {
      result: precision
    })

    if (error !== undefined && error !== null) {
      throw new RpcApiError(error)
    }

    return result
  }

  /**
   * Fetch with timeout defined in 'this.options.timeout'
   */
  private async fetchTimeout (body: string): Promise<Response> {
    const timeout: number = this.options.timeout ?? 60000
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    const request = fetch(this.url, {
      method: 'POST',
      body: body,
      cache: 'no-cache',
      headers: this.options.headers,
      signal: controller.signal
    })

    try {
      const response = await request
      clearTimeout(id)
      return response
    } catch (err) {
      if (err.type === 'aborted') {
        throw new ClientApiError(`request aborted due to set timeout of ${timeout}ms`)
      }

      throw err
    }
  }
}
