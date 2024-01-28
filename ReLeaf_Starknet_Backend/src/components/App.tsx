'use client';
import './App.css'
import { useState, useMemo } from "react"
import { connect, disconnect } from "get-starknet"
import { Contract, Provider, SequencerProvider, constants } from "starknet"

const contractAddress = "0x0339600ac04a194951dcf2e68d99f47d0df3c11d482b0ef0e6c1a0fae149c2ff"
// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);

// Get the value of the 'data' parameter
const receivedData = urlParams.get('data');
var value = "123"
var new_title = "Hello"

// Check if receivedData is not null before using it
if (receivedData !== null) {
  // Decode the received data if needed
  const decodedData = decodeURIComponent(receivedData);

  // Use the decodedData as needed
  const [title, recipientKey] = decodedData.split('+');
  value = recipientKey;
  new_title = title

  // Use the variables as needed
  console.log('Title:', title.trim());
  console.log('Recipient Key:', recipientKey.trim());
} else {
  // Handle the case where 'data' parameter is not present in the URL
  console.error("Data parameter not found in the URL");
}console.log(localStorage.getItem("valuee"));



function App() {
  const [provider, setProvider] = useState({} as Provider)
  const [address, setAddress] = useState('')
  const [currentBlockHash, setCurrentBlockHash] = useState('')
  const [balance, setBalance] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [recipient, setRecipient] = useState(value);
  const [amount, setAmount] = useState('1000');

  const disconnectWallet = async () => {
    try {
      await disconnect({ clearLastWallet: true })
      setProvider({} as Provider)
      setAddress('')
      setIsConnected(false)
    }
    catch (error: any) {
      alert(error.message)
    }
  }

  const connectWallet = async () => {
    try {
      const starknet = await connect()
      if (!starknet) throw new Error("Failed to connect to wallet.")
      await starknet.enable({ starknetVersion: "v5" })
      setProvider(starknet.account)
      setAddress(starknet.selectedAddress || '')
      setIsConnected(true)
    }
    catch (error: any) {
      alert(error.message)
    }
  }





  const checkBalance = async () => {
    try {
      // initialize contract using abi, address and provider
      const { abi: testAbi } = await provider.getClassAt(contractAddress);
      if (testAbi === undefined) { throw new Error("no abi.") };
      const contract = new Contract(testAbi, contractAddress, provider)
      // make contract call
      const data = await contract.balance_of(address)
      setBalance(data.toString())
      const retrievedValue: string | null = localStorage.getItem("valuee");
      // Check if the item exists before using it
      if (retrievedValue !== null) {
        // Use the retrieved value as needed
        console.log(retrievedValue);
      } else {
        console.log("Item 'valuee' not found in local storage.");
      }
    }
    catch (error: any) {
      alert(error.message)
    }
  }

  const transfer = async () => {
    try {
      // initialize contract using abi, address and provider
      const { abi: testAbi } = await provider.getClassAt(contractAddress);
      if (testAbi === undefined) { throw new Error("no abi.") };
      const contract = new Contract(testAbi, contractAddress, provider)
      // make contract call
      await contract.transfer(recipient, amount)
      alert("Payment was Successful!")

    }
    catch (error: any) {
      alert("Payment was aborted!")
    }
  }

  const current_block_hash = async () => {
    try {
      const provider1 = new SequencerProvider({ baseUrl: constants.BaseUrl.SN_GOERLI });

      const block = await provider1.getBlock("latest"); // <- Get latest block
      setCurrentBlockHash(block.block_hash);
    }
    catch (error: any) {
      alert(error.message)
    }
  }

  current_block_hash()

  const shortenedAddress = useMemo(() => {
    if (!isConnected) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [isConnected, address])

  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(event.target.value);
  };

  return (
    <div className="app-container">
      <h1 >{new_title}</h1>
      <div className="wallet-info">
        {isConnected ? (
          <div>
            <p className="connected-text">Connected: {shortenedAddress}</p>
            <button className="disconnect-button" onClick={disconnectWallet}>
              Disconnect
            </button>
            <hr />
            <div className="balance-section">
              <p>Wallet Balance (in RLC):</p>
              <p className="Wallet Balance (in RLC)">{balance}</p>
              <button className="check-balance-button" onClick={checkBalance}>
                Check Balance
              </button>
            </div>
            <hr />
            <div className="transfer-section">
              <p>Transfer:</p>
              <label htmlFor="recipient">Recipient:</label>
              <input
                id="recipient"
                type="text"
                value={recipient}
                readOnly
                onChange={handleRecipientChange}
              />
              <label htmlFor="amount">Amount to Donate (in RLC)</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
              />
              <button className="transfer-button" onClick={transfer}>
                Transfer
              </button>
            </div>
            <hr />
          </div>
        ) : (
          <div>
            <p className="choose-wallet-text">Choose a wallet:</p>
            <button className="connect-wallet-button" onClick={connectWallet}>
              Connect a Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;