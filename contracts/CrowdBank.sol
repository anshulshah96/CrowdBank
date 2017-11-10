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

    modifier hasNoActiveLoan() {
        uint validLoans = loanMap[msg.sender].length;
        require(validLoans != 0);
        Loan obj = loanList[loanMap[msg.sender][validLoans-1]];
        require(loanList[validLoans-1].state != LoanState.ACCEPTING);
        require(loanList[validLoans-1].state != LoanState.LOCKED);
        _;
    }
    
    function newLoan(uint amount, uint dueDate) hasNoActiveLoan {
        Loan storage nLoan;
        nLoan.borrower = msg.sender;
        nLoan.state = LoanState.ACCEPTING;
        nLoan.amount = amount;
        nLoan.dueDate = dueDate;
        nLoan.collected = 0;
        nLoan.proposalCount = 0;

        loanList.push(nLoan);
        loanMap[msg.sender].push(loanList.length-1);
    }

    function newProposal(uint loanId, uint rate) payable {
        if(loanList[loanId].borrower == 0 || loanList[loanId].state != LoanState.ACCEPTING)
            throw;
        //TODO: check condition where msg.value > loan amount : we should return the msg ether
        Proposal storage nProposal;
        nProposal.loanId = loanId;
        nProposal.rate = rate;
        nProposal.state = ProposalState.WAITING;
        nProposal.amount = msg.value;

        proposalList.push(nProposal);
        lendMap[msg.sender].push(proposalList.length-1);
    }

    function getActiveLoanId(address borrower) constant returns(uint) {
        uint numLoans = loanMap[borrower].length;
        if(numLoans == 0) return (2**256 - 1);
        uint lastLoanId = loanMap[borrower][numLoans-1];
        if(loanList[lastLoanId].state != LoanState.ACCEPTING) return (2**256 - 1);
        return lastLoanId;
    }

    function takeActionOnProposal(uint proposeId, ProposalState newState) {
        uint loanId = getActiveLoanId(msg.sender); 
        if(loanId == (2**256 - 1)) throw;
        Proposal pObj = proposalList[proposeId];
        if(pObj.loanId != loanId) throw;
        Loan lObj = loanList[loanId];
        if(lObj.state == LoanState.LOCKED) throw;

        if(newState == ProposalState.ACCEPTED) {
            // Do not allow loan collection to be more than predefined value
            if(lObj.collected + pObj.amount > lObj.amount) throw;
            else proposalList[proposeId].state = newState;
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

    function getLoanDetailsByAddressPosition(address borrower, uint pos) constant returns(LoanState, uint, uint) {
        Loan obj = loanList[loanMap[borrower][pos]];
        return (obj.state, obj.dueDate, obj.amount);
    }

    function getProposalDetailsByLoanIdPosition(uint loanId, uint numI) constant returns(ProposalState, uint, uint) {
        Proposal obj = proposalList[loanList[loanId].proposal[numI]];
        return (obj.state, obj.rate, obj.amount);
    }
}