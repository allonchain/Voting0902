// Import the page's CSS. Webpack will know what to do with it.
import "../styles/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import voting_artifacts from '../../build/contracts/Voting.json';

var Voting = contract(voting_artifacts);


let candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"};


window.voteForCandidate = function(candidate) {
  let candidateName = $("#candidate").val();
  try {
    $("#candidate").val("");

    web3.eth.getCoinbase(function(err, accountr) {
      if (err === null) {
        window.account = accountr;
        $("#msg").html("Vote has been submitted and Your Account is: " + window.account);
      }
    });
    

    Voting.deployed().then(function(contractInstance) {
      contractInstance.voteForCandidate(candidateName, {from: account}).then(function() {
        let div_id = candidates[candidateName];
        return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
          $("#" + div_id).html(v.toString());
          $("#msg").html("");
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}

$( document ).ready(function() {
  
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  Voting.setProvider(web3.currentProvider);
  let candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    Voting.deployed().then(function(contractInstance) {
      contractInstance.totalVotesFor.call(name).then(function(v) {
        $("#" + candidates[name]).html(v.toString());
      });
    })
  }
});