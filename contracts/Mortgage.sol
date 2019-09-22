pragma solidity ^0.5.0;
contract Mortgage {
    
  address public owner;

  mapping (bytes32=>address[]) public ownerMap;
  mapping (address=>bytes32[]) public mortgageMap;

  constructor() public {
      owner = msg.sender;
  }
  
  function addData(bytes32 document) public {
    address[] storage owners = ownerMap[document];
    uint i;
    for(i=0;i<owners.length; i++)
    {
      if(owners[i] == msg.sender)
        return;
    }
    ownerMap[document].push(msg.sender);
    uint count = mortgageMap[msg.sender].length;
    for(i=0;i<count; i++)
    {
      if(mortgageMap[msg.sender][i] == document)
        return;
    }
    mortgageMap[msg.sender].push(document);
  }

  function getMortgageCount(address person) public view returns(uint) {
    return mortgageMap[person].length;
  }

  function getOwnerCount(bytes32 hash) public view returns(uint) {
    return ownerMap[hash].length;
  }
  
  function getOwnerByPosition(bytes32 hash,uint index) public view returns(address) {
    return ownerMap[hash][index];
  }
  
  
}
