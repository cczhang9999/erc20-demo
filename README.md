# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```


[Running] node "/Users/zhanjun/Desktop/erc20-demo1/scripts/deploy.js"
MyToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

MyToken deployed to: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9


const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy(ethers.parseEther("1000000"));
    await token.waitForDeployment();
    console.log("MyToken deployed to:", await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

npx hardhat run scripts/interact.js --network localhost


使用本地服务器（如 npx http-server）运行，而不是直接打开 HTML 文件