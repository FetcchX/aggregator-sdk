import { ChainId, CoinKey, RouteData } from "@wagpay/types"
import { expect } from "chai"
import { ethers } from "ethers"
import WagPay from "../src"

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
		console.table(routes.map(route => {return {"name": route.name, "amount": route.amountToGet}}), ['name', 'amount'])
		expect(typeof(routes)).to.eq('object')
		expect(routes[0].name.toUpperCase()).to.contain.oneOf(['CELER', 'HYPHEN', 'HOP', 'CONNEXT', 'ACROSS', 'POLYGONPOS'])
		expect(routes[0].route.amount).to.eq(routeInfo.amount)
		expect(routes[0].uniswapData.fromToken.chainAgnositcId).to.eq(routeInfo.fromToken)
		expect(routes[0].uniswapData.toToken.chainAgnositcId).to.eq(routeInfo.toToken)
	})
})