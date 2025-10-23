// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HobartToken {
    string public name = "HobartToken";
    string public symbol = "HBT";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    // 定义 Transfer 事件（ERC20 标准）
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed _owner, address indexed _spender, uint256 value);

    constructor() {
        totalSupply = 1000000 * (10 ** decimals); // 1,000,000 代币
        balanceOf[msg.sender] = totalSupply; // 初始代币分配给部署者
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        // 检查输入参数
        require(_to != address(0), "Invalid address: cannot transfer to zero address");
        require(_value > 0, "Invalid amount: must be greater than zero");
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");

        // 更新余额
        balanceOf[msg.sender] -= _value; // 直接减法，Solidity 0.8.0+ 防止溢出
        balanceOf[_to] += _value; // 直接加法

        // 触发 Transfer 事件
        emit Transfer(msg.sender, _to, _value);

        return true; // 显式返回 true 表示成功
    }

    function approve(address _spender,uint256 _value) public returns (bool success) {

        require(_spender != address(0), "Invalid address: cannot transfer to zero address");
        require(_value > 0, "Invalid amount: must be greater than zero");
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true; // 显式返回 true 表示成功

    }

    //被授权的交易所调用
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
         require(_to != address(0), "Invalid address: cannot transfer to zero address");
        require(_value > 0, "Invalid amount: must be greater than zero");
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value; // Use direct subtraction (Solidity 0.8.0+ safe)

        emit Transfer(_from, _to, _value);
        return true;
    }

}