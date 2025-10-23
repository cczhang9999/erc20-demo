const { ethers } = require("hardhat");

async function main() {
  const [deployer, user] = await ethers.getSigners();


  // 1. 部署 ERC20 合约
    const MyToken = await ethers.getContractFactory("MyToken");
     // 2.铸造代币
    const token = await MyToken.deploy(ethers.parseEther("1000000"));
    await token.waitForDeployment();
    console.log("MyToken deployed to:", await token.getAddress());




  // 3. 查询余额
  let balance = await myToken.balanceOf(user.address);
  console.log("User balance:", balance.toString());

  // 4. 查询总供应量
  let supply = await myToken.totalSupply();
  console.log("Total supply:", supply.toString());

  const filter = myToken.filters.Transfer();

  const events = await myToken.queryFilter(filter, 0, "latest");
  for (const e of events) {
    console.log(`Transfer: from ${e.args.from} to ${e.args.to} value ${e.args.value.toString()}`);
  }

  // 5. 转账代币
  console.log('\n💸 转账代币...');
  const recipientAddress = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'; // 替换为实际地址
  const transferAmount = ethers.parseEther('100'); // 转账 100 个代币

  const transferTx = await myToken.transfer(recipientAddress, transferAmount);
  await transferTx.wait();
  console.log('✅ 转账成功，交易哈希:', transferTx.hash);

  // 6. 检查转账后余额
  const newBalance = await myToken.balanceOf("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  console.log('💰 转账后余额:', ethers.formatEther(newBalance), 'TTK');

  // 7. 监听转账事件
  console.log('\n👂 监听转账事件...');
  myToken.on('Transfer', (from, to, amount) => {
    console.log('📡 转账事件:', {
      from: from,
      to: to,
      amount: ethers.formatEther(amount)
    });
  });


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});