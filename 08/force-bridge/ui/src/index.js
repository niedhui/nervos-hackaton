import $ from 'jquery'
import Web3 from "web3"

import { PolyjuiceWallet, PolyjuiceConfig } from '@polyjuice-provider/ethers'
import { PolyjuiceHttpProvider } from "@polyjuice-provider/web3"
import { AddressTranslator } from 'nervos-godwoken-integration'


import detectEthereumProvider from '@metamask/detect-provider'

const GODWOKEN_RPC_URL = 'https://godwoken-testnet-web3-rpc.ckbapp.dev'
const polyjuiceConfig = {
  rollupTypeHash: '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
  ethAccountLockCodeHash: '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
  web3Url: GODWOKEN_RPC_URL
};

const ERC20_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
const SUDT_PROXY_CONTRACT_ADDRESS = '0x46d7068798124F5c7dBc6eC83f32b70893363dBC';


let web3
let account
let depositAddress

async function initWeb3() {
  const provider = await detectEthereumProvider();

  web3 = new Web3(
    new PolyjuiceHttpProvider(polyjuiceConfig.web3Url, polyjuiceConfig)
  )

  try {
    await provider.request({ method: 'eth_requestAccounts' })
    const accounts = await provider.request({ method: 'eth_accounts' })
    account = accounts[0]
  } catch (error) {
    throw error;
  }
}

async function init() {
  await initWeb3()
  $('#ethAddr').text(account)
  const balance = await web3.eth.getBalance(account)
  $('#ethBalance').text(BigInt(balance) / 10n ** 8n)


  const addressTranslator = new AddressTranslator();
  const polyAddr = addressTranslator.ethAddressToGodwokenShortAddress(account)
  $('#polyAddr').text(polyAddr)

  depositAddress = await addressTranslator.getLayer2DepositAddress(web3, account)
  $('#depositAddr').text(depositAddress.addressString)

  const token = new web3.eth.Contract(ERC20_ABI, SUDT_PROXY_CONTRACT_ADDRESS)
  const tokenBalance = await token.methods.balanceOf(polyAddr).call({from: account})
  $('#tokenAddr').text(SUDT_PROXY_CONTRACT_ADDRESS)
  $('#tokenBalance').text(tokenBalance)
}


async function render() {
}


init().then(() => {
})

