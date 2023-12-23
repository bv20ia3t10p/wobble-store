require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: "https://rpc2.sepolia.org",
      chainId: 11155111,
      accounts: [
        "1c25f86aab010891abc42aec4a0f537bbfaac228e9f24b867c452393fef3ba75",
      ],
    },
  },
};
