const { ethers, run, network } = require("hardhat");
// yarn add @chainlink/contracts
async function main() {
  const fundMeFactory = await ethers.getContractFactory("WobbleStore");
  console.log("Deploying contract");
  const fundMe = await fundMeFactory.deploy();
  await fundMe.waitForDeployment();
  console.log(`Deployed to: ${await fundMe.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
