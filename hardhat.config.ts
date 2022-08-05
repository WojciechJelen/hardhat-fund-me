import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-solhint'
import 'hardhat-deploy'
import 'dotenv/config'

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || 'http://localhost:8545'
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0x'
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ''
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: 'gas-reporter.txt',
    noColors: true,
    currency: 'USD',
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: '0.6.0',
      },
      {
        version: '0.8.0',
      },
      {
        version: '0.8.9',
      },
    ],
  },
}

export default config
