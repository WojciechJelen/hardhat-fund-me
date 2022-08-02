import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-solhint'
import 'hardhat-deploy'

const config: HardhatUserConfig = {
    solidity: '0.8.9',
}

export default config
