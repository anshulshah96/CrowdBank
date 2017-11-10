pragma solidity ^0.4.4;
contract CrowdBank {
    
    address public owner;
    
    enum ProposalState {
        WAITING,
        ACCEPTED,
        REJECTED
    }

    struct Proposal {
        address lender;
        ProposalState state;
        uint rate;
        uint amount;
    }
    
    enum State {
        ACCEPTING,
        LOCKED,
        COMPLETEDSUCCESS,
        COMPLETEDFAIL
    }
    
    struct Loan {
        address borrower;
        State state;
        uint dueDate;
        uint amount;
        Proposal[] proposals;
    }

    mapping (address=>Loan[]) public LoanMap;
    mapping (address=>Proposal[]) public LendMap;

    function CrowdBank() {
        owner = msg.sender;
    }
    
    function newLoan(uint amount, uint dueDate) returns(bool) {
        uint validLoans = LoanMap[msg.sender].length;
        if(validLoans == 0 || (LoanMap[msg.sender][validLoans-1].state != State.ACCEPTING && LoanMap[msg.sender][validLoans-1].state != State.LOCKED))
        {
            Loan storage nLoan;
            nLoan.borrower = msg.sender;
            nLoan.state = State.ACCEPTING;
            nLoan.amount = amount;
            nLoan.dueDate = dueDate;
            LoanMap[msg.sender].push(nLoan);
            return true;
        }
        else
            return false;
    }
    
    function newProposal(address borrower, uint rate) payable returns(bool) {
        uint validLoans = LoanMap[borrower].length;
        if(validLoans == 0 || LoanMap[borrower][validLoans-1].state != State.ACCEPTING)
            return false;
        Proposal storage nProposal;
        nProposal.lender = msg.sender;
        nProposal.rate = rate;
        nProposal.state = ProposalState.WAITING;
        nProposal.amount = msg.value;

        LendMap[msg.sender].push(nProposal);
        LoanMap[borrower][validLoans-1].proposals.push(nProposal);
        return true;
    }
}