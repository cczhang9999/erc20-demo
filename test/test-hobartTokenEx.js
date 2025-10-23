const { ethers } = require("hardhat");

async function main() {
    const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
   //部署 ERC20 合约
    const [deployer] = await ethers.getSigners();
    const HobartToken = await ethers.getContractFactory("HobartToken");
     // 铸造代币 hobartToken 0x5FbDB2315678afecb367f032d93F642f64180aa3
    const hobartToken = await HobartToken.deploy();
    await hobartToken.waitForDeployment();
    console.log("HobartToken deployed to:", await hobartToken.getAddress());
    const Exchange = await ethers.getContractFactory("Exchange");
     // 铸造代币 Exchange 0x5FbDB2315678afecb367f032d93F642f64180aa3
    const exchange = await Exchange.deploy("0x70997970C51812dc3A010C7d01b50e0d17dc79C8",10);
    await exchange.waitForDeployment();
    console.log("Exchange deployed to:", await exchange.getAddress());
    // 查询部署者余额
    const balance = await hobartToken.balanceOf(deployer.address);
    console.log("Deployer's balance:", ethers.formatEther(balance), "HBT");
    console.log("Deployer's deployer.address:", deployer.address);

     const amount = ethers.parseEther("100"); 
    // await exchange.depositEther({
    
    //    from:deployer.address,
    //     value:amount
    // })

    // let res = await exchange.tokens(ETHER_ADDRESS,deployer.address);
    // console.log("exchange.tokens=",ethers.formatEther(res));   
     
    //授权
    await hobartToken.approve(exchange.getAddress(),ethers.parseEther("100000"),{
        from:deployer.address
    });
    await exchange.depositToken(hobartToken.getAddress(),ethers.parseEther("100000"),{
        from:deployer.address
    });
    let res = await exchange.tokens(hobartToken.getAddress(),deployer.address);
    console.log("exchange.tokens=",ethers.formatEther(res));   
     
}

main().catch((error) => {
    console.error("Error:", error);
    process.exitCode = 1;
});