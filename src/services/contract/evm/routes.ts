import { ChainId, hopAddresses, Routes, wagpayBridge } from "@wagpay/types";
import { BigNumber, ethers } from "ethers";
import { config } from "../../../config";
import abi from "../../../interface/abi.json"
import { checkAndGetApproval, approve, checkApprove } from "./ERC20";
import { NATIVE_ADDRESS } from "../../../config";
import { ReturnData } from "../../../types";

export const constructExtraParams = (route: Routes) => {
	let params = ''

	const abiEncoder = ethers.utils.defaultAbiCoder;

	if (route.name.toUpperCase() === "HYPHEN") {
		params = "";
	} else if (route.name.toUpperCase() === "HOP") {
		if (route.route.fromChain === '1') {
			params = abiEncoder.encode(
				["address bridgeAddress"],
				[
					route.uniswapData
						? hopAddresses[route.route.fromChain][
						route.uniswapData.fromToken.chainAgnositcId
						]
						: hopAddresses[route.route.fromChain][
						route.route.fromToken.chainAgnositcId
						],
				]
			);
		} else {
			params = abiEncoder.encode(
				["address bridgeAddress", "uint bonderFee"],
				[
					route.uniswapData
						? hopAddresses[route.route.fromChain][
						route.uniswapData.fromToken.chainAgnositcId
						]
						: hopAddresses[route.route.fromChain][
						route.route.fromToken.chainAgnositcId
						],
					route.extraData.bonderFee
				]
			);
		}
	} else if (route.name.toUpperCase() === "CELER") {
		params = abiEncoder.encode(
			["uint64 nonce", "uint32 maxSlippage"],
			[route.extraData.nonce, route.extraData.slippage]
		);
	} else if (route.name.toUpperCase() === 'ACROSS') {
		params = abiEncoder.encode(
			["uint64 relayerfeePct", "uint32 quoteTimestamp"],
			[route.extraData.relayerFees, route.extraData.quoteTimestamp]
		)
	}
	return params ? params : route.route.fromToken.address
}

export const executeRoute = (
	receiver: string,
	route: Routes,
	signer: ethers.Signer
): Promise<ReturnData | Error> => {
	return new Promise(async (resolve, reject) => {
		try {
			const bridgeAddress =
				wagpayBridge[Number(route.route.fromChain)];

			const address = await signer.getAddress();

			// @note - get erc20 approval
			const done = await checkAndGetApproval(
				route.route.fromToken,
				route.route.fromChain as ChainId,
				route.route.amount,
				signer
			)

			if (!done) {
				reject(`Can't approve ${route.route.fromToken.name} on ${route.route.fromChain}`)
			}

			const contract = new ethers.Contract(
				bridgeAddress,
				abi,
				signer
			);

			const params = constructExtraParams(route)
			const routeDataArr = [
				receiver,
				BigNumber.from(config.wagpayBridgeId[route.name]),
				BigNumber.from(Number(route.route.toChain)),
				route.route.fromToken.address,
				BigNumber.from(route.route.amount),
				params,
				route.uniswapData ? true : false,
				[
					route.uniswapData.dex,
					BigNumber.from(route.route.amount),
					BigNumber.from(
						ethers.utils
							.parseUnits(
								route.uniswapData.amountToGet.toFixed(2),
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
				config.rpc_urls[route.route.fromChain]
			);

			const amount =
				route.route.fromToken.address ===
					NATIVE_ADDRESS.toLowerCase()
					? route.route.amount
					: "0";

			const transaction = await contract.transfer(routeDataArr, {
				value: BigNumber.from(amount),
				gasLimit: 15000000,
				gasPrice: connection.getGasPrice(),
			});
			await transaction.wait()

			const return_data: ReturnData = {
				fromChain: route.route.fromChain,
				toChain: route.route.toChain,
				fromToken: route.route.fromToken,
				toToken: route.route.toToken,
				amount: route.route.amount,
				bridge: route.name,
				from_transaction_hash: transaction.hash
			}

			resolve(return_data)
		} catch (e) {
			console.log(e);
			reject(e);
		}
	});
} 