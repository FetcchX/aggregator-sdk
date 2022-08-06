import { Tx } from "@wagpay/types";
import axios from "axios";

const BASE_GRAPHQL_URL = "https://wagpay.club/watcher/graphql"

export const getPendingTx = async (address: string, params?: string[]) => {
	return new Promise(async (resolve, reject) => {
		if (!params) {
			params = [
				'id',
				'from',
				'to',
				'from_chain',
				'to_chain',
				'from_token',
				'to_token',
				'amount',
				'estimateAmount',
				'origin_tx_hash',
				'dest_tx_hash',
				'bridge',
				'status',
				'origin_time',
				'dest_time'
			]
		}

		const endpoint = BASE_GRAPHQL_URL;
		const headers = {
			"content-type": "application/json",
		};

		try {
			const response = await axios({
				url: endpoint,
				method: "post",
				headers: headers,
				data: {
					query: `
					query GetTransaction{
						userTransactions(from: "${address}") {
							${params.join(",")}
						}
					}
				`,
				},
			});

			if (response.data.data) {
				resolve(response.data.data.userTransactions);
			} else {
				reject(response.data.errors);
			}
		} catch (e) {
			reject(e);
		}
	});
};

getPendingTx('0x5b9f628bae945968a50827b0b586e0e52f65280d').then(a => console.log(a)).catch(e => console.log(e))

// export const store_pending_tx = async (tx: Tx, params: string[]) => {
// 	return new Promise(async (resolve, reject) => {

// 		const endpoint = BASE_GRAPHQL_URL;
// 		const headers = {
// 			"content-type": "application/json",
// 		};

// 		let data = `{
// 			from: "${tx.from}",
// 			to: "${tx.to}",
// 			from_chain: ${tx.from_chain},
// 			to_chain: ${tx.to_chain},
// 			origin_tx_hash: "${tx.origin_tx_hash}",
// 			bridge: ${tx.bridge},
// 			status: ${tx.status},
// 			origin_time: "${tx.origin_time.toISOString()}"
// 		}`;

// 		// let data: string = JSON.stringify(x);
// 		// data.replace(/\\"/g, "\uFFFF"); // U+ FFFF
// 		// data = data.replace(/"([^"]+)":/g, "$1:").replace(/\uFFFF/g, '\\"');

// 		// const data = middle_data.substring(1, middle_data.length - 1);
// 		console.log(data);

// 		try {
// 			const response = await axios({
// 				url: endpoint,
// 				method: "post",
// 				headers: headers,
// 				data: {
// 					query: `
// 						mutation CreateTransaction {
// 							createTransaction(tx: ${data}) {
// 								${params.join(",")}
// 							}
// 						}
// 					`,
// 				},
// 			});

// 			if (response.data.data) {
// 				resolve(response.data.data.userTransactions);
// 			} else {
// 				reject(response.data.errors);
// 			}
// 		} catch (e: any) {
// 			// console.log(e);
// 			reject(e.response.data.errors);
// 		}
// 	});
// };
