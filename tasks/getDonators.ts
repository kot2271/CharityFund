import { task } from "hardhat/config";
import { CharityFund } from "../typechain";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task("getDonators", "Get array of donators from contract")
  .addParam("contract", "CharityFund contract address")
  .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const charityFund: CharityFund = <CharityFund>(
        await hre.ethers.getContractAt("CharityFund", taskArgs.contract as string)
    );
    console.log("Getting donators...");
    const donators = await charityFund.getDonators();

    console.log("Donators:");
    donators.forEach(donator => {
      console.log(donator); 
    });
  });