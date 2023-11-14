import { task } from "hardhat/config";
import { CharityFund } from "../typechain";
import { BigNumberish } from "ethers";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task("donate", "making donations to a contract")
    .addParam("contract", "CharityFund contract address")
    .addParam("value", "amount of donation")
    .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
        const charityFund: CharityFund = <CharityFund>(
            await hre.ethers.getContractAt("CharityFund", taskArgs.contract as string)
        );
        const etherValue: BigNumberish = hre.ethers.parseEther(taskArgs.value.toString());
        const initialContractBalance = await charityFund.getSumOfDonations();
        const initEthBalance = hre.ethers.formatEther(initialContractBalance);
        console.log(`Сurrent donations balance: ${initEthBalance} ETH`)

        await charityFund.donate({ value: etherValue });
        console.log("Your donation was successful!")

        const donators = await charityFund.getDonators();
        console.log("All donators: ");
        donators.forEach(donator => {
            console.log(donator); 
        });
        
        const donations = await charityFund.getSumOfDonations();
        const ethDonations = hre.ethers.formatEther(donations);
        console.log(`Total sum of donations: ${ethDonations} ETH`);
    });