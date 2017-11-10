var CrowdBank = artifacts.require("./CrowdBank.sol");

var account_one = web3.eth.accounts[0];
var account_two = web3.eth.accounts[1];

contract('CrowdBank', function(accounts) {
  
  it("should allow people to propose loan and people to lend on it", function() {
    var instanceObj;
    return CrowdBank.deployed().then(function(instance) {
      instanceObj = instance;
      return instance.newLoan(1000, 100000, {from:account_one});
    }).then(function(transaction) {
      // console.log(transaction);
      return instanceObj.totalLoansBy.call(account_one);
    }).then(function(response) {
      assert.equal(response.valueOf(), 1, "Loan not proposed");
      return instanceObj.newProposal(account_one, 10, {value: 100, from: account_two});
    }).then(function(transaction) {
      return instanceObj.totalProposalsBy.call(account_two);
    }).then(function(response) {
      assert.equal(response.valueOf(), 1, "Proposal not submitted");
    });
  });

  it("should allow borrower to accept proposal from lender", function() {
    var instanceObj;

    return CrowdBank.deployed().then(function(instance) {
      instanceObj = instance;
      return instanceObj.getLoanDetailsByNumber.call(account_one, 0);
    }).then(function(response) {
      assert.equal(response[0], 0, "state does not match");
      assert.equal(response[1], 100000, "dueDate does not match");
      assert.equal(response[2], 1000, "amount does not match");
      return instanceObj.getLoanProposalDetails.call(account_one, 0, 0);
    }).then(function(response) {
      assert.equal(response[0], 0, "state does not match");
      assert.equal(response[1], 10, "rate does not match");
      assert.equal(response[2], 100, "amount does not match");
      return instanceObj.acceptProposal(0, {from: account_one});
    }).then(function(transaction) {
      return instanceObj.getLoanDetailsByNumber.call(account_one, 0);
    }).then(function(response) {
      assert.equal(response[0], 1, "state does not match");
      assert.equal(response[1], 100000, "dueDate does not match");
      assert.equal(response[2], 1000, "amount does not match");
      return instanceObj.getLoanProposalDetails.call(account_one, 0, 0);
    }).then(function(response) {
      assert.equal(response[0], 1, "state does not match");
      assert.equal(response[1], 10, "rate does not match");
      assert.equal(response[2], 100, "amount does not match");
    });
  });

});
