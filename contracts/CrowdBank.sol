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
        Proposal[] proposals;
    }
    
    Loan[] public CompletedLoan;
    
    mapping (address=>Loan) public LoanMap;
    
    function CrowdBank() {
        owner = msg.sender;
    }
    
    function newLoan(address borrower, State state, uint dueDate) returns(bool) {
        if(LoanMap[borrower].borrower != address(0x0)) return false;
        
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