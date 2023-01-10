const { assert, expect } = require('chai')
const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')

describe('FundMe', function () {
    let fundMe
    let mockV3Aggregator
    let deployer
    const sendValue = ethers.utils.parseEther('1')

    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(['all'])
        fundMe = await ethers.getContract('FundMe', deployer)
        mockV3Aggregator = await ethers.getContract(
            'MockV3Aggregator',
            deployer
        )
    })

    describe('constructor', function () {
        it('sets the aggregator addresses correctly', async () => {
            const response = await fundMe.getsPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe('fund', async () => {
        it("Fails if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.reverted
        })

        it('Updated amount addressToAmountFunded data structure', async () => {
            await fundMe.fund({ value: sendValue })
            const responce = await fundMe.getAmountFundedByAddress(deployer)
            assert.equal(responce.toString(), sendValue.toString())
        })

        it('Add funder to array of funders', async () => {
            await fundMe.fund({ value: sendValue })
            const responce = await fundMe.getFunder(0)
            assert.equal(responce, deployer)
        })
    })

    describe('withdraw', async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })

        it('withdraw ETH form a single founder', async () => {
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })

        it('withdraw ETH with a multiple founders', async () => {
            const accounts = await ethers.getSigners()

            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )

            await expect(fundMe.getFunder(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAmountFundedByAddress(accounts[i].address),
                    0
                )
            }
        })

        it('Only owner can withdraw', async () => {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)

            await expect(
                attackerConnectedContract.withdraw()
            ).to.be.revertedWithCustomError(fundMe, 'FundMe__NotOwner')
        })
    })
})
