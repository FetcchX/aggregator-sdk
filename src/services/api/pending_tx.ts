import { Tx } from "@wagpay/types";
import axios from "axios";

const BASE_GRAPHQL_URL = "https://wagpay.club/watcher/graphql"

export const get_pending_tx = async (params: string[], address: string) => {
	return new Promise(async (resolve, reject) => {
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

export const store_pending_tx = async (tx: Tx, params: string[]) => {
	return new Promise(async (resolve, reject) => {
		const endpoint = BASE_GRAPHQL_URL;
		const headers = {
			"content-type": "application/json",
		};

		let data = `{
			from: "${tx.from}",
			to: "${tx.to}",
			from_chain: ${tx.from_chain},
			to_chain: ${tx.to_chain},
			origin_tx_hash: "${tx.origin_tx_hash}",
			bridge: ${tx.bridge},
			status: ${tx.status},
			origin_time: "${tx.origin_time.toISOString()}"
		}`;

		// let data: string = JSON.stringify(x);
		// data.replace(/\\"/g, "\uFFFF"); // U+ FFFF
		// data = data.replace(/"([^"]+)":/g, "$1:").replace(/\uFFFF/g, '\\"');

		// const data = middle_data.substring(1, middle_data.length - 1);
		console.log(data);

		try {
			const response = await axios({
				url: endpoint,
				method: "post",
				headers: headers,
				data: {
					query: `
						mutation CreateTransaction {
							createTransaction(tx: ${data}) {
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
		} catch (e: any) {
			// console.log(e);
			reject(e.response.data.errors);
		}
	});
};
