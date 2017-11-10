var CrowdBank = artifacts.require("./CrowdBank.sol");
module.exports = function(deployer) {
  deployer.deploy(CrowdBank);
};
