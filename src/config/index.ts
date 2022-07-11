import { config as configg } from 'dotenv'
configg()

type node_env = "prod" | "staging" | "dev"

const env: node_env = process.env.NODE_ENV as node_env

const backend_urls: { [key: string]: string } = {
	'dev': 'http://localhost:5000',
	'staging': 'http://staging.wagpay.club',
	'prod': 'https://wagpay.club',
}

const tx_api_urls: { [key: string]: string } = {
	'dev': 'http://localhost:5002',
	'staging': 'http://staging.wagpay.club/tx/graphql',
	'prod': 'https://wagpay.club/tx/graphql',
}

const testnet_config: any = {
	wagpayBridgeId: {
		Hyphen: 1,
		Hop: 2,
		Celer: 3,
		Across: 4,
		Connext: 5,
		PolygonPOS: 6
	},
	rpc_urls: {
		'1': 'https://eth-mainnet.g.alchemy.com/v2/y141okG6TC3PecBM1mL0BfST9f4WQmLx',
		'137': 'https://polygon-mumbai.g.alchemy.com/v2/oD--2OO92oeHck5VCVI4hKEnYNCQ8F1d',
		'56': '',
		'43114': ''
	},
	routing_api: backend_urls[env],
	tx_api: tx_api_urls[env]
}

const mainnet_config: any = {
	wagpayBridgeId: {
		Hyphen: 1,
		Hop: 2,
		Celer: 3,
		Across: 4,
		Connext: 5,
		PolygonPOS: 6
	},
	rpc_urls: {
		'1': 'https://eth-mainnet.g.alchemy.com/v2/y141okG6TC3PecBM1mL0BfST9f4WQmLx',
		'137': 'https://polygon-mainnet.g.alchemy.com/v2/DysZp2PQ51ql2Er-0GZKcnkGXEl9kIWn',
		'56': '',
		'43114': ''
	},
	routing_api: backend_urls[env],
	tx_api: tx_api_urls[env]
}

export const config = env === 'prod' ? mainnet_config : testnet_config
export * from "./constants"