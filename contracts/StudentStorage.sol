// SPDX-License-Identifier: MIT
//源码遵循协议，MIT
pragma solidity >=0.4.22 <0.9.0;

contract StudentStorage {

    uint age;
    string name;

    function setDate(string memory _name,uint _age) public {
        name = _name;
        age = _age;
    }

    function getDate() public view returns(string memory,uint){
        return (name,age);
    }

}