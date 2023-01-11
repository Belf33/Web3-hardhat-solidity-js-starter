# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
- yarn hardhat help
- yarn hardhat compile
- yarn hardhat coverage
to deploy on test net 
- 'yarn deploy --network goerli'
to deploy both mocks and real contract 
- 'yarn deploy'

Run test on mocks + localNetwork
- 'yarn test'

to run tests on test network ( after deploy )
- 'yarn test:staging'

run Scripts on localNode:
- run node first 'yarn hardhat node'
- 'yarn hardhat run scripts/fund.js --network localhost'