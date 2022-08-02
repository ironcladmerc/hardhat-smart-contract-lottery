require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const BSCTEST_PRIVATE_KEY = process.env.BSCTEST_PRIVATE_KEY
const BSCTEST_RPC_URL = process.env.BSCTEST_RPC_URL
const LOCALHOST_PRIVATE_KEY = process.env.LOCALHOST_PRIVATE_KEY
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.9",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [RINKEBY_PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6,
        },
        bscTestnet: {
            url: BSCTEST_RPC_URL,
            accounts: [BSCTEST_PRIVATE_KEY],
            chainId: 97,
            blockConfirmations: 6,
        },
        localhost: {
            url: LOCALHOST_RPC_URL,
            accounts: [LOCALHOST_PRIVATE_KEY],
            chainId: 31337,
            blockConfirmations: 1,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        player: {
            default: 1,
        },
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            rinkeby: ETHERSCAN_API_KEY,
            bscTestnet: BSCSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    contractSizer: {
        runOnCompile: false,
        only: ["Raffle"],
    },
    mocha: {
        timeout: 500000,
    },
}
