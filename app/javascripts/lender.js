// // Import the page's CSS. Webpack will know what to do with it.
// import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import bank_artifacts from '../../build/contracts/CrowdBank.json'

var CrowdBank = contract(bank_artifacts);

let proposals = [];
var account;
let loanList = [];

function populateProposals() {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.totalProposalsBy.call(account).then(function(proposalLength) {
      proposals = [];
      $("#proposal-rows").empty();
      for(var i = 0; i < proposalLength; i++) {
        contractInstance.getProposalAtPosFor.call(account, i).then(function(el) {
          $("#proposal-rows").append("<tr><td>" + el[0].valueOf() + "</td><td>" + el[1].valueOf() + "</td><td>" + el[2].valueOf()  + "</td><td>" + el[3].valueOf() + "</td><td>" + el[4].valueOf() + "</td></tr>");
        });
      }
    });
  });
}

window.calli = function(id) {
  var amount = $('#lendinput'+id).val();
  var rate = $('#lendrate'+id).val();
  console.log("Lending " + amount + " Ether to LoanId " + id);
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.newProposal(id, rate, {value: amount, from: account, gas: 2000000}).then(function(transaction) {
        console.log(transaction);
    });
  })

}

function populateRecentLoans() {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.numTotalLoans.call().then(function(numLoans) {
      loanList = [];
      $("#recent-loan-rows").empty();
      var ccount = 0;
      for(var i = 0; i < 10 && numLoans-1-i >= 0; i++) {
        contractInstance.loanList(numLoans-1-i).then(function(el) {
          var loanId = (numLoans-1-(ccount));
          var actionHTML = 
          "<input type='number' id='lendinput"+loanId+"'></input><input type='number' id='lendrate"+loanId+"'></input><button onclick='calli("+loanId+")'>Do</button>";
          $("#recent-loan-rows").append("<tr><td>" + (numLoans-1-(ccount++)) + "</td><td>" + el[0].valueOf() + "</td><td>" + el[1].valueOf() + "</td><td>" + Date(el[2].valueOf())  + "</td><td>" + el[3].valueOf() + "</td><td>" + actionHTML  + "</td><tr>");
        });
      }
    });
  })
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://172.25.12.128:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://172.25.12.128:8545"));
  }

  web3.eth.getAccounts(function(err, accs) {
    account = accs[0];
    $('#account-number').html(account);
    $('#account-balance').html(web3.eth.getBalance(account).valueOf()/web3.toWei(1,'ether'));
  });

  CrowdBank.setProvider(web3.currentProvider);
  populateProposals();
  populateRecentLoans();
});