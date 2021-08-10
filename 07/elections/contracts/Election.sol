//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Election {
  string public candidate;

  struct Candidate {
    uint id;
    string name;
    uint votes;
  }

  mapping(address => bool) public voters;
  mapping(uint => Candidate) public candidates;
  uint public candidatesCount;

  constructor() {
    add("The first Candidate");
    add("The second Candidate");
  }

  function add(string memory name) private {
    candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
    candidatesCount++;
  }

  function vote(uint id) external {
    require(!voters[msg.sender], 'Only Once');
    require (id < candidatesCount);
    voters[msg.sender] = true;
    candidates[id].votes++;

  }



}
