import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import {
  DECIMALS,
  INITIAL_ANSWER,
  developmentChains,
} from '../helper-hardhat-config'

const deployMocks: DeployFunction = async ({
  deployments,
  getNamedAccounts,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId as unknown as string

  if (developmentChains.includes(network.name)) {
    log('Local network detected, deployment of mocks')
    await deploy('MockV3Aggregator', {
      contract: 'MockV3Aggregator',
      from: deployer,
      args: [DECIMALS, INITIAL_ANSWER],
      log: true,
    })
    log('Deployed MockV3Aggregator')
    log(
      '--------------------------------------------------------------------------------',
    )
  }
}

export default deployMocks
deployMocks.tags = ['all', 'mocks']
