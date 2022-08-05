import { deployments, ethers, getNamedAccounts } from 'hardhat'
import { FundMe, MockV3Aggregator } from '../../typechain-types'
import { expect } from 'chai'

describe('FundMe', () => {
  let fundMe: FundMe
  let deployer: string
  let mockV3aggregator: MockV3Aggregator

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(['all'])
    fundMe = await ethers.getContract('FundMe', deployer)
    mockV3aggregator = await ethers.getContract('MockV3Aggregator', deployer)
  })
  describe('constructor', async function () {
    it('sets the aggregator correctly', async function () {
      const res = await fundMe.priceFeed()
      expect(res).to.equal(mockV3aggregator.address)
    })
  })
})
