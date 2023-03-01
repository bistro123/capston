import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TradeContract from "./contracts/Capstone.json";

const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x0b163c2BB185220675bf1a630482ecF21aCC6897";
const tradeContract = new web3.eth.Contract(TradeContract.abi, contractAddress);

const App = () => {
  const [tradeid, setTradeid] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [status, setStatus] = useState("");
  const [trade, setTrade] = useState(null);
  const [tradeList, setTradeList] = useState([]);

  const addTrade = async () => {
    const accounts = await window.ethereum.enable();
    const sender = accounts[0];
    await tradeContract.methods
      .addTrade(tradeid, sender, receiverAddress, amount, timestamp)
      .send({ from: sender });
    setTradeid("");
    setSenderAddress("");
    setReceiverAddress("");
    setAmount("");
    setTimestamp("");
    setStatus("");
    getTradeList();
  };

  const getTrade = async () => {
    const trade = await tradeContract.methods.getTradeData(tradeid).call();
    setTrade(trade);
  };

  const updateTradeStatus = async () => {
    const accounts = await window.ethereum.enable();
    const sender = accounts[0];
    await tradeContract.methods
      .updateStatus(tradeid, status)
      .send({ from: sender });
    setTrade(null);
    setStatus("");
    getTradeList();
  };

  const getTradeList = async () => {
    const tradeCount = await tradeContract.methods.tradecounter().call();
    const trades = [];
    for (let i = 0; i < tradeCount; i++) {
      const trig = await tradeContract.methods.getTradeList().call();
      const trade = await tradeContract.methods.trades(trig[i]).call();
      trades.push(trade);
    }
    setTradeList(trades);
  };

  return (
    <div>
      <h1>Trade dApp</h1>
      <h2>Add Trade</h2>
      <label>
        Trade ID:
        <input type="text" value={tradeid} onChange={(e) => setTradeid(e.target.value)} />
      </label>
      <br />
      <label>
        Sender Address:
        <input type="text" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} />
      </label>
      <br />
      <label>
        Receiver Address:
        <input type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} />
      </label>
      <br />
      <label>
        Amount:
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
      <br />
      <label>
        Timestamp:
        <input type="text" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
      </label>
      <br />
      <button onClick={addTrade}>Add Trade</button>
      <hr />
      <h2>Get Trade Details</h2>
      <label>Trade ID:
        <input type="text" value={tradeid} onChange={(e) => setTradeid(e.target.value)} />
        </label>
<br />
<button onClick={getTrade}>Get Trade</button>
{trade && (
<>
<p>
Trade ID: {tradeid}
<br />
Sender Address: {trade[1]}
<br />
Receiver Address: {trade[2]}
<br />
Amount: {trade[3]}
<br />
Timestamp: {trade[4]}
<br />
Status: {trade[0]}
</p>
<label>
Status:
<select value={status} onChange={(e) => setStatus(e.target.value)}>
<option value=""></option>
<option value="successful">Successful</option>
<option value="unsuccessful">Unsuccessful</option>
</select>
</label>
<button onClick={updateTradeStatus}>Update Trade Status</button>
</>
)}
<hr />
<h2>List of Trades</h2>
<button onClick={getTradeList}>Refresh Trade List</button>

{tradeList.map((trade, index) => (
<p key={index}>
Trade ID: {trade[0]}
<br />
Sender Address: {trade[1]}
<br />
Receiver Address: {trade[2]}
<br />
Amount: {trade[3]}
<br />
Timestamp: {trade[4]}
<br />
Status: {trade[5]}
</p>

))}
</div>
);
};

export default App;