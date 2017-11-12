// New Loan from acc4
CrowdBank.deployed().then(function(inst){inst.newLoan(web3.toWei(10,'ether'),100000000000,{from:web3.eth.accounts[4]});}) 
// New Proposal from 3 => 4
CrowdBank.deployed().then(function(inst){inst.newProposal(0,1,{value: web3.toWei(1,'ether'),from: web3.eth.accounts[3]});})
//Revoke Proposal 3 => 4
CrowdBank.deployed().then(function(inst){inst.revokeProposal(0,{from: web3.eth.accounts[3]});})
//check balance 3
web3.eth.getBalance(web3.eth.accounts[3]).valueOf()/(10**18)
// Lendmap from a person 0
CrowdBank.deployed().then(function(inst){inst.lendMap(web3.eth.accounts[0],1).then(console.log);})