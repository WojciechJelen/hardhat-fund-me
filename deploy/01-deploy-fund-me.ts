import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async ({
  deployments,
  getNamedAccounts,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  console.log('Deploying fund-me...', { deployer, chainId })
}

export default deploy
