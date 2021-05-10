import BigNumber from "bignumber.js";
import { WalletAccount } from "./wallet_account";

export class WalletAccountDex {
  constructor (protected readonly account: WalletAccount) {
  }

  async swap (swap: DexSwap): Promise<void> {

  }

  async addLiquidity (add: DexAdd): Promise<void> {

  }

  async removeLiquidity (remove: DexRemove): Promise<void> {

  }
}

export interface DexSwap {
  fromTokenId: number
  toTokenId: number
  amount: BigNumber
  maxPrice: {
    integer: BigNumber
    fraction: BigNumber
  }
}

export interface DexAdd {
  aTokenId: number
  aAmount: BigNumber

  bTokenId: number
  bAmount: BigNumber
}

export interface DexRemove {
  tokenId: number
  amount: BigNumber
}
