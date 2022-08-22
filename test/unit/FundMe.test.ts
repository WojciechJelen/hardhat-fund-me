import { deployments, ethers, getNamedAccounts, network } from 'hardhat'
import { FundMe, MockV3Aggregator } from '../../typechain-types'
import { expect } from 'chai'

import { developmentChains } from '../../helper-hardhat-config'

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('FundMe', () => {
      let fundMe: FundMe
      let deployer: string
      let mockV3aggregator: MockV3Aggregator

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer

        await deployments.fixture(['all'])
        fundMe = await ethers.getContract('FundMe', deployer)
        mockV3aggregator = await ethers.getContract(
          'MockV3Aggregator',
          deployer,
        )
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
          const addressToAmountFunded = await fundMe.addressToAmountFunded(
            deployer,
          )
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

      describe('withdraw', async function () {
        beforeEach(async function () {
          const amount = ethers.utils.parseEther('0.1')
          await fundMe.fund({
            value: amount,
          })
        })
        it('gives a single funder all their ETH back', async function () {
          const startContractBalance = await fundMe.provider.getBalance(
            fundMe.address,
          )
          const deployerStartBalance = await fundMe.provider.getBalance(
            deployer,
          )

          const tx = await fundMe.withdraw()
          const { gasUsed, effectiveGasPrice } = await tx.wait()

          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endContractBalance = await fundMe.provider.getBalance(
            fundMe.address,
          )
          const deployerEndBalance = await fundMe.provider.getBalance(deployer)

          expect(endContractBalance.toString()).to.be.equal('0')
          expect(deployerEndBalance).to.be.equal(
            deployerStartBalance.add(startContractBalance).sub(gasCost),
          )

          // const totalDeployerBalanceAfterWithdraw =
          //   startContractBalance.add(deployerStartBalance)

          // const deployerEndBalanceWithGasCost = deployerEndBalance.add(gasCost)

          // expect(endContractBalance.toString()).to.be.equal('0')
          // expect(totalDeployerBalanceAfterWithdraw.toString()).to.be.equal(
          //   deployerEndBalanceWithGasCost.toString(),
          // )
        })
        it('Accept withdraw from multiple funders', async function () {
          const accounts = await ethers.getSigners()
          await fundMe
            .connect(accounts[1])
            .fund({ value: ethers.utils.parseEther('0.1') })
          await fundMe
            .connect(accounts[2])
            .fund({ value: ethers.utils.parseEther('0.1') })
          await fundMe
            .connect(accounts[3])
            .fund({ value: ethers.utils.parseEther('0.1') })
          await fundMe
            .connect(accounts[4])
            .fund({ value: ethers.utils.parseEther('0.1') })
          await fundMe
            .connect(accounts[5])
            .fund({ value: ethers.utils.parseEther('0.1') })

          const startContractBalance = await fundMe.provider.getBalance(
            fundMe.address,
          )
          const deployerStartBalance = await fundMe.provider.getBalance(
            deployer,
          )
          const tx = await fundMe.withdraw()
          const txRecipit = await tx.wait(1)
          const { gasUsed, effectiveGasPrice } = txRecipit
          const gasCost = gasUsed.mul(effectiveGasPrice)
          const endContractBalance = await fundMe.provider.getBalance(
            fundMe.address,
          )
          const deployerEndBalance = await fundMe.provider.getBalance(deployer)

          expect(endContractBalance.toString()).to.be.equal('0')
          expect(deployerEndBalance).to.be.equal(
            deployerStartBalance.add(startContractBalance).sub(gasCost),
          )
        })

        it('only owner can witdraw', async function () {
          const accounts = await ethers.getSigners()
          const contract = await fundMe.connect(accounts[1])
          await expect(contract.withdraw()).to.be.revertedWithCustomError(
            fundMe,
            'FundMe__NotOwner',
          )
        })
      })
    })
