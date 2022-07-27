export * from "./config"
export * from "./services"
export * from "./types"

// class WagPay {
// 	NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

// 	getRoutes = async (route: RouteData): Promise<Routes[]> => {
// 		return new Promise(async (resolve, reject) => {
// 			try {
// 				const routes = await _getRoutes(route);
// 				resolve(routes);
// 			} catch (e) {
// 				reject(e);
// 			}
// 		});
// 	};

// 	erc20ApproveNeeded = async (
// 		token: Token,
// 		chain: ChainId,
// 		amount: string,
// 		signer: ethers.Signer
// 	): Promise<ApproveERC20> => {
// 		return new Promise(async (resolve, reject) => {
// 			try {
// 				const needed = await _checkApprove(
// 					token,
// 					chain,
// 					amount,
// 					signer
// 				);
// 				resolve(needed);
// 			} catch (e) {
// 				reject(e);
// 			}
// 		});
// 	};

// 	erc20Approve = async (
// 		token: Token,
// 		chain: ChainId,
// 		amount: string,
// 		signer: ethers.Signer
// 	): Promise<boolean> => {
// 		return new Promise(async (resolve, reject) => {
// 			try {
// 				await _approve(token, chain, amount, signer);
// 				resolve(true);
// 			} catch (e) {
// 				reject(false);
// 			}
// 		});
// 	};

// 	executeRoute = (
// 		receiver: string,
// 		route: Routes,
// 		signer: ethers.Signer
// 	): Promise<ReturnData | Error> => {
// 		return _executeRoute(receiver, route, signer)
// 	};

// 	getTxs = (address: string, params?: string[]) => {
// 		if (!params || params.length === 0) {
// 			params = [
// 				"id",
// 				"status",
// 				"from",
// 				"to",
// 				"from_chain",
// 				"to_chain",
// 				"origin_tx_hash",
// 				"dest_tx_hash",
// 				"bridge",
// 				"status",
// 				"origin_time",
// 				"dest_time",
// 			];
// 		}

// 		return _get_pending_tx(params, address);
// 	};

// 	storeTxs = (tx: Tx) => {
// 		const params = [
// 			"id",
// 			"status",
// 			"from",
// 			"to",
// 			"from_chain",
// 			"to_chain",
// 			"origin_tx_hash",
// 			"dest_tx_hash",
// 			"bridge",
// 			"status",
// 			"origin_time",
// 			"dest_time",
// 		];
// 		return _store_pending_tx(tx, params);
// 	};

// 	getSupportedChains = () => {
// 		const chains: Chain[] = [
// 			{
// 				chain: Chains.ETH,
// 				type: ChainType.EVM,
// 				coinSupported: [
// 					CoinKey.USDC,
// 					CoinKey.USDT,
// 					CoinKey.ETH,
// 					CoinKey.MATIC,
// 				],
// 				logoUri:
// 					"https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/81d9f/eth-diamond-black.webp",
// 				id: ChainId.ETH,
// 				chainName: "ethereum",
// 			},
// 			{
// 				chain: Chains.POL,
// 				type: ChainType.EVM,
// 				coinSupported: [
// 					CoinKey.USDC,
// 					CoinKey.USDT,
// 					CoinKey.ETH,
// 					CoinKey.MATIC,
// 				],
// 				logoUri: "https://i.imgur.com/aSvJwxM.png",
// 				id: ChainId.POL,
// 				chainName: "polygon",
// 			},
// 			{
// 				chain: Chains.OPT,
// 				type: ChainType.EVM,
// 				coinSupported: [
// 					CoinKey.USDC,
// 					CoinKey.USDT,
// 					CoinKey.ETH,
// 				],
// 				logoUri: 'https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/images/Profile-Logo.png',
// 				id: ChainId.OPT,
// 				chainName: "optimism"
// 			}
// 		];

// 		return chains;
// 	};

// 	getSupportedBridges = () => {
// 		const bridge = [
// 			{
// 				logoUri: "",
// 				name: BridgeId.Hyphen,
// 				contract: {
// 					1: "",
// 					137: "0xf0AdF157c4E7b92FfeAb045816560F41ff930DD2",
// 					43114: "",
// 					56: "",
// 				},
// 				supported_chains: [
// 					ChainId.ETH,
// 					ChainId.AVA,
// 					ChainId.BSC,
// 					ChainId.POL,
// 				],
// 				supported_coins: [
// 					CoinKey.AVAX,
// 					CoinKey.ETH,
// 					CoinKey.USDC,
// 					CoinKey.USDT,
// 				],
// 			},
// 			{
// 				logoUri: "",
// 				name: BridgeId.Hop,
// 				contract: {
// 					1: "",
// 					137: "0xcC5a4A7d908CB869a890051aA7Ba12E9719F2AFb",
// 					43114: "",
// 					56: "",
// 				},
// 				supported_chains: [ChainId.ETH, ChainId.POL],
// 				supported_coins: [
// 					CoinKey.DAI,
// 					CoinKey.MATIC,
// 					CoinKey.ETH,
// 					CoinKey.USDC,
// 					CoinKey.USDT,
// 				],
// 			},
// 			{
// 				logoUri: "",
// 				name: BridgeId.Celer,
// 				contract: {
// 					1: "",
// 					137: "0x138C20AAc0e1602a92eCd2BF4634098b1d5765f1",
// 					43114: "",
// 					56: "",
// 				},
// 				supported_chains: [
// 					ChainId.ETH,
// 					ChainId.AVA,
// 					ChainId.BSC,
// 					ChainId.POL,
// 				],
// 				supported_coins: [
// 					CoinKey.MATIC,
// 					CoinKey.ETH,
// 					CoinKey.USDC,
// 					CoinKey.USDT,
// 				],
// 			},
// 		];
// 		return bridge;
// 	};

// 	getSupportedCoins = (chain: ChainId) => {
// 		const coins = tokens[chain as number];

// 		return coins;
// 	};
// }

// export default WagPay;

// (async () => {
// 	const wag = new WagPay();
// 	// 	wag.getTxs("satyam")
// 	// 	.then((data) => console.log(data))
// 	// 	.catch((e) => console.log(e));
// 	// console.log(wag.getSupportedCoins(1));
// 	// console.log(wag.getSupportedCoins(ChainId.POL))
// 	const route = await wag.getRoutes({
// 		fromChain: ChainId.POL,
// 		toChain: ChainId.ETH,
// 		fromToken: CoinKey.MATIC,
// 		toToken: CoinKey.USDC,
// 		amount: ethers.utils.parseEther('100').toString()
// 	})
// 	console.log(route)
// 	// const token: Token = {
// 	// 	address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
// 	// 	chainId: 1,
// 	// 	name: CoinKey.USDC,
// 	// 	decimals: 6
// 	// }
// 	console.log(route[1])
// 	const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/oD--2OO92oeHck5VCVI4hKEnYNCQ8F1d')
// 	let signer = new ethers.Wallet('0deeb28bb0125df571c3817760ded64965ed18374ac8e9b3637ebc3c4401fa3d', provider)
// 	signer = signer.connect(provider)

// 	const data = await wag.executeRoute(signer.address, route[1], signer)
// 	console.log(data)
// })();
