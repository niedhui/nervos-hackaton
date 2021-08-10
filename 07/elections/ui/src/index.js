import $ from 'jquery'
import {ethers, providers, utils} from "ethers"

import { PolyjuiceWallet, PolyjuiceConfig } from '@polyjuice-provider/ethers'
import { PolyjuiceHttpProvider } from "@polyjuice-provider/web3";
import { AddressTranslator } from 'nervos-godwoken-integration';


import detectEthereumProvider from '@metamask/detect-provider';

const GODWOKEN_RPC_URL = 'https://godwoken-testnet-web3-rpc.ckbapp.dev';
const polyjuiceConfig = {
  rollupTypeHash: '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
  ethAccountLockCodeHash: '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
  web3Url: GODWOKEN_RPC_URL
};

const CONTRACT_ADDR = '0x58B77BFAD838879f1CbeFc53f035783fCd8b5bab'
const ABI = [
  "function candidatesCount() view returns (uint)",
  "function candidates(uint id) view returns (uint, string, uint)",
  "function vote(uint id) external",
]
let contract


async function getSigner() {
  const provider = await detectEthereumProvider();

  const web3Provider = new providers.Web3Provider(
    new PolyjuiceHttpProvider(polyjuiceConfig.web3Url, polyjuiceConfig)
  );
  let signer;

  try {
    await provider.request({ method: 'eth_requestAccounts' });
    signer = web3Provider.getSigner(provider.selectedAddress);
  } catch (error) {
    throw error;
  }
  return signer;

}

async function init() {
  contract = new ethers.Contract(CONTRACT_ADDR, ABI, await getSigner())
  const ethAddr = await contract.signer.getAddress()
  $('#contractAddr').text(contract.address)
  $('#ethAddr').text(ethAddr)
  const addressTranslator = new AddressTranslator();
  $('#polyAddr').text(addressTranslator.ethAddressToGodwokenShortAddress(ethAddr))
  render()
}

async function render() {
  var loader = $("#loader");
  var content = $("#content");

  loader.show();
  content.hide();

  const num = await contract.candidatesCount()

  var candidatesResults = $("#candidatesResults");
  candidatesResults.empty();

  for (var i = 0; i < num; i++) {
    const [id, name, votes] = await contract.candidates(i)
    var candidateTemplate = `<tr><th>${id}</th><td>${name}</td><td>${votes}</td><td><button onclick='vote(${id})' class='btn btn-primary'>Vote</button></td></tr>`
    candidatesResults.append(candidateTemplate);
  }

  loader.hide();
  content.show();
}

async function vote(id) {
  try {
    const tx = await contract.vote(id, {gasLimit: 6000000,gasPrice: 0x0,value: 0x0 })
    console.log(`tx ${tx}`)
    await render()
  } catch (e) {
    console.log(e)
  }
}



init().then(() => {
  window.vote = vote
})

