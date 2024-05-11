
import {ethers} from './ethers-5.6.esm.min.js';

const connectButton = document.getElementById('connectButton')
connectButton.onclick = connect

const createtxn = document.getElementById('createTxnButton')
createtxn.onclick = createTransaction

const signTxn = document.getElementById('signTxnButton')
signTxn.onclick = signTransaction





const provider = new ethers.providers.JsonRpcProvider('https://dymension-evm.blockpi.network/v1/rpc/public')



async function connect() {
    let userAddress
    
    if (typeof window.ethereum !== 'undefined') {
        try {

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
           
        
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${(1100).toString(16)}`}]
              });
              
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = userAddress
    
    } else {
        connectButton.innerHTML = 'Install Metamask !!!!'
    }


}


  
      


async function createTransaction() {
    const  receiverAddress = document.getElementById('toAddress').value
    const amt = document.getElementById('amountETH').value
    const addressToSign = document.getElementById('signAddress').value
   

    try {
        let to_address = receiverAddress
        let amount = ethers.utils.parseEther(amt.toString())
        let nonce =  await provider.getTransactionCount(addressToSign,"latest")
        console.log(`nonce : ${nonce}`)
        let gasPrice =    await provider.getGasPrice()
        let gasLimit = 250000

        const tx = {
            nonce:nonce,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            to: to_address,
            value: amount
        }

        
        const serialize = ethers.utils.serializeTransaction(tx)
        console.log(serialize)
        const serializedTxElement = document.getElementById('serializedTx');
        serializedTxElement.textContent = serialize;
    
    } catch (error) {
        console.error('Error Creating  transaction:', error);
    
    } 
}

async function signTransaction(){

const serialize = document.getElementById('txnByte').value
console.log(1)
console.log(serialize)

    if(window.ethereum != 'undefined'){

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner(accounts[0]);
        const decodedTx = ethers.utils.parseTransaction(serialize);

        try {
            const signedTx = await signer.sendTransaction(decodedTx);

  const txnHash = signedTx.hash;
    console.log('Transaction Hash:', txnHash);


    const etherscanUrl = `https://sepolia.etherscan.io/tx/${txnHash}`;
    console.log(' Check out your txn Etherscan URL:', etherscanUrl)

    window.location.href = etherscanUrl;

    // Trigger the function on a user action
    openEtherscanPage();

            
        } catch (error) {
            console.log(error)
            window.alert( ' Pass In the right transaction')
        }



  

    }

}

