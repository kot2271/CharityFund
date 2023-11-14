import { ethers } from "hardhat";
import { CharityFund } from "../typechain";
import { CharityFund__factory } from "../typechain";
import { verify } from "./helpers/verify";
import { delay } from "./helpers/delay";


async function deploy(): Promise<void> {

  const conractName: string = "CharityFund";

  const charityFundFactory: CharityFund__factory = <CharityFund__factory>(
    await ethers.getContractFactory("CharityFund")
  );

  const charityFund: CharityFund = <CharityFund>(
    await charityFundFactory.deploy()
  );

  await charityFund.waitForDeployment();

  const contractAddress = await charityFund.getAddress();

  console.log(`Contract ${conractName} deployed at: ${contractAddress}`)
  await delay(20000);
  await verify(contractAddress, conractName, [])
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
