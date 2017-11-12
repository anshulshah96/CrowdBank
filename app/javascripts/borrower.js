// Import the page's CSS. Webpack will know what to do with it.
// import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import bank_artifacts from '../../build/contracts/CrowdBank.json'

var CrowdBank = contract(bank_artifacts);
var account;

var LOANSTATE = {
  0 : "ACCEPTING",
  1 : "LOCKED",
  2 : "COMPLETED SUCCESSFUL",
  3 : "COMPLETION FAILED"
}

function showPastLoans() {
  CrowdBank.deployed().then(function(contractInstance) {
    contractInstance.totalLoansBy.call(account).then(function(loanCount) {
      console.log("GOT NUMBER OF LOANS : ",loanCount.valueOf());
      if(loanCount.valueOf() != 0)
      {
        console.log("GETTING LOAN STATE");
        // getLoanState();
      }
      else
      {
        displayForm();
      }
      for(let i=0;i< loanCount.valueOf();i++)
      {
        contractInstance.getLoanDetailsByAddressPosition.call(account, i).then(function(el) {
          console.log(el);
          var table = $('#loan-rows').DataTable();
          var rowNode = table.row.add([LOANSTATE[el[0].valueOf()],Date(el[1].valueOf()),el[2].valueOf(),el[3].valueOf(),el[4].valueOf(),el[5].valueOf(),"<button>Details!</button>"]).draw().node();
        });
      }
    });
  });
}

function displayForm() {
  document.getElementById('newloan-form').style.display = 'block';
}

// function getLoanState() {
//   CrowdBank.deployed().then(function(contractInstance) {
//     contractInstance.getLastLoanState.call(account).then(function(LoanState) {
//       if(LoanState == 0)
//       {
//         displayForm();
//       }
//       else
//       {
//         getLastLoanDetails();
//       }
//     });
//   });
// }

function newLoan(amount, date) {
  CrowdBank.deployed().then(function(contractInstance) {
    // contractInstance.defaultAccount = account;
    contractInstance.newLoan(amount,date,{gas: 1400000, from: account}).then(function() {
      console.log("CREATED NEW LOAN");
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
    account = accs[3];
  });


  document.getElementById('newloan-form').addEventListener('submit', function(evt){
    evt.preventDefault();
    var amount = $('#newloan-amount').val();
    var date = new Date($('#newloan-date').val()).getTime()/1000;
    newLoan(amount,date);
  });

  $('#loan-rows tbody').on( 'click', 'button', function () {
    var table = $('#loan-rows').DataTable();
    var data = table.row( $(this).parents('tr') ).data();
    var loanId = data[5];
    console.log(loanId);
    CrowdBank.deployed().then(function(contractInstance) {
      contractInstance.getLoanDetailsById.call(loanId).then(function(data) {
        console.log(data);
      });
    });
  });

  CrowdBank.setProvider(web3.currentProvider);
  $('#loan-rows').DataTable();
  showPastLoans();
});