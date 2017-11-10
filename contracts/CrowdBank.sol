pragma solidity ^0.4.4;
contract CrowdBank {
    
    address public owner;
    
    enum ProposalState {
        WAITING,
        ACCEPTED,
        REJECTED
    }

    struct Proposal {
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
        loanList.push(Loan(msg.sender, LoanState.ACCEPTING, dueDate, amount, 0, 0));
        loanMap[msg.sender].push(loanList.length-1);
    }

    function newProposal(uint loanId, uint rate) payable {
        if(loanList[loanId].borrower == 0 || loanList[loanId].state != LoanState.ACCEPTING)
            return;
        //TODO: check condition where msg.value > loan amount : we should return the msg ether
        proposalList.push(Proposal(loanId, ProposalState.WAITING, rate, msg.value));
        lendMap[msg.sender].push(proposalList.length-1);
        loanList[loanId].proposalCount++;
    }

    function getActiveLoanId(address borrower) constant returns(uint) {
        uint numLoans = loanMap[borrower].length;
        if(numLoans == 0) return (2**64 - 1);
        uint lastLoanId = loanMap[borrower][numLoans-1];
        if(loanList[lastLoanId].state != LoanState.ACCEPTING) return (2**64 - 1);
        return lastLoanId;
    }

    function takeActionOnProposal(uint proposeId, ProposalState newState) {
        uint loanId = getActiveLoanId(msg.sender); 
        if(loanId == (2**64 - 1)) return;
        Proposal pObj = proposalList[proposeId];
        if(pObj.loanId != loanId) return;
        Loan lObj = loanList[loanId];
        if(lObj.state == LoanState.LOCKED) return;

        if(newState == ProposalState.ACCEPTED) {
            // Do not allow loan collection to be more than predefined value
            if(lObj.collected + pObj.amount > lObj.amount) return;
            else proposalList[proposeId].state = newState;
            loanList[loanId].state = LoanState.LOCKED;
            loanList[loanId].collected = lObj.collected + pObj.amount;
        }
        else if(newState == ProposalState.WAITING){
            
        }
        else {

        }
    }

    function totalLoansBy(address borrower) constant returns(uint) {
        return loanMap[borrower].length;
    }

    function totalProposalsBy(address lender) constant returns(uint) {
        return lendMap[lender].length;
    }

    function getLoanDetailsById(uint loanId) constant returns(LoanState, uint, uint) {
        Loan obj = loanList[loanId];
        return (obj.state, obj.dueDate, obj.amount);
    }

    function getLoanDetailsByAddressPosition(address borrower, uint pos) constant returns(LoanState, uint, uint) {
        Loan obj = loanList[loanMap[borrower][pos]];
        return (obj.state, obj.dueDate, obj.amount);
    }

    function getLoanMapFor(address borrower) constant returns(uint[]) {
        return loanMap[borrower];
    }

    function getProposalDetailsByLoanIdPosition(uint loanId, uint numI) constant returns(ProposalState, uint, uint) {
        Proposal obj = proposalList[loanList[loanId].proposal[numI]];
        return (obj.state, obj.rate, obj.amount);
    }
}