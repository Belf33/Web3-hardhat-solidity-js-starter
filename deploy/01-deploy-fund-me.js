const { networks } = require('../hardhat.config');
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

    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // price feed address
        log: true,
    });
    log(
        '______________________________________________________________________________ '
    );
};

module.exports.tags = ['all', 'fundme'];
