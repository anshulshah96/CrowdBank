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
      console.log(transaction);
      return instanceObj.totalLoansBy.call(account_one);
    }).then(function(response) {
      assert.equal(response.valueOf(), 1, "Loan not proposed");
      return instanceObj.newProposal(account_one, 10, {value: 100, from: account_two})
    }).then(function(transaction) {
      return instanceObj.totalProposalsBy.call(account_two);
    }).then(function(response) {
      assert.equal(response.valueOf(), 1, "Proposal not submitted");
    });
  });
  
  /*it("should call a function that depends on a linked library", function() {
    var meta;
    var metaCoinBalance;
    var metaCoinEthBalance;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(accounts[0]);
    }).then(function(outCoinBalance) {
      metaCoinBalance = outCoinBalance.toNumber();
      return meta.getBalanceInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      metaCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpeced function, linkage may be broken");
    });
  });

  it("should send coin correctly", function() {
    var meta;

    //    Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return meta.sendCoin(account_two, amount, {from: account_one});
    }).then(function() {
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });*/

});
