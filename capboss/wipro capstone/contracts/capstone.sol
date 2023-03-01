pragma solidity ^0.8.0;

contract Capstone {
    struct TradeData {
        string tradeid;
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
        string status;
    }
   

    mapping(string => TradeData) public trades;
    string[] public tradeIds;

    function addTrade(string memory tradeid, address sender, address receiver, uint256 amount, uint256 timestamp) public {
        TradeData memory newTrade = TradeData(tradeid,sender, receiver, amount, timestamp, "Initiated");
        trades[tradeid] = newTrade;
        tradeIds.push(tradeid);
    }
    function tradecounter() public view returns(uint)
    {
        return tradeIds.length;
    }

    function getTradeData(string memory tradeid) public view returns (string memory, address,address, uint256, uint256,string memory) {
        TradeData memory trade = trades[tradeid];
        return (trade.status, trade.sender, trade.receiver, trade.amount, trade.timestamp,trade.tradeid);
    }

    function updateStatus(string memory tradeid, string memory newStatus) public {
        TradeData storage trade = trades[tradeid];
        trade.status = newStatus;
    }
    function getTradeList() public view returns (string[] memory) {
        return tradeIds;
    }
}
