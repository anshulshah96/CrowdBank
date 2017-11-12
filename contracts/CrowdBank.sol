pragma solidity ^0.4.4;
contract CrowdBank {
    
    address public owner;
    
    enum ProposalState {
        WAITING,
        ACCEPTED,
        REPAID
    }

    struct Proposal {
        address lender;
        uint loanId;
        ProposalState state;
        uint rate;
        uint amount;
    }
    
    enum LoanState {
        ACCEPTING,
        LOCKED,
        SUCCESSFUL,
        FAILED
    }
    
    struct Loan {
        address borrower;
        LoanState state;
        uint dueDate;
        uint amount;
        uint proposalCount;
        uint collected;
        uint startDate;
        mapping (uint=>uint) proposal;
    }

    Loan[] public loanList;
    Proposal[] public proposalList;

    mapping (address=>uint[]) public loanMap;
    mapping (address=>uint[]) public lendMap;

    function CrowdBank() {
        owner = msg.sender;
    }

    function hasActiveLoan(address borrower) constant returns(bool) {
        uint validLoans = loanMap[borrower].length;
        if(validLoans == 0) return false;
        Loan obj = loanList[loanMap[borrower][validLoans-1]];
        if(loanList[validLoans-1].state == LoanState.ACCEPTING) return true;
        if(loanList[validLoans-1].state == LoanState.LOCKED) return true;
        return false;
    }
    
    function newLoan(uint amount, uint dueDate) {
        if(hasActiveLoan(msg.sender)) return;
        uint currentDate = block.timestamp;
        loanList.push(Loan(msg.sender, LoanState.ACCEPTING, dueDate, amount, 0, 0, currentDate));
        loanMap[msg.sender].push(loanList.length-1);
    }

    function newProposal(uint loanId, uint rate) payable {
        if(loanList[loanId].borrower == 0 || loanList[loanId].state != LoanState.ACCEPTING)
            return;
        //TODO: check condition where msg.value > loan amount : we should return the msg ether
        proposalList.push(Proposal(msg.sender, loanId, ProposalState.WAITING, rate, msg.value));
        lendMap[msg.sender].push(proposalList.length-1);
        loanList[loanId].proposalCount++;
        loanList[loanId].proposal[loanList[loanId].proposalCount-1] = proposalList.length-1;
    }

    function getActiveLoanId(address borrower) constant returns(uint) {
        uint numLoans = loanMap[borrower].length;
        if(numLoans == 0) return (2**64 - 1);
        uint lastLoanId = loanMap[borrower][numLoans-1];
        if(loanList[lastLoanId].state != LoanState.ACCEPTING) return (2**64 - 1);
        return lastLoanId;
    }

    function revokeProposal(uint proposeId) {
        if(msg.sender != proposalList[proposeId].lender) return;
        if(proposalList[proposeId].state != ProposalState.WAITING) return;
        uint loanId = proposalList[proposeId].loanId;
        if(loanList[loanId].state == LoanState.ACCEPTING) {
            // Lender wishes to revoke his ETH when proposal is still WAITING
            proposalList[proposeId].state = ProposalState.REPAID;
            msg.sender.transfer(proposalList[proposeId].amount);
        }
        else if(loanList[loanId].state == LoanState.LOCKED) {
            // The loan is locked/accepting and the due date passed : transfer the mortgage
            if(loanList[loanId].dueDate < now) return;
            loanList[loanId].state = LoanState.FAILED;
            for(uint i = 0; i < loanList[loanId].proposalCount; i++) {
                uint numI = loanList[loanId].proposal[i];
                if(proposalList[numI].state == ProposalState.ACCEPTED) {
                    // transfer mortgage 
                }
            } 
        }
    }

    function totalProposalsBy(address lender) constant returns(uint) {
        return lendMap[lender].length;
    }

    function getProposalAtPosFor(address lender, uint pos) constant returns(address, uint, ProposalState, uint, uint) {
        Proposal prop = proposalList[lendMap[lender][pos]];
        return (prop.lender, prop.loanId, prop.state, prop.rate, prop.amount);
    }

// BORROWER ACTIONS AVAILABLE    

    function totalLoansBy(address borrower) constant returns(uint) {
        return loanMap[borrower].length;
    }

    function getLoanDetailsByAddressPosition(address borrower, uint pos) constant returns(LoanState, uint, uint, uint, uint, uint) {
        Loan obj = loanList[loanMap[borrower][pos]];
        return (obj.state, obj.dueDate, obj.amount, obj.proposalCount, obj.collected, loanMap[borrower][pos]);
    }

    function getLastLoanState(address borrower) constant returns(LoanState) {
        uint loanLength = loanMap[borrower].length;
        if(loanLength == 0)
            return LoanState.SUCCESSFUL;
        return loanList[loanMap[borrower][loanLength -1]].state;
    }

    function getLastLoanDetails(address borrower) constant returns(LoanState, uint, uint, uint, uint) {
        uint loanLength = loanMap[borrower].length;
        Loan obj = loanList[loanMap[borrower][loanLength -1]];
        return (obj.state, obj.dueDate, obj.amount, obj.proposalCount, obj.collected);
    }

    function getProposalDetailsByLoanIdPosition(uint loanId, uint numI) constant returns(ProposalState, uint, uint) {
        Proposal obj = proposalList[loanList[loanId].proposal[numI]];
        return (obj.state, obj.rate, obj.amount);
    }

    function numTotalLoans() constant returns(uint) {
        return loanList.length;
    }
    
    function lockLoan(uint loanId) {
        //contract will send money to msg.sender
        //states of proposals would be finalized, not accepted proposals would be reimbursed
        if(loanList[loanId].state == LoanState.ACCEPTING)
        {
          loanList[loanId].state = LoanState.LOCKED;
          for(uint i = 0; i < loanList[loanId].proposalCount; i++)
          {
            uint numI = loanList[loanId].proposal[i];
            if(proposalList[numI].state == ProposalState.ACCEPTED)
            {
              msg.sender.transfer(proposalList[numI].amount); //Send to borrower
            }
            else
            {
              proposalList[numI].state = ProposalState.REPAID;
              proposalList[numI].lender.transfer(proposalList[numI].amount); //Send back to lender
            }
          }
        }
        else
          return;
    }
    
    //Amount to be Repaid
    function getRepayValue(uint loanId) constant returns(uint) {
        if(loanList[loanId].state == LoanState.LOCKED)
        {
          uint time = loanList[loanId].startDate;
          uint finalamount = 0;
          for(uint i = 0; i < loanList[loanId].proposalCount; i++)
          {
            uint numI = loanList[loanId].proposal[i];
            if(proposalList[numI].state == ProposalState.ACCEPTED)
            {
              uint original = proposalList[numI].amount;
              uint rate = proposalList[numI].rate;
              uint now = block.timestamp;
              uint interest = (original*rate*(now - time));
              finalamount += interest;
              finalamount += original;
            }
          }
          return finalamount;
        }
        else
          return (2**64 -1);
    }

    function repayLoan(uint loanId) payable {
      uint now = block.timestamp;
      uint toBePaid = getRepayValue(loanId);
      uint time = loanList[loanId].startDate;
      uint paid = msg.value;
      if(paid == toBePaid)
      {
        loanList[loanId].state = LoanState.SUCCESSFUL;
        for(uint i = 0; i < loanList[loanId].proposalCount; i++)
        {
          uint numI = loanList[loanId].proposal[i];
          if(proposalList[numI].state == ProposalState.ACCEPTED)
          {
            uint original = proposalList[numI].amount;
            uint rate = proposalList[numI].rate;
            uint interest = (original*rate*(now - time));
            uint finalamount = interest + original;
            proposalList[numI].lender.transfer(finalamount);
            proposalList[numI].state = ProposalState.REPAID;
          }
        }
      }
      else
        return;
    }
    
    function takeActionOnProposal(uint proposeId)
    {
        uint loanId = getActiveLoanId(msg.sender); 
        if(loanId == (2**64 - 1)) return;
        Proposal pObj = proposalList[proposeId];
        Loan lObj = loanList[loanId];
        if(lObj.state != LoanState.ACCEPTING) return;
        if(pObj.state != ProposalState.WAITING) return;
        proposalList[proposeId].state = ProposalState.ACCEPTED;
    }
}