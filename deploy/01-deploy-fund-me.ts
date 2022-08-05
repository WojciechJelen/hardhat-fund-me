import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import {
  developmentChains,
  networkConfig,
  NetworkIdsType,
} from '../helper-hardhat-config'
import { verifyContract } from '../utils/verify'

const deployFundMe: DeployFunction = async ({
  deployments,
  getNamedAccounts,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId: number = network.config.chainId!
  log('Deploying fund-me...', { deployer, chainId })

  let ethUsdPriceFeedAddress: string
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get('MockV3Aggregator')
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress =
      networkConfig[chainId as NetworkIdsType].ethUsdPriceFeed
  }

  const args = [ethUsdPriceFeedAddress]

  const fundMe = await deploy('FundMe', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 6,
  })

  log(
    '--------------------------------------------------------------------------------',
  )

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verifyContract(fundMe.address, args)
    log('FundMe verified')
  }
}

export default deployFundMe
deployFundMe.tags = ['all', 'fund-me']
