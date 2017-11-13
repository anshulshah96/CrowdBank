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
var wtoE;

var PROPOSALSTATE = {
  0 : "WAITING",
  1 : "ACCEPTED",
  2 : "REPAID"
}
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

window.revokeProposal = function(id) {
  CrowdBank.deployed().then(function(contractInstance) {
    console.log(id);
    contractInstance.revokeMyProposal(id, {from: account, gas:2000000}).then(function(transaction) {
      console.log("proposalId " + id + " was tried to revoked");
      console.log(transaction);
      refreshPage();
    });
  });
}

function populateProposals() {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.totalProposalsBy.call(account).then(function(proposalLength) {
      proposals = [];
      $("#proposal-rows").empty();
      var curpos = 0;
      for(var i = 0; i < proposalLength; i++) {
        contractInstance.getProposalAtPosFor.call(account, i).then(function(el) {
          var buttonHTML;
          if(el[2].valueOf() == 0) {
            buttonHTML = "<button class='btn btn-danger' onclick='revokeProposal("+(curpos++)+")'>\
              x\
              </button>";
          }
          else {
            buttonHTML = "--";
          }
          $("#proposal-rows").append("<tr id='proposal"+i+"'>\
            <td>" + el[1].valueOf() + "</td>\
            <td>" + el[5].valueOf()/wtoE + " eth</td>\
            <td>"+new Date(el[6].valueOf()*1000).toDateString()+"</td>\
            <td><a target='_blank' href='http://mortgage.crowdbank.gov.in:8080/verify.html?hash="+web3.toUtf8(el[7].valueOf())+"'>Link</a></td>\
            <td>" + PROPOSALSTATE[el[2].valueOf()]  + "</td>\
            <td>" + el[3].valueOf() + "</td>\
            <td>" + el[4].valueOf()/wtoE + "</td>\
            <td>" + buttonHTML + "</td>\
            </tr>");
        });
      }
    });
  });
}

window.proposeLend = function(id) {
  var amount = $('#lendinput'+id).val();
  var rate = $('#lendrate'+id).val();
  console.log("Lending " + amount + " Ether to LoanId " + id);
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.newProposal(id, rate, {value: web3.toWei(amount,'ether'), from: account, gas: 2000000}).then(function(transaction) {
        console.log(transaction);
        refreshPage();
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
          var amountHTML;
          var rateHTML;
          var btnHTML;
          if(el[1].valueOf() == 0){
            amountHTML = "<input type='number' id='lendinput"+loanId+"'></input>";
            rateHTML = "<input type='number' id='lendrate"+loanId+"'></input>";
            btnHTML = "<button class='btn btn-success' onclick='proposeLend("+loanId+")'>✔</button>";
          }
          else {
            amountHTML = "-";
            rateHTML = "-";
            btnHTML = "-";
          }
          $("#recent-loan-rows").append("<tr class='"+LOANSTATECLASS[el[1].valueOf()]+"'>\
            <td>" + (numLoans-1-(ccount++)) + "</td>\
            <td>" + el[0].valueOf() + "</td>\
            <td>" + LOANSTATE[el[1].valueOf()] + "</td>\
            <td>" + new Date(el[2].valueOf()*1000).toDateString() + "</td>\
            <td>" + el[3].valueOf()/wtoE + "</td>\
            <td><a target='_blank' href='http://mortgage.crowdbank.gov.in:8080/verify.html?hash="+web3.toUtf8(el[7].valueOf())+"'>Link</a></td>\
            <td>" + amountHTML  + "</td>\
            <td>" + rateHTML  + "</td>\
            <td>" + btnHTML  + "</td>\
            <tr>");
        });
      }
    });
  })
}

function getBalance (address) {
  return web3.eth.getBalance(address, function (error, result) {
    if (!error) {
      console.log(result.toNumber());
    } else {
      console.error(error);
    }
  })
}

function refreshPage() {
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
  populateProposals();
  populateRecentLoans();
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

  CrowdBank.setProvider(web3.currentProvider);
  refreshPage();
});
