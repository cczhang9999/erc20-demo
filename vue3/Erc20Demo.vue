<template>
    <div style="max-width: 700px; margin: 0 auto;">
      <h2>ERC20 Demo (前端全流程)</h2>
      <div>
        <button @click="connectWallet">{{ account ? '已连接: ' + account : '连接钱包' }}</button>
      </div>
      <div style="margin-top: 20px;">
        <label>合约地址: </label>
        <input v-model="contractAddress" style="width: 350px;" />
        <button @click="loadContract">加载合约</button>
        <button @click="deployContract">部署新合约</button>
      </div>
      <div v-if="contract">
        <div style="margin-top: 20px;">
          <div>我的余额: {{ balance }} TTK</div>
          <div>总供应量: {{ totalSupply }} TTK</div>
        </div>
        <div style="margin-top: 20px;">
          <label>转账地址: </label>
          <input v-model="transferTo" style="width: 350px;" />
          <label>数量: </label>
          <input v-model="transferAmount" type="number" style="width: 100px;" />
          <button @click="transfer">转账</button>
        </div>
        <div style="margin-top: 20px;">
          <h4>历史转账事件</h4>
          <ul>
            <li v-for="(event, idx) in transferEvents" :key="idx">
              from: {{ event.from }} to: {{ event.to }} amount: {{ event.amount }}
            </li>
          </ul>
        </div>
      </div>
      <div v-if="txHash" style="margin-top: 20px;">
        <b>最近交易哈希:</b> {{ txHash }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ethers } from 'ethers'
  
  // 1. 复制 MyToken 的 ABI 和 bytecode
  const abi = [
    "function balanceOf(address) view returns (uint256)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ]
  // 2. 复制 MyToken 的 bytecode
  const bytecode = "YOUR_CONTRACT_BYTECODE_HERE" // <-- 这里替换为真实字节码
  
  const account = ref('')
  const contractAddress = ref('')
  const contract = ref(null)
  const balance = ref('0')
  const totalSupply = ref('0')
  const transferTo = ref('')
  const transferAmount = ref('')
  const transferEvents = ref([])
  const txHash = ref('')
  
  let provider, signer
  
  async function connectWallet() {
    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      signer = await provider.getSigner()
      account.value = await signer.getAddress()
    } else {
      alert('请安装 MetaMask')
    }
  }
  
  async function deployContract() {
    if (!signer) await connectWallet()
    const factory = new ethers.ContractFactory(abi, bytecode, signer)
    const contractInstance = await factory.deploy(ethers.parseEther("1000000"))
    await contractInstance.waitForDeployment()
    contractAddress.value = await contractInstance.getAddress()
    contract.value = contractInstance
    listenTransfer()
    await refreshInfo()
    await queryHistory()
    alert('合约已部署: ' + contractAddress.value)
  }
  
  async function loadContract() {
    if (!signer) await connectWallet()
    contract.value = new ethers.Contract(contractAddress.value, abi, signer)
    listenTransfer()
    await refreshInfo()
    await queryHistory()
  }
  
  async function refreshInfo() {
    if (!contract.value || !account.value) return
    const bal = await contract.value.balanceOf(account.value)
    balance.value = ethers.formatEther(bal)
    const supply = await contract.value.totalSupply()
    totalSupply.value = ethers.formatEther(supply)
  }
  
  async function transfer() {
    if (!contract.value) return
    const tx = await contract.value.transfer(transferTo.value, ethers.parseEther(transferAmount.value))
    await tx.wait()
    txHash.value = tx.hash
    await refreshInfo()
    await queryHistory()
  }
  
  function listenTransfer() {
    if (!contract.value) return
    contract.value.on('Transfer', (from, to, amount) => {
      transferEvents.value.unshift({
        from,
        to,
        amount: ethers.formatEther(amount)
      })
    })
  }
  
  async function queryHistory() {
    if (!contract.value) return
    // 查询历史 Transfer 事件
    const filter = contract.value.filters.Transfer()
    const events = await contract.value.queryFilter(filter, 0, "latest")
    transferEvents.value = events.map(e => ({
      from: e.args.from,
      to: e.args.to,
      amount: ethers.formatEther(e.args.value)
    })).reverse()
  }
  </script>