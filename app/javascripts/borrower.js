// Import the page's CSS. Webpack will know what to do with it.
// import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import bank_artifacts from '../../build/contracts/CrowdBank.json'

var CrowdBank = contract(bank_artifacts);
var account;
var wtoE;

var LOANSTATE = {
  0 : "ACCEPTING",
  1 : "LOCKED",
  2 : "COMPLETED SUCCESSFUL",
  3 : "COMPLETION FAILED"
}
var LOANSTATECLASS = {
  0 : "table-primary",
  1 : "table-info",
  2 : "table-success",
  3 : "table-danger"
}

function LOANSTATEACTION(state,loanId)
{
  if(state == 0)
  {
    return '<button class="btn btn-danger" onclick="lockLoan('+loanId+')">LOCK</button>';
  }
  else if(state == 1)
  {
    return '<button class="btn btn-success" onclick="repayLoan('+loanId+')">REPAY</button>';
  }
  else
    return '-';
}

var loanData = [];

function getLoanState() {
  CrowdBank.deployed().then(function(contractInstance) {
    console.log(account);
    contractInstance.getLastLoanState.call(account).then(function(loanState) {
      if(loanState.valueOf() == 2 || loanState.valueOf() == 3)
      {
        displayForm();
      }
    });
  });
}

window.showLoanDetails = function(loanId) {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.loanList(loanId).then(function(result) {
      console.log(result);
      var proposalCount = (result[4].valueOf());
      $('#loan-proposal-count').html(proposalCount);
      $("#loan-proposal-details tbody").empty();
      for(let i=0;i< proposalCount ;i++)
      {
        contractInstance.getProposalDetailsByLoanIdPosition.call(loanId, i).then(function(el) {
          var newRowContent = '<tr>\
            <td>'+el[1].valueOf()+'</td>\
            <td>'+el[2].valueOf()+'</td>\
            <td>'+el[0].valueOf()+'</td>\
          </tr>';
          $("#loan-proposal-details tbody").prepend(newRowContent);
        });
      }
    });
    contractInstance.getRepayValue.call(loanId).then(function(result) {
      console.log(result.valueOf());
    });
    $('#loanDetailsModal').modal('show');
  });
}

window.lockLoan = function(loanId) {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.lockLoan(loanId,{gas: 1400000, from: account}).then(function() {
      console.log("LOAN LOCKED SUCCESSFULLY");
      window.href = '/borrower.html';
    });
  });
}

window.repayLoan = function(loanId) {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.getRepayValue.call(loanId).then(function(result){
      contractInstance.repayLoan(loanId,{gas: 1400000, from: account, value : result}).then(function(){
        console.log("REPAY DONE SUCCESSFULLY");
      });
    });
  });
}

function showPastLoans() {
  CrowdBank.deployed().then(function(contractInstance) {
    console.log("CONTRACT : ",contractInstance);
    console.log(account);
    contractInstance.totalLoansBy.call(account).then(function(loanCount) {
      console.log("GOT NUMBER OF LOANS : ",loanCount.valueOf());
      if(loanCount.valueOf() !== 0)
      {
        getLoanState();
        for(let i=0;i< loanCount.valueOf();i++)
        {
          contractInstance.getLoanDetailsByAddressPosition.call(account, i).then(function(el) {
            var newRowContent = '<tr class="'+LOANSTATECLASS[el[0].valueOf()]+'">\
              <td>'+LOANSTATE[el[0].valueOf()]+'</td>\
              <td>'+Date(el[1].valueOf())+'</td>\
              <td>'+el[2].valueOf()/wtoE+'</td>\
              <td>'+el[3].valueOf()+'</td>\
              <td>'+el[4].valueOf()+'</td>\
              <td>'+el[5].valueOf()+'</td>\
              <td><button class="btn btn-default" onclick="showLoanDetails('+el[5].valueOf()+')">Details</button></td>\
              <td>'+LOANSTATEACTION(el[0].valueOf(),el[5].valueOf())+'</td>\
            </tr>';
            $("#loan-rows tbody").prepend(newRowContent);
          });
        }
      }
      else
      {
        displayForm();
      }
   });
  });  
}

function displayForm() {
  document.getElementById('newloan-form').style.display = 'block';
}

function newLoan(amount, date) {
  CrowdBank.deployed().then(function(contractInstance) {
    // contractInstance.defaultAccount = account;
    contractInstance.newLoan(web3.toWei(amount,'ether'),date,{gas: 1400000, from: account}).then(function() {
      console.log("CREATED NEW LOAN");
      window.href = '/borrower.html';
    });
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
    wtoE = web3.toWei(1,'ether');
    $('#account-number').html(account);
    $('#account-balance').html(web3.eth.getBalance(account).valueOf()/web3.toWei(1,'ether'));
  });

  document.getElementById('newloan-form').addEventListener('submit', function(evt){
    evt.preventDefault();
    var amount = $('#newloan-amount').val();
    var date = new Date($('#newloan-date').val()).getTime()/1000;
    newLoan(amount,date);
  });

  // $('#loan-rows tbody').on( 'click', 'button', function (event) {
  //   console.log(event.target);
  //   console.log(event);
  // });

  CrowdBank.setProvider(web3.currentProvider);
  showPastLoans();
  // $('#loan-rows').DataTable();
});