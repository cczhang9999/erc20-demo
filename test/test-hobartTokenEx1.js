const { ethers } = require("hardhat");

async function main() {
    const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
    // Deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);

    // Deploy HobartToken
    const HobartToken = await ethers.getContractFactory("HobartToken");
    const hobartToken = await HobartToken.deploy();
    await hobartToken.waitForDeployment();
    const tokenAddress = await hobartToken.getAddress();
    console.log("HobartToken deployed to:", tokenAddress);

    // Deploy Exchange
    const Exchange = await ethers.getContractFactory("Exchange");
    const exchange = await Exchange.deploy("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 10);
    await exchange.waitForDeployment();
    const exchangeAddress = await exchange.getAddress();
    console.log("Exchange deployed to:", exchangeAddress);

    // Check deployer's HBT balance
    const balance = await hobartToken.balanceOf(deployer.address);
    console.log("Deployer's HBT balance:", ethers.formatEther(balance), "HBT");

    // Approve and deposit 100,000 HBT
    const amount = ethers.parseEther("100000"); // Use parseEther instead of toWei
    const approveTx = await hobartToken.approve(exchangeAddress, amount);
    await approveTx.wait();
    console.log(`Approved ${ethers.formatEther(amount)} HBT for Exchange`);

    const depositTx = await exchange.depositToken(tokenAddress, amount);
    await depositTx.wait();
    console.log(`Deposited ${ethers.formatEther(amount)} HBT to Exchange`);

    // Check Ether balance in Exchange
    const etherBalance = await exchange.tokens(ETHER_ADDRESS, deployer.address);
    console.log("Exchange ETH balance:", ethers.formatEther(etherBalance));

    // Optional: Deposit Ether
    const etherAmount = ethers.parseEther("1"); // 1 ETH
    const etherDepositTx = await exchange.depositEther({ value: etherAmount });
    await etherDepositTx.wait();
    console.log(`Deposited ${ethers.formatEther(etherAmount)} ETH to Exchange`);

    // Check updated Ether balance
    const updatedEtherBalance = await exchange.tokens(ETHER_ADDRESS, deployer.address);
    console.log("Exchange ETH balance after deposit:", ethers.formatEther(updatedEtherBalance));
}

main().catch((error) => {
    console.error("Error:", error);
    process.exitCode = 1;
});