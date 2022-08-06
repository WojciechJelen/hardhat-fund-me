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

  describe('fund', async function () {
    it('Fails if you dont send enought ETH', async function () {
      const amount = ethers.utils.parseEther('0.1')
      await expect(fundMe.fund()).to.be.revertedWith(
        'You need to spend more ETH!',
      )
    })

    it('Funds the contract if you send enought ETH', async function () {
      const amount = ethers.utils.parseEther('0.1')
      await expect(
        fundMe.fund({
          value: amount,
        }),
      ).to.be.fulfilled
    })

    it('Updates addressToAmountFunded properly', async function () {
      const amountSent = ethers.utils.parseEther('0.1')
      await fundMe.fund({
        value: amountSent,
      })
      const addressToAmountFunded = await fundMe.addressToAmountFunded(deployer)
      expect(addressToAmountFunded.toString()).to.be.equal(
        amountSent.toString(),
      )
    })

    it('Adds funders to funders array', async function () {
      const amountSent = ethers.utils.parseEther('0.1')
      await fundMe.fund({
        value: amountSent,
      })
      const funder = await fundMe.funders(0)
      expect(funder).to.be.equal(deployer)
    })
  })
})
