const { version } = require('chai');

require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
require('@nomiclabs/hardhat-etherscan');
require('hardhat-deploy');
// require('./tasks/block-number');
// require('hardhat-gas-reporter');
// require('solidity-coverage');

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCUP_API_KEY = process.env.COINMARKETCUP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: 'hardhat',
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConformations: 6,
        },
        localhost: {
            url: 'http://127.0.0.1:8545/',
            chainId: 31337,
        },
    },
    // solidity: '0.8.8',
    solidity: {
        compilers: [{ version: '0.8.8' }, { version: '0.6.6' }],
    },
    etherscan: {
        apiKey: {
            goerli: 'JZX9WVB9I95KZDST5JXPAW5I7J3QGXKF4S',
        },
    },
    gasReporter: {
        enabled: false,
        // outputFile: 'gas-report.txt',
        noColors: false,
        currency: 'USD',
        coinmarketcap: COINMARKETCUP_API_KEY,
        token: 'MATIC',
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
};
