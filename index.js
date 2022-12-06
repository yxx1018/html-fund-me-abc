import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (window.ethereum !== "undefined") {
        console.log("I see a metamask!")
        //请求钱包连接这个网站
        await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML = "Please install metamask!"
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (window.ethereum !== "undefined") {
        //provider / connection to the blockchain
        //siger / wallet /someone with some gas
        //contract that we are interacting with
        //^ ABI & Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(provider)
        console.log(signer.provider.provider.selectedAddress)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

async function withdraw() {
    console.log(`Withdrawing...`)
    if (window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(provider)
        console.log(signer.provider.provider.selectedAddress)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(transactionResponse)
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

//虽然是调用listener函数，但也不用加()
// function listenForTransactionMine(transactionResponse, provider) {
//     console.log(transactionResponse)
//     console.log(`Mining ${transactionResponse.hash}...`)
//     return new Promise((resolve, reject) => {
//         provider.once(transactionResponse.hash, listener)
//         function listener(transactionReceipt) {
//             console.log(
//                 `Completed with ${transactionReceipt.confirmations} confirmations`
//             )
//             resolve()
//         }
//     })
// }

async function getBalance() {
    if (window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(balance)
        console.log(balance.toString())
        console.log(ethers.utils.formatUnits(balance))
    }
}
