import { expect } from "chai";
import { ethers } from "hardhat";
import { CharityFund } from "../../typechain";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"


describe("CharityFund unit tests", function () {
    let charityFund: CharityFund;
    let deployer: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let signers: SignerWithAddress[];
  
    beforeEach(async function () {
      // Get the ContractFactory and Signers here.
      const CharityFundFactory = await ethers.getContractFactory("CharityFund");
      signers = await ethers.getSigners();
      deployer = signers[0];
      user1 = signers[1];
      user2 = signers[2];
  
      charityFund = await CharityFundFactory.connect(deployer).deploy();
      await charityFund.waitForDeployment();
    });
  
    describe("Deployment", function () {

        it("should be deploy correctly", async () => {
            expect(await charityFund.getAddress()).to.properAddress;
        });
    });

    describe("donate", function () {

        it("should add donator when donating for the first time", async () => {
            const oneEther = ethers.parseEther("1");
            expect(await charityFund.connect(user1).donate({value: oneEther}));
        
            const donators = await charityFund.getDonators();
            expect(donators.length).to.equal(1);
            expect(donators[0]).to.equal(user1.address);
        });

        it("should increase donation amount for existing donator", async () => {
            const threeEther = ethers.parseEther("3");
            await charityFund.connect(user1).donate({value: threeEther});
        
            const donations = await charityFund.getSumOfDonations();
            expect(donations).to.equal(threeEther);
        });

        it("should revert when donating 0 eth", async () => {
            await expect(charityFund.connect(user1).donate({value: 0}))
                .to.be.revertedWithCustomError(charityFund, "DonationsNotEnough");
        });
    });

    describe("getDonators", function () {

        it("should return empty array when no donator", async () => {
            expect(await charityFund.getDonators()).to.deep.equal([]);
        });

        it("should return array of donator addresses", async () => {
            const oneEther = ethers.parseEther("1");
            await charityFund.connect(user1).donate({value: oneEther});
            await charityFund.connect(user2).donate({value: oneEther});
        
            const donators = await charityFund.getDonators();
            expect(donators).to.deep.equal([user1.address, user2.address]);
        });
    });

    describe("getSumOfDonations", function () {

        it("the donation amount should be increased for existing donators", async () => {
            const oneEther = ethers.parseEther("1");
            const twoEther = ethers.parseEther("2");
            await charityFund.connect(user1).donate({value: oneEther});
            await charityFund.connect(user2).donate({value: twoEther});
        
            const threeEther = ethers.parseEther("3");
            const donations = await charityFund.getSumOfDonations();
            expect(donations).to.equal(threeEther);
        });
    });

    describe('sendHelp', () => {

        const oneEther = ethers.parseEther("1");
        const tenEther = ethers.parseEther("10");

        beforeEach(async () => {
          await charityFund.connect(user1).donate({value: tenEther});
        });
      
        it('should revert when called by non-owner', async () => {
            await expect(charityFund.connect(user1).sendHelp(user2.address, oneEther))
                .to.be.revertedWithCustomError(charityFund, 'NotOwner'); 
        });
      
        it('should transfer ether to recipient', async () => {
            const initialBalance = await ethers.provider.getBalance(user2.address);
          
            await charityFund.connect(deployer).sendHelp(user2.address, oneEther);
          
            expect(await ethers.provider.getBalance(user2.address)).to.equal(initialBalance + oneEther);
        });
      
        it('should decrease contract balance', async () => {
            const initialContractBalance = await ethers.provider.getBalance(charityFund.getAddress());
          
            await charityFund.connect(deployer).sendHelp(user2.address, oneEther);
      
            expect(await ethers.provider.getBalance(charityFund.getAddress())).to.equal(initialContractBalance - oneEther);
        });
      
        it('should revert when amount exceeds contract balance', async () => {
            await expect(
                charityFund.connect(deployer).sendHelp(user2.address, (tenEther + oneEther))
            ).to.be.revertedWithCustomError(charityFund, 'DonationsNotEnough');
        });
      
    });

    describe("receive", function () {
        it("should increase contract balance when receiving ETH", async () => {
            const oneEther = ethers.parseEther("1");
            const initialBalance = await ethers.provider.getBalance(charityFund.getAddress());
            await user1.sendTransaction({
              to: charityFund.getAddress(),
              value: oneEther
            });
        
            expect(await ethers.provider.getBalance(charityFund.getAddress())).to.equal(initialBalance + oneEther);
        });
    });
});