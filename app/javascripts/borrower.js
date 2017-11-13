// Import the page's CSS. Webpack will know what to do with it.
// import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import bank_artifacts from '../../build/contracts/CrowdBank.json';
import bank_artifacts2 from '../../build/contracts/Mortgage.json';

var CrowdBank = contract(bank_artifacts);
var Mortgage = contract(bank_artifacts2);
var account;
var wtoE;
var GAS_AMOUNT = 90000000;

var LOANSTATE = {
  0 : "ACCEPTING",
  1 : "LOCKED",
  2 : "COMPLETED SUCCESSFUL",
  3 : "COMPLETION FAILED"
}
var LOANSTATECLASS = {
  0 : "primary",
  1 : "info",
  2 : "success",
  3 : "danger"
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

function refreshPage() {
  location.reload();
}
var getProposalClass = {
  0 : "info",
  1 : "success",
  2 : "danger"
}

function getProposalAction(proposalState,proposalId)
{
  if(proposalState == 0)
    return '<b><a onclick="acceptProposal('+proposalId+')">ACCEPT</a></b>';
  else if(proposalState == 1)
    return '<b>Accepted</b>';
  else
    return '<b>Repaid</b>';
}

window.acceptProposal = function(proposalId) {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.acceptProposal(proposalId,{gas: GAS_AMOUNT, from: account}).then(function(result) {
      refreshPage();
    });
  });
}

window.showLoanDetails = function(loanId) {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.loanList(loanId).then(function(result) {
      console.log(result);
      if(result[1].valueOf() == 1)
      {
        contractInstance.getRepayValue.call(loanId).then(function(result) {
          $('#loan-repay-amount').html(result.valueOf()/wtoE + " eth");
        });        
      }
      else
      {
        contractInstance.getRepayValue.call(loanId).then(function(result) {
          $('#loan-repay-amount').html("-");
        });        
      }
      var proposalCount = (result[4].valueOf());
      $('#loan-proposal-count').html(proposalCount);
      $("#loan-proposal-details tbody").empty();
      for(let i=0;i< proposalCount ;i++)
      {
        contractInstance.getProposalDetailsByLoanIdPosition.call(loanId, i).then(function(el) {
          console.log(el);
          var newRowContent = '<tr class="'+getProposalClass[el[0].valueOf()]+'">\
            <td>'+(el[2].valueOf()/wtoE)+' eth</td>\
            <td>'+el[1].valueOf()+'</td>\
            <td>'+getProposalAction(el[0].valueOf(),el[3].valueOf())+'</td>\
          </tr>';
          $("#loan-proposal-details tbody").prepend(newRowContent);
        });
      }
    });
    $('#loanDetailsModal').modal('show');
  });
}

window.lockLoan = function(loanId) {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.lockLoan(loanId,{gas: GAS_AMOUNT, from: account}).then(function() {
      console.log("LOAN LOCKED SUCCESSFULLY");
      refreshPage();
    });
  });
}

window.repayLoan = function(loanId) {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.getRepayValue.call(loanId).then(function(result){
      var amount = parseInt(result.valueOf()) + parseInt(web3.toWei(1,'ether').valueOf());
      console.log(amount);
      contractInstance.repayLoan(loanId,{gas: GAS_AMOUNT, from: account, value : amount}).then(function(){
        console.log("REPAY DONE SUCCESSFULLY");
        refreshPage();
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
            console.log(el[5].valueOf());
            console.log(el[5]);
            var newRowContent = '<tr class="'+LOANSTATECLASS[el[0].valueOf()]+'">\
              <td>'+el[4].valueOf()+'</td>\
              <td>'+LOANSTATE[el[0].valueOf()]+'</td>\
              <td>'+new Date(el[1].valueOf()*1000).toDateString()+'</td>\
              <td>'+el[2].valueOf()/wtoE+' eth</td>\
              <td><a target="_blank" href="http://mortgage.crowdbank.gov.in:8080/verify.html?hash='+web3.toUtf8(el[5].valueOf())+'">Link</a></td>\
              <td>'+el[3].valueOf()/wtoE+' eth</td>\
              <td><button class="btn btn-default" onclick="showLoanDetails('+el[4].valueOf()+')">Details</button></td>\
              <td>'+LOANSTATEACTION(el[0].valueOf(),el[4].valueOf())+'</td>\
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

function getMortgageDetails() {
  Mortgage.deployed().then(function(contractInstance) {

    contractInstance.getMortgageCount.call(account).then(function(result) {
      var count = result.valueOf();
      console.log("MORTGAGE COUNT : ",count);
      for(let i=0;i<count;i++)
      {
        contractInstance.mortgageMap(account,i).then(function(output) {
          var mortgage = web3.toUtf8(output.valueOf());
          var newOption = '<option value="'+mortgage+'">'+mortgage+'</option>';
          $('#newloan-mortgage').append(newOption);
        });
      }
    });
  });
}

function displayForm() {
  getMortgageDetails();
  document.getElementById('newloan-form').style.display = 'block';
}

function newLoan(amount, date, mortgage) {
  CrowdBank.deployed().then(function(contractInstance) {
    // contractInstance.defaultAccount = account;
    contractInstance.newLoan(web3.toWei(amount,'ether'),date,mortgage,{gas: GAS_AMOUNT, from: account}).then(function() {
      refreshPage();
    });
  });
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  web3.eth.getAccounts(function(err, accs) {
    wtoE = web3.toWei(1,'ether');
    account = accs[0];
    $('#account-number').html(account);
    web3.eth.getBalance(account, function (error, result) {
      if (!error) {
        $('#account-balance').html(result.toNumber()/wtoE);
      } else {
        console.error(error);
      }
    });
  });

  document.getElementById('newloan-form').addEventListener('submit', function(evt){
    evt.preventDefault();
    var amount = $('#newloan-amount').val();
    var date = new Date($('#newloan-date').val()).getTime()/1000;
    var mortgage = $('#newloan-mortgage').val();
    newLoan(amount,date,mortgage);
  });

  // $('#loan-rows tbody').on( 'click', 'button', function (event) {
  //   console.log(event.target);
  //   console.log(event);
  // });
  Mortgage.setProvider(web3.currentProvider);
  CrowdBank.setProvider(web3.currentProvider);
  showPastLoans();
  // $('#loan-rows').DataTable();
});



/*
TO DO
2. Repay Amount - Proposal Details
3. Show Borrower Address in Proposal Details
4. Write about convincing people whom banks do not trust
*/