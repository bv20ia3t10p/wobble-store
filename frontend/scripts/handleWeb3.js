import { ethers, BigNumber } from "./ethers-5.1.esm.min.js";

export const connect = async () => {
  if (typeof window.ethereum) {
    window.ethereum.request({ method: "eth_requestAccounts" });
  } else {
    console.log("No metamask");
  }
};

export const fund = async (loadedOrder) => {
  console.log(`Processing payment...`);
  //Currently taking 0.0001 eth for 1 usd
  const roundedTotal = Math.round(loadedOrder.total * 1000) / 1000;
  const ethAmount = roundedTotal * 0.0001;
  const ethAmountConverted = ethers.utils.parseEther(String(ethAmount));
  console.log(ethAmount);
  if (typeof window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const transactionResponse = await contract.pay(
        String(loadedOrder.orderId),
        ethAmountConverted,
        loadedOrder.orderDate,
        ethAmountConverted,
        { value: ethAmountConverted, gasLimit: 5000000 }
      );
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  } else {
    // fundButton.innerHTML = 'Please install MetaMask'
  }
};

const listenForTransactionMine = (transactionResponse, provider) => {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (txReceipt) => {
      console.log(`Complete with ${txReceipt.confirmations}`);
      resolve();
    });
  });
};

const contractAddress = "0x5b519C215cB4a15eA5e91f760C6E08710e21Bd5D";

const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "NotOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "addressToAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "orders",
    outputs: [
      {
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "customer",
        type: "address",
      },
      {
        internalType: "string",
        name: "orderDate",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "paidEth",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalInEth",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "orderDate",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "totalInEth",
        type: "uint256",
      },
    ],
    name: "pay",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
