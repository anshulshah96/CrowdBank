var CrowdBank = artifacts.require("./CrowdBank.sol");
var Mortgage = artifacts.require("./Mortgage.sol");
module.exports = function(deployer) {
  deployer.deploy(CrowdBank);
  deployer.deploy(Mortgage);
};
