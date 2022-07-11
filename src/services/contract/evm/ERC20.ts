import { ethers } from "ethers";
import { ChainId, Token, wagpayBridge } from "@wagpay/types";
import { NATIVE_ADDRESS } from "../../../config";
import { resolve } from "path";

export interface ApproveERC20 {
	amount: string;
	required: boolean;
}

export const _checkApprove = async (
	token: Token,
	chain: ChainId,
	amount: string,
	signer: ethers.Signer
): Promise<ApproveERC20> => {
	const addres = await signer.getAddress();

	const spender = wagpayBridge[Number(chain)]

	const abi = [
		"function allowance(address owner, address spender) public view returns (uint256)",
	];
	const erc20 = new ethers.Contract(token.address, abi, signer);

	const allowance = await erc20.allowance(
		addres.toString(),
		spender.toString()
	);

	const allowanceNumber = Number(
		ethers.utils.formatUnits(allowance.toString(), token.decimals)
	);
	const amountNumber = Number(
		ethers.utils.formatUnits(amount, token.decimals)
	);

	if (allowanceNumber >= amountNumber) {
		return {
			amount: "0",
			required: false,
		};
	} else {
		return {
			amount: (amountNumber - allowanceNumber).toString(),
			required: true,
		};
	}
};

export const _approve = async (
	token: Token,
	chain: ChainId,
	amount: string,
	signer: ethers.Signer
): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		const spender = wagpayBridge[Number(chain)]

		const ERC20abi = [
			"function approve(address _spender, uint256 _value) public returns (bool success)",
		];
		const erc20 = new ethers.Contract(token.address, ERC20abi, signer);
		try {
			await erc20.approve(
				spender,
				ethers.utils.parseUnits(amount, token.decimals)
			);
			resolve(true);
		} catch (e) {
			reject(false);
		}
	});
};

export const checkAndGetApproval = async (
	token: Token,
	chain: ChainId,
	amount: string,
	signer: ethers.Signer
): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		try {
			if (
				token.address.toLowerCase() !==
				NATIVE_ADDRESS.toLowerCase()
			) {
				const needed = await _checkApprove(
					token,
					chain as ChainId,
					amount.toString(),
					signer
				);
				// console.log(needed)
				if (needed.required) {
					await _approve(
						token,
						chain as ChainId,
						needed.amount,
						signer
					);
				}
			}
			resolve(true)
		} catch (e) {
			resolve(false)
		}
	})
}
