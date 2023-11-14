import { task } from "hardhat/config";
import { CharityFund } from "../typechain";
import { BigNumberish } from "ethers";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";


task("sendHelp", "Transfer ether from contract to recipient")
  .addParam("contract", "CharityFund contract address")
  .addParam("recipient", "Address to send ether") 
  .addParam("amount", "Amount in ether")
  .setAction(async (taskArgs: TaskArguments, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const charityFund: CharityFund = <CharityFund>(
        await hre.ethers.getContractAt("CharityFund", taskArgs.contract as string)
    );
    const recipient = taskArgs.recipient;
    const amount = hre.ethers.parseEther(taskArgs.amount);

    const initRecipientBalance: BigNumberish = await hre.ethers.provider.getBalance(recipient);
    console.log(`Initial recipient balance: ${initRecipientBalance} wei`);

    await charityFund.sendHelp(recipient, amount);

    const newRecipientBalance: BigNumberish = await hre.ethers.provider.getBalance(recipient);
    console.log(`New recipient balance: ${newRecipientBalance} wei`);

    const diff = newRecipientBalance - initRecipientBalance;
    const ethDiff = hre.ethers.formatEther(diff);
    console.log(`Ether sent: ${ethDiff} ETH`);
  });