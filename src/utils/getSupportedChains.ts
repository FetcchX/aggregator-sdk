import { Chain, ChainId, Chains, ChainType, CoinKey } from "@wagpay/types";

export const getSupportedChains = () => {
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
		{
			chain: Chains.OPT,
			type: ChainType.EVM,
			coinSupported: [
				CoinKey.USDC,
				CoinKey.USDT,
				CoinKey.ETH,
			],
			logoUri: 'https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/assets/images/Profile-Logo.png',
			id: ChainId.OPT,
			chainName: "optimism"
		}
	];

	return chains
}