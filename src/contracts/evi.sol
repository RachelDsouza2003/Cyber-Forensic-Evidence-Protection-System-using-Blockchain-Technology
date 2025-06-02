// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvidenceChain {
    string public cid;

    function uploadEvidence(string memory _cid) public {
        cid = _cid;
    }

    function getEvidence() public view returns (string memory) {
        return cid;
    }
}
