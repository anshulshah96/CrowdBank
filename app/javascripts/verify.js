// Import the page's CSS. Webpack will know what to do with it.
// import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import bank_artifacts from '../../build/contracts/Mortgage.json';

var Mortgage = contract(bank_artifacts);
var account;
var wtoE;
var GAS_AMOUNT = 90000000;
var BASE_URL = 'https://sh3r.tech/files/';
var md5 = require('md5');

window.verifyData = function() {
  var hash = $('#file-hash').val();
  var link = BASE_URL + hash + '.pdf';
  document.getElementById('pdfRenderer').src = link;
  Mortgage.deployed().then(function(contractInstance) {
    contractInstance.getOwnerCount.call(hash).then(function(result) {
      $('#mortgage-owner-list').empty();
      if(result.valueOf() == 0)
      {
         $('#mortgage-owner-list').append('<li class="list-group-item">No Owners Found! Be careful!</li>');
      }
      else
      {
        for(let i=0;i<result.valueOf();i++)
        {
          contractInstance.getOwnerByPosition.call(hash,i).then(function(result) {
             $('#mortgage-owner-list').append('<li class="list-group-item">'+result+'</li>');
          });
        }
      }
    });
  });
  document.getElementById('mortgageDetails').style.visibility = 'visible';
}

window.addData = function(data) {
  var hash = md5(data);
  Mortgage.deployed().then(function(contractInstance) {
    contractInstance.addData(hash,{gas: GAS_AMOUNT, from: account}).then(function(result) {
      console.log("HASH ADDED SUCCESSFULLY : ",hash);
    });
  });  
}

//For testing purpose only
function getHashFromUrl() {
  var url = location.href;
  if(url.indexOf('?') == -1)
    return;
  var hash = url.split('?')[1].split('&')[0].split('=')[1]
  $('#file-hash').val(hash);
  verifyData();
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
    account = accs[0];
    wtoE = web3.toWei(1,'ether');
  });

  Mortgage.setProvider(web3.currentProvider);
  getHashFromUrl();
});