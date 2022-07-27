import { ChainId, CoinKey, RouteData, Routes } from "@wagpay/types"
import { assert, expect } from "chai"
import { ethers } from "ethers"
import WagPay from "../src"
import { ReturnData } from "../src/types"

describe("Routes", () => {
	let wagpay: WagPay

	beforeEach(() => {
		wagpay = new WagPay()
	})

	it("fetches available routes between ETH(ETH) -> USDC(POL)", async () => {
		const routeInfo: RouteData = {
			fromChain: ChainId.ETH,
			toChain: ChainId.POL,
			fromToken: CoinKey.ETH,
			toToken: CoinKey.USDC,
			amount: ethers.utils.parseEther('1').toString()
		}

		const routes = await wagpay.getRoutes(routeInfo)
		console.log(routes[0])

		expect(typeof (routes)).to.eq('object')
		expect(routes[0].name.toUpperCase()).to.contain.oneOf(['CELER', 'HYPHEN', 'HOP', 'CONNEXT', 'ACROSS', 'POLYGONPOS'])
		expect(routes[0].route.amount).to.eq(routeInfo.amount)
		expect(routes[0].uniswapData.fromToken.chainAgnositcId).to.eq(routeInfo.fromToken)
		expect(routes[0].uniswapData.toToken.chainAgnositcId).to.eq(routeInfo.toToken)
	})

	it("fetches and executes a bridge", async () => {
		const route: Routes = {
			"name": "Hop", "logoUri": "https://raw.githubusercontent.com/chann44/assets-database/main/wagpay/bridge-images/hyphen.png", "bridgeTime": "2", "contractAddress": "0x8F255067135192B7C226821011271F26e627904a", "amountToGet": "15969.546089", "transferFee": "7.183156", "uniswapData": { "dex": "Uniswap", "fees": 48.0318, "chainId": 1, "fromToken": { "name": "Ethereum", "symbol": "ETH", "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", "chainAgnositcId": CoinKey.ETH, "decimals": 18, "chainId": 1 }, "toToken": { "name": "Tether USD", "symbol": "USDT", "address": "0xdac17f958d2ee523a2206206994597c13d831ec7", "chainAgnositcId": CoinKey.USDT, "decimals": 6, "chainId": 1 }, "amountToGet": 15962.568199999998 }, "extraData": {
				"bonderFee": "0"
			}, "route": { "fromChain": "1", "toChain": "137", "fromToken": { "name": "Ethereum", "symbol": "ETH", "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", "chainAgnositcId": CoinKey.ETH, "decimals": 18, "chainId": 1 }, "toToken": { "name": "Tether USD", "symbol": "USDT", "address": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", "chainAgnositcId": CoinKey.USDT, "decimals": 6, "chainId": 137 }, "amount": "10000000000000000000" }
		}

		const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/oD--2OO92oeHck5VCVI4hKEnYNCQ8F1d')
		let signer = new ethers.Wallet('0deeb28bb0125df571c3817760ded64965ed18374ac8e9b3637ebc3c4401fa3d', provider)
		signer = signer.connect(provider)
		console.log(signer.address)
		try {
			const data = await wagpay.executeRoute(signer.address, route, signer) as ReturnData
			expect(data.fromChain).to.eq(route.route.fromChain)
			expect(data.toChain).to.eq(route.route.toChain)
			expect(data.fromToken.address).to.eq(route.route.fromToken.address)
			expect(data.amount).to.eq(route.route.amount)
			expect(data.bridge).to.eq(route.name)
		} catch (e) { console.log(e); assert.fail('Transaction Unsuccessful') }
	})
})