pragma solidity ^0.8.8;

error NotOwner();

contract WobbleStore {
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    struct Orders {
        uint256 orderId;
        address customer;
        string orderDate;
        uint256 total;
        uint256 paidEth;
        uint256 totalInEth;
    }

    Orders[] public orders;

    mapping(address => uint256) public addressToAmount;

    function getOwner() public view returns (address) {
        return owner;
    }

    function pay(
        uint256 orderId,
        uint256 total,
        string memory orderDate,
        uint256 totalInEth
    ) public payable {
        msg.value;
        orders.push(
            Orders(orderId, msg.sender, orderDate, total, msg.value, totalInEth)
        );
    }

    function withdraw() public onlyOnwer {
        payable(msg.sender).transfer(address(this).balance);
        (bool callSuccess, bytes memory data) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    modifier onlyOnwer() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }
}
