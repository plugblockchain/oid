// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre, { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run("compile");

  // We get the contract to deploy
  const signers = await ethers.getSigners();
  const Otto = await ethers.getContractFactory("Otto");
  const msgSigner = new ethers.Wallet(process.env.SIGNER_KEY || "");

  const otto = await Otto.connect(signers[0]).deploy(
    msgSigner.address,
    ethers.utils.parseEther("0.01"),
    ethers.utils.parseEther("0.01")
  );

  await otto.deployed();
  await otto.connect(signers[0]).setStatus(1);
  console.log("Otto deployed to:", otto.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
