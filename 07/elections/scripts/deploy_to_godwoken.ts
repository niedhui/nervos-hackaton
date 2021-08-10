require('dotenv').config()
import { ContractFactory } from "ethers";
import { PolyjuiceWallet, PolyjuiceConfig, PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";

const DEPLOYER_PRIVATE_KEY = process.env.PK!


const GODWOKEN_RPC_URL = 'http://godwoken-testnet-web3-rpc.ckbapp.dev';
const polyjuiceConfig = {
    rollupTypeHash: '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
    ethAccountLockCodeHash: '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
    web3Url: GODWOKEN_RPC_URL
};


const rpc = new PolyjuiceJsonRpcProvider(polyjuiceConfig, polyjuiceConfig.web3Url);
const deployer = new PolyjuiceWallet(DEPLOYER_PRIVATE_KEY, polyjuiceConfig, rpc);
const contract = require('../artifacts/contracts/Election.sol/Election.json')
const implementationFactory = new ContractFactory(
  contract.abi,
  contract.bytecode,
  deployer,
);

async function main() {
  const tx = implementationFactory.getDeployTransaction();
  tx.gasPrice = 0;
  tx.gasLimit = 1_000_000;
  console.log('deploying.....')
  const resp = await deployer.sendTransaction(tx);
  console.log('waiting.....')
  const receipt = await resp.wait()
  console.log(receipt)
  console.log(`contract address  is ${receipt.contractAddress}`)
}

main().then(() => console.log('ok'))
