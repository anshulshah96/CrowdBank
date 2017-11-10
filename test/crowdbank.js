var CrowdBank = artifacts.require("./CrowdBank.sol");

var account_one = web3.eth.accounts[0];
var account_two = web3.eth.accounts[1];

contract('CrowdBank', function(accounts) {
  
  it("should allow people to propose loan and people to lend on it", function() {
    var instanceObj;

    return CrowdBank.deployed().then(function(instance) {
      instanceObj = instance;
      instance.newLoan(1000, 106000, {from:account_two});
      return instance.newLoan(1000, 106000, {from:account_one});
    }).then(function(transaction) {
      return instanceObj.getLoanDetailsById.call(1);
    }).then(function(response) {
      console.log(response);
      assert.equal(response[0].valueOf(), 0,      "state does not match");
      assert.equal(response[1].valueOf(), 106000, "dueDate does not match");
      assert.equal(response[2].valueOf(), 1000,   "amount does not match");
      return instanceObj.newProposal(0, 10, {value: 100, from: account_two});
    }).then(function(transaction) {
      return instanceObj.totalProposalsBy.call(account_two);
    }).then(function(response) {
      assert.equal(response.valueOf(), 1, "Proposal not submitted");
    });
  });
/*
  it("should handle getters", function() {
    var instanceObj;

    return CrowdBank.deployed().then(function(instance) {
      instanceObj = instance;
      return instanceObj.totalLoans();
    }).then(function(response) {
      assert.equal(response.valueOf(), 2, "Number of loans does not match");
    });
  });*/

  it("should allow borrower to accept proposal from lender", function() {
    var instanceObj;

    return CrowdBank.deployed().then(function(instance) {
      instanceObj = instance;
      return instanceObj.getLoanDetailsByAddressPosition.call(account_one, 0);
    }).then(function(response) {
      assert.equal(response[0].valueOf(), 0,        "state does not match");
      assert.equal(response[1].valueOf(), 106000,   "dueDate does not match");
      assert.equal(response[2].valueOf(), 1000,     "amount does not match");
      return instanceObj.getProposalDetailsByLoanIdPosition.call(0, 0);
    }).then(function(response) {
      assert.equal(response[0].valueOf(), 0,        "state does not match");
      assert.equal(response[1].valueOf(), 10,       "rate does not match");
      assert.equal(response[2].valueOf(), 100,      "amount does not match");
      return instanceObj.takeActionOnProposal(0, 1, {from: account_one});
    }).then(function(transaction) {
      return instanceObj.getLoanDetailsByAddressPosition.call(account_one, 0);
    }).then(function(response) {
      // assert.equal(response[0].valueOf(), 1,        "state does not match");
      assert.equal(response[1].valueOf(), 106000,   "dueDate does not match");
      assert.equal(response[2].valueOf(), 1000,     "amount does not match");
      return instanceObj.getProposalDetailsByLoanIdPosition.call(0, 0);
    }).then(function(response) {
      // assert.equal(response[0].valueOf(), 1,        "state does not match");
      assert.equal(response[1].valueOf(), 10,       "rate does not match");
      assert.equal(response[2].valueOf(), 100,      "amount does not match");
    });
  });

});
