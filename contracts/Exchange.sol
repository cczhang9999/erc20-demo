// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./HobartToken.sol";

contract Exchange {
    // Fee account and percentage
    address public feeAccount;
    uint256 public feePercent;
    address constant ETHER = address(0);

    // Token balances: token address => user address => balance
    mapping(address => mapping(address => uint256)) public tokens;

    // Events
    event Deposit(address indexed token, address indexed user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint256 _feePercent) {
        require(_feeAccount != address(0), "Invalid fee account");
        require(_feePercent > 0, "Fee percent must be greater than zero");
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // Deposit Ether
    function depositEther() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        tokens[ETHER][msg.sender] += msg.value; // Safe in Solidity 0.8.0+
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    // Deposit tokens
    function depositToken(address _token, uint256 _amount) public returns (bool success) {
        require(_token != address(0), "Invalid token address");
        require(_token != ETHER, "Cannot deposit Ether as token");
        require(_amount > 0, "Deposit amount must be greater than zero");

        // Call transferFrom on the token contract
        bool transferSuccess = HobartToken(_token).transferFrom(msg.sender, address(this), _amount);
        require(transferSuccess, "Token transfer failed");

        tokens[_token][msg.sender] += _amount; // Safe in Solidity 0.8.0+
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
        return true;
    }
}