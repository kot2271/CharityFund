import { task } from "hardhat/config";
import { CharityFund } from "../typechain";
import { BigNumberish } from "ethers";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task("getSumOfDonations", "Get total donations amount")
  .addParam("contract", "CharityFund contract address")
  .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const charityFund: CharityFund = <CharityFund>(
        await hre.ethers.getContractAt("CharityFund", taskArgs.contract as string)
    );
    console.log("Getting total donations...");
    const donations: BigNumberish = await charityFund.getSumOfDonations();
    
    const ethDonations = hre.ethers.formatEther(donations);
    console.log(`Total donations: ${ethDonations} ETH`);
  });