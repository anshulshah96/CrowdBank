pragma solidity ^0.4.4;
contract Mortgage {
    
  address public owner;

  mapping (bytes32=>address[]) public ownerMap;

  function Mortgage() {
      owner = msg.sender;
  }
  
  function addData(bytes32 document) {
    address[] owners = ownerMap[document];
    for(uint i=0;i<owners.length; i++)
    {
      if(owners[i] == msg.sender)
        return;
    }
    ownerMap[document].push(msg.sender);
  }
  
  function getOwnerCount(bytes32 hash) constant returns(uint) {
    return ownerMap[hash].length;
  }
  
  function getOwnerByPosition(bytes32 hash,uint index) constant returns(address) {
    return ownerMap[hash][index];
  }
  
  
}