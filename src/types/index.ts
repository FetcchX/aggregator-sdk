import { Token } from "@wagpay/types"

export interface ReturnData {
	fromChain: string
	toChain: string
	fromToken: Token
	toToken: Token
	amount: string
	bridge: string
	from_transaction_hash: string
}