pragma solidity ^0.4.4;
contract CrowdBank {
    
    address public owner;
    
    struct Proposal {
        address lender;
        uint rate;
        uint amount;
    }
    
    enum State {
        Accepting,
        Locked,
        CompletedSuccess,
        CompletedFail
    }
    
    struct Loan {
        address borrower;
        State state;
        uint dueDate;
        uint amount;
        Proposal[] proposals;
    }
    
    Loan[] public CompletedLoan;
    
    mapping (address=>Loan) public LoanMap;
    
    function CrowdBank() {
        owner = msg.sender;
    }
    
    function newLoan(uint amount, uint dueDate) returns(bool) {
        if(LoanMap[msg.sender].borrower != address(0x0)) return false;
        Loan memory newLoan;
        newLoan.borrower = msg.sender;
        newLoan.state = State.Accepting;
        newLoan.amount = amount;
        newLoan.dueDate = dueDate;
        LoanMap[msg.sender] = newLoan;
        return true;
    }
    
    function newProposal(address borrower, uint rate, uint amount) returns(bool) {
        if(LoanMap[borrower].borrower == address(0x0)) return false;
        Proposal memory newProposal;
        newProposal.lender = msg.sender;
        newProposal.rate = rate;
        newProposal.amount = amount;
        LoanMap[borrower].proposals.push(newProposal);
        return true;
    }
    
    
}