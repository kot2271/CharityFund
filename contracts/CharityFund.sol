// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract CharityFund {
    mapping (address => uint256) private donations;
    address[] private donators;
    address private immutable owner;

    error NotOwner();
    error DonationsNotEnough(uint256 requested, uint256 available);

    constructor() {
        owner = msg.sender;
    }

    /**
     * Function for making donations to a contract.
     * Checks if the donation is greater than '0'.
     * Adds the address of the donator to the array of those who donated to the contract.
     * Stores information about the amount of donations from a particular user.
     */
    function donate() external payable {
        if (msg.value == 0) revert DonationsNotEnough({requested: 1, available: 0});
        if (donations[msg.sender] == 0) {
            donators.push(msg.sender);
        }
        donations[msg.sender] += msg.value;
    }

    /**
     * Function for transferring funds from a contract to another address.
     * Called only by the owner of the contract.
     * Checks if there are enough funds on the contract to send.
     * Sends the 'amount' of ether to the 'to' address.
     */
    function sendHelp(address to, uint256 amount) external {
        if (msg.sender != owner) revert NotOwner();
        uint balance = address(this).balance;
        if (balance < amount) revert DonationsNotEnough({requested: amount, available: balance});
        payable(to).transfer(amount);
    }

    receive() external payable {

    }

    /**
     * A function that returns an array of addresses of all donors.
     */
    function getDonators() external view returns (address[] memory) {
        return donators;
    }

    /**
     * The function returns the sum of all donations for the whole time
     */
    function getSumOfDonations() external view returns (uint256) {
        uint256 totalDonations;

        for (uint i = 0; i < donators.length; i++) {
            totalDonations += donations[donators[i]]; 
        }

        return totalDonations;
    }
}