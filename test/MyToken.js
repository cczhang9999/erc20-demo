const { expect } = require("chai");

describe("MyToken", function () {
  it("Should assign the total supply to the owner", async function () {
    const [owner] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy(ethers.utils.parseEther("1000"));
    await token.deployed();

    expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1000"));
  });
});