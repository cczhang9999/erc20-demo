const { ethers } = require("hardhat");

async function main() {
   //部署 ERC20 合约
    const [deployer] = await ethers.getSigners();
    deployer
    const MyToken = await ethers.getContractFactory("HobartToken");
     // 铸造代币 0x5FbDB2315678afecb367f032d93F642f64180aa3
    const token = await MyToken.deploy();
    await token.waitForDeployment();
    console.log("MyToken deployed to:", await token.getAddress());

    // 查询部署者余额
    const balance = await token.balanceOf(deployer.address);
  
    console.log("Deployer's balance:", ethers.formatEther(balance), "HBT");
     console.log("Deployer's deployer.address:", deployer.address);



    // Assuming token is a deployed contract instance
const amount = ethers.parseEther("1000"); // Convert 100000 ETH to Wei
await token.transfer("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount);

const balance1 = await token.balanceOf("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
console.log("Recipient's balance:", ethers.formatEther(balance1), "HBT");


     const balance2 = await token.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    console.log("Deployer's balance:", ethers.formatEther(balance2), "HBT");

     
}

main().catch((error) => {
    console.error("Error:", error);
    process.exitCode = 1;
});