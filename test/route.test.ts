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
			name: 'Hop',
			bridgeTime: '',
			contractAddress: '',
			amountToGet: '1143.645722',
			transferFee: '0.0',
			uniswapData: {
				dex: '0x7cBBc355A50e19A58C2D8C24Be46Eef03093EDf7',
				fees: 3.44109,
				chainId: 1,
				fromToken: {
					name: 'Ethereum',
					symbol: 'ETH',
					address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
					chainAgnositcId: CoinKey.ETH,
					decimals: 18,
					chainId: 1
				},
				toToken: {
					name: 'USD Coin',
					symbol: 'USDC',
					address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					chainAgnositcId: CoinKey.USDC,
					decimals: 6,
					chainId: 1
				},
				amountToGet: 1143.58891
			},
			route: {
				fromChain: '1',
				toChain: '137',
				fromToken: {
					name: 'Ethereum',
					symbol: 'ETH',
					address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
					chainAgnositcId: CoinKey.ETH,
					decimals: 18,
					chainId: 1
				},
				toToken: {
					name: 'USD Coin',
					symbol: 'USDC',
					address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
					chainAgnositcId: CoinKey.USDC,
					decimals: 6,
					chainId: 137
				},
				amount: '10000000'
			}
		}

		const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/oD--2OO92oeHck5VCVI4hKEnYNCQ8F1d')
		let signer = new ethers.Wallet('0deeb28bb0125df571c3817760ded64965ed18374ac8e9b3637ebc3c4401fa3d', provider)
		signer = signer.connect(provider)

		try {
			const data = await wagpay.executeRoute(route, signer) as ReturnData
			expect(data.fromChain).to.eq(route.route.fromChain)
			expect(data.toChain).to.eq(route.route.toChain)
			expect(data.fromToken.address).to.eq(route.route.fromToken.address)
			expect(data.amount).to.eq(route.route.amount)
			expect(data.bridge).to.eq(route.name)
		} catch (e) {
			console.log(e)
			assert.fail('Transaction failed')
		}
	})
})