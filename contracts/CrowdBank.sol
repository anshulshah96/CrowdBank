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

    mapping (address=>Loan) public LoanMap;
    
    function CrowdBank() {
        owner = msg.sender;
    }
    
    
    
}