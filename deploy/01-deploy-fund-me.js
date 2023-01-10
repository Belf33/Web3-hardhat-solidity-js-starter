const { networks } = require('../hardhat.config');
const { verify } = require('../utils/verify');
const {
    networkConfig,
    developmentChains,
} = require('../helper-hardhat-config');
const { network } = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments }) => {
    // const { getNamedAccounts, deployment } = hre;
    // same as hre.getNamedAccounts...

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // const ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed'];
    let ethUsdPriceFeedAddress;

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get('MockV3Aggregator');
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed'];
    }

    // for localhosts or hardhat network we are going to use mocks
    const args = [ethUsdPriceFeedAddress];
    
    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: args, // price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHESCAN_API_KEY
    ) {
        await verify(fundMe.address, args);
    }
    log(
        '______________________________________________________________________________ '
    );
};

module.exports.tags = ['all', 'fundme'];
