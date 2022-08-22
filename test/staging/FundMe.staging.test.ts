import { deployments, ethers, getNamedAccounts, network } from 'hardhat'
import { FundMe, MockV3Aggregator } from '../../typechain-types'
import { expect } from 'chai'
import { developmentChains } from '../../helper-hardhat-config'
import { base58 } from 'ethers/lib/utils'

developmentChains.includes(network.name)
  ? describe.skip
  : describe('FundMe', async function () {
      let fundMe: FundMe
      let deployer: string
      const sendValue = ethers.utils.parseEther('0.1')

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract('FundMe', deployer)
      })

      it('Allows people to fund and withdraw', async function () {
        await fundMe.fund({ value: sendValue })
        await fundMe.withdraw()
        const endBalance = await fundMe.provider.getBalance(fundMe.address)
        expect(endBalance.toString()).equal('0')
      })
    })
