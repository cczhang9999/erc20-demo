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