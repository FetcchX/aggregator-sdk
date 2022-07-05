import { _getRoutes } from "./services";
import { ethers, BigNumber } from "ethers";
import {
	ApproveERC20,
	_checkApprove,
	_approve,
} from "./services/contract/evm/ERC20";
import {
	CoinKey,
	ChainId,
	Chain,
	Coin,
	ExecuteRouteData,
	RouteData,
	Routes,
	Token,
	Chains,
	ChainType,
	wagpayBridge,
	hopAddresses,
	bridges,
	BridgeId,
	tokens,
	Tx,
	ChainNameEnum,
	BridgeNameEnum,
	TxStatus,
} from "@wagpay/types";
import { _get_pending_tx, _store_pending_tx } from "./services/api/pending_tx";

class WagPay {
	NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

	getRoutes = async (route: RouteData): Promise<Routes[]> => {
		return new Promise(async (resolve, reject) => {
			try {
				const routes = await _getRoutes(route);
				resolve(routes);
			} catch (e) {
				reject(e);
			}
		});
	};

	erc20ApproveNeeded = async (
		token: Token,
		spender: string,
		amount: string,
		signer: ethers.Signer
	): Promise<ApproveERC20> => {
		return new Promise(async (resolve, reject) => {
			try {
				const needed = await _checkApprove(
					token,
					spender,
					amount,
					signer
				);
				resolve(needed);
			} catch (e) {
				reject(e);
			}
		});
	};

	erc20Approve = async (
		token: Token,
		spender: string,
		amount: string,
		signer: ethers.Signer
	): Promise<boolean> => {
		return new Promise(async (resolve, reject) => {
			try {
				await _approve(token, spender, amount, signer);
				resolve(true);
			} catch (e) {
				reject(false);
			}
		});
	};

	executeRoute = async (
		route: Routes,
		signer: ethers.Signer
	): Promise<boolean | Error> => {
		return new Promise(async (resolve, reject) => {
			try {
				const bridgeAddress =
					wagpayBridge[Number(route.route.fromChain)];
				console.log(bridgeAddress, "da");
				console.log(
					route.route.fromToken.address.toLowerCase() !==
						this.NATIVE_ADDRESS.toLowerCase(),
					"token"
				);
				const address = await signer.getAddress();

				// @note - get erc20 approval
				if (
					route.route.fromToken.address.toLowerCase() !==
					this.NATIVE_ADDRESS.toLowerCase()
				) {
					const needed = await this.erc20ApproveNeeded(
						route.route.fromToken,
						bridgeAddress,
						route.route.amount.toString(),
						signer
					);
					// console.log(needed)
					if (needed.required) {
						await this.erc20Approve(
							route.route.fromToken,
							bridgeAddress,
							needed.amount,
							signer
						);
					}
				}

				const abi = [
					{
						anonymous: false,
						inputs: [
							{
								indexed: true,
								internalType: "address",
								name: "previousOwner",
								type: "address",
							},
							{
								indexed: true,
								internalType: "address",
								name: "newOwner",
								type: "address",
							},
						],
						name: "OwnershipTransferred",
						type: "event",
					},
					{
						inputs: [
							{
								internalType: "address",
								name: "newBridge",
								type: "address",
							},
						],
						name: "addBridge",
						outputs: [
							{
								internalType: "uint256",
								name: "",
								type: "uint256",
							},
						],
						stateMutability: "nonpayable",
						type: "function",
					},
					{
						inputs: [
							{
								internalType: "uint256",
								name: "_bridgeId",
								type: "uint256",
							},
						],
						name: "getBridge",
						outputs: [
							{
								internalType: "address",
								name: "",
								type: "address",
							},
						],
						stateMutability: "view",
						type: "function",
					},
					{
						inputs: [],
						name: "owner",
						outputs: [
							{
								internalType: "address",
								name: "",
								type: "address",
							},
						],
						stateMutability: "view",
						type: "function",
					},
					{
						inputs: [
							{
								internalType: "uint256",
								name: "bridgeId",
								type: "uint256",
							},
						],
						name: "removeBridge",
						outputs: [],
						stateMutability: "nonpayable",
						type: "function",
					},
					{
						inputs: [],
						name: "renounceOwnership",
						outputs: [],
						stateMutability: "nonpayable",
						type: "function",
					},
					{
						inputs: [
							{
								internalType: "address",
								name: "tokenAddr",
								type: "address",
							},
							{
								internalType: "uint256",
								name: "amount",
								type: "uint256",
							},
						],
						name: "rescueFunds",
						outputs: [],
						stateMutability: "nonpayable",
						type: "function",
					},
					{
						inputs: [
							{
								components: [
									{
										internalType: "address",
										name: "receiver",
										type: "address",
									},
									{
										internalType: "uint256",
										name: "bridgeId",
										type: "uint256",
									},
									{
										internalType: "uint64",
										name: "toChain",
										type: "uint64",
									},
									{
										internalType: "address",
										name: "fromToken",
										type: "address",
									},
									{
										internalType: "uint256",
										name: "amount",
										type: "uint256",
									},
									{
										internalType: "bytes",
										name: "extraData",
										type: "bytes",
									},
									{
										internalType: "bool",
										name: "dexRequired",
										type: "bool",
									},
									{
										components: [
											{
												internalType: "address",
												name: "dex",
												type: "address",
											},
											{
												internalType: "uint256",
												name: "amountIn",
												type: "uint256",
											},
											{
												internalType: "uint256",
												name: "amountOut",
												type: "uint256",
											},
											{
												internalType: "uint256",
												name: "fees",
												type: "uint256",
											},
											{
												internalType: "uint64",
												name: "chainId",
												type: "uint64",
											},
											{
												internalType: "address",
												name: "fromToken",
												type: "address",
											},
											{
												internalType: "address",
												name: "toToken",
												type: "address",
											},
											{
												internalType: "bytes",
												name: "extraData",
												type: "bytes",
											},
										],
										internalType:
											"struct WagPayBridge.DexData",
										name: "dex",
										type: "tuple",
									},
								],
								internalType: "struct WagPayBridge.RouteData",
								name: "route",
								type: "tuple",
							},
						],
						name: "transfer",
						outputs: [],
						stateMutability: "payable",
						type: "function",
					},
					{
						inputs: [
							{
								internalType: "address",
								name: "newOwner",
								type: "address",
							},
						],
						name: "transferOwnership",
						outputs: [],
						stateMutability: "nonpayable",
						type: "function",
					},
				];
				const contract = new ethers.Contract(
					bridgeAddress,
					abi,
					signer
				);

				const bridgeId: any = {
					Hyphen: 1,
					Hop: 2,
					Celer: 3,
				};

				var params = "0x00";
				var dexParams = "0x00";
				const abiEncoder = ethers.utils.defaultAbiCoder;
				if (route.name === "HYPHEN") {
					params = "";
				} else if (route.name === "HOP") {
					params = abiEncoder.encode(
						["address bridgeAddress"],
						[
							route.uniswapData
								? hopAddresses[route.route.fromChain][
										route.uniswapData.fromToken.name
								  ]
								: hopAddresses[route.route.fromChain][
										route.route.fromToken.name
								  ],
						]
					);
				} else if (route.name === "CELER") {
					params = abiEncoder.encode(
						["uint64 nonce", "uint32 maxSlippage"],
						[new Date().getTime(), 3000]
					);
				}

				const routeDataArr = [
					address,
					BigNumber.from(bridgeId[route.name]),
					BigNumber.from(Number(route.route.toChain)),
					route.route.fromToken.address,
					BigNumber.from(route.route.amount),
					bridgeAddress,
					route.uniswapData ? true : false,
					[
						route.uniswapData.dex,
						BigNumber.from(route.route.amount),
						BigNumber.from(
							ethers.utils
								.parseUnits(
									route.uniswapData.amountToGet.toString(),
									route.uniswapData.toToken.decimals
								)
								.toString()
						),
						BigNumber.from(Number(3000)),
						BigNumber.from(Number(route.uniswapData.chainId)),
						route.uniswapData.fromToken.address,
						route.uniswapData.toToken.address,
						bridgeAddress,
					],
				];

				const connection = new ethers.providers.JsonRpcProvider(
					route.route.fromChain == "1"
						? "https://eth-mainnet.g.alchemy.com/v2/y141okG6TC3PecBM1mL0BfST9f4WQmLx"
						: "https://polygon-mainnet.g.alchemy.com/v2/DysZp2PQ51ql2Er-0GZKcnkGXEl9kIWn"
				);

				const amount =
					route.route.fromToken.address ===
					this.NATIVE_ADDRESS.toLowerCase()
						? route.route.amount
						: "0";

				const transaction = await contract.transfer(routeDataArr, {
					value: BigNumber.from(amount),
					gasLimit: 15000000,
					gasPrice: connection.getGasPrice(),
				});

				resolve(true);
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
	};

	getTxs = (address: string, params?: string[]) => {
		if (!params || params.length === 0) {
			params = [
				"id",
				"status",
				"from",
				"to",
				"from_chain",
				"to_chain",
				"origin_tx_hash",
				"dest_tx_hash",
				"bridge",
				"status",
				"origin_time",
				"dest_time",
			];
		}

		return _get_pending_tx(params, address);
	};

	storeTxs = (tx: Tx) => {
		const params = [
			"id",
			"status",
			"from",
			"to",
			"from_chain",
			"to_chain",
			"origin_tx_hash",
			"dest_tx_hash",
			"bridge",
			"status",
			"origin_time",
			"dest_time",
		];
		return _store_pending_tx(tx, params);
	};

	getSupportedChains = () => {
		const chains: Chain[] = [
			{
				chain: Chains.ETH,
				type: ChainType.EVM,
				coinSupported: [
					CoinKey.USDC,
					CoinKey.USDT,
					CoinKey.ETH,
					CoinKey.MATIC,
				],
				logoUri:
					"https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/81d9f/eth-diamond-black.webp",
				id: ChainId.ETH,
				chainName: "ethereum",
			},
			{
				chain: Chains.POL,
				type: ChainType.EVM,
				coinSupported: [
					CoinKey.USDC,
					CoinKey.USDT,
					CoinKey.ETH,
					CoinKey.MATIC,
				],
				logoUri: "https://i.imgur.com/aSvJwxM.png",
				id: ChainId.POL,
				chainName: "polygon",
			},
		];

		return chains;
	};

	getSupportedBridges = () => {
		const bridge = [
			{
				logoUri: "",
				name: BridgeId.Hyphen,
				contract: {
					1: "",
					137: "0xf0AdF157c4E7b92FfeAb045816560F41ff930DD2",
					43114: "",
					56: "",
				},
				supported_chains: [
					ChainId.ETH,
					ChainId.AVA,
					ChainId.BSC,
					ChainId.POL,
				],
				supported_coins: [
					CoinKey.AVAX,
					CoinKey.ETH,
					CoinKey.USDC,
					CoinKey.USDT,
				],
			},
			{
				logoUri: "",
				name: BridgeId.Hop,
				contract: {
					1: "",
					137: "0xcC5a4A7d908CB869a890051aA7Ba12E9719F2AFb",
					43114: "",
					56: "",
				},
				supported_chains: [ChainId.ETH, ChainId.POL],
				supported_coins: [
					CoinKey.DAI,
					CoinKey.MATIC,
					CoinKey.ETH,
					CoinKey.USDC,
					CoinKey.USDT,
				],
			},
			{
				logoUri: "",
				name: BridgeId.Celer,
				contract: {
					1: "",
					137: "0x138C20AAc0e1602a92eCd2BF4634098b1d5765f1",
					43114: "",
					56: "",
				},
				supported_chains: [
					ChainId.ETH,
					ChainId.AVA,
					ChainId.BSC,
					ChainId.POL,
				],
				supported_coins: [
					CoinKey.MATIC,
					CoinKey.ETH,
					CoinKey.USDC,
					CoinKey.USDT,
				],
			},
		];
		return bridge;
	};

	getSupportedCoins = (chain: ChainId) => {
		const coins = tokens[chain as number];

		return coins;
	};
}

export default WagPay;

// (async () => {
// 	const wag = new WagPay();
// wag.getTxs("satyam")
// 	.then((data) => console.log(data))
// 	.catch((e) => console.log(e));
// console.log(wag.getSupportedCoins(1));
// console.log(wag.getSupportedCoins(ChainId.POL))
// const route = await wag.getRoutes({
// 	fromChain: ChainId.POL,
// 	toChain: ChainId.ETH,
// 	fromToken: CoinKey.USDC,
// 	toToken: CoinKey.ETH,
// 	amount: '100000000'
// })
// // console.log(route)
// const token: Token = {
// 	address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
// 	chainId: 1,
// 	name: CoinKey.USDC,
// 	decimals: 6
// }
// console.log(route[0])
// const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/oD--2OO92oeHck5VCVI4hKEnYNCQ8F1d')
// let signer = new ethers.Wallet('0deeb28bb0125df571c3817760ded64965ed18374ac8e9b3637ebc3c4401fa3d', provider)
// signer = signer.connect(provider)

// await wag.executeRoute(route[0], signer)
// })();
