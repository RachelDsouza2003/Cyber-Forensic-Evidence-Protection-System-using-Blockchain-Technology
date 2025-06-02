const EvidenceChain = artifacts.require("EvidenceChain");

module.exports = function (deployer) {
  deployer.deploy(EvidenceChain);
};
