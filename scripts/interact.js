const { ethers } = require("hardhat");

async function main() {
  const [deployer, user] = await ethers.getSigners();
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");


  // 1. 铸币


  // 2. 查询余额
  let balance = await myToken.balanceOf(user.address);
  console.log("User balance:", balance.toString());

  // 3. 查询总供应量
  let supply = await myToken.totalSupply();
  console.log("Total supply:", supply.toString());

  const filter = myToken.filters.Transfer();

  const events = await myToken.queryFilter(filter, 0, "latest");
  for (const e of events) {
    console.log(`Transfer: from ${e.args.from} to ${e.args.to} value ${e.args.value.toString()}`);
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});