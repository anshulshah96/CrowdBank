// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import bank_artifacts from '../../build/contracts/CrowdBank.json'

var CrowdBank = contract(bank_artifacts);
var account;

function showPastLoans() {
  account = web3.eth.accounts[0];
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.totalLoansBy.call(account).then(function(loanCount) {
      console.log("GOT NUMBER OF LOANS : ",loanCount.valueOf());
      if(loanCount.valueOf() != 0)
      {
        console.log("GETTING LOAN STATE");
        getLoanState();
      }
      else
      {
        displayForm();
      }
      for(let i=0;i< loanCount.valueOf();i++)
      {
        contractInstance.getLoanDetailsByAddressPosition.call(account, i).then(function(details) {
          $("#loan-rows").append("<tr><td>" + el[0].valueOf() + "</td><td>" + el[1].valueOf() + "</td><td>" + el[2].valueOf()  + "</td><td>" + el[3].valueOf() + "</td><td>" + el[4].valueOf() + "</td></tr>");
          $('#loan-rows').DataTable();
        });
      }
    });
  });
}

function displayForm() {
  document.getElementById('newloan-form').style.display = 'block';
}

function getLoanState() {
  account = web3.eth.accounts[0];
  CrowdBank.deployed().then(function(contractInstance) {
    console.log(account);
    contractInstance.getLastLoanState.call(account).then(function(LoanState) {
      if(LoanState == 0)
      {
        displayForm();
      }
      else
      {
        getLastLoanDetails();
      }
    });
  });
}

function newLoan(amount, date) {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.newLoan(amount,date);
  });
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
  });


  document.getElementById('newloan-form').addEventListener('submit', function(evt){
    evt.preventDefault();
    var amount = $('#newloan-amount').val();
    var date = new Date($('#newloan-date').val()).getTime()/1000;
    newLoan(amount,date);
  });

  CrowdBank.setProvider(web3.currentProvider);
  $('#loan-rows').DataTable();
  showPastLoans();
});