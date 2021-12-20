import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.DEPLOYED_ADDRESS || "";
  const endUser = new ethers.Wallet(process.env.END_USER_KEY || "");
  const otto = await ethers.getContractAt("Otto", contractAddress);
  const signingKey = new ethers.Wallet(process.env.SIGNER_KEY || "");
  const data = ethers.utils.defaultAbiCoder.encode(
    ["string", "address", "address"],
    ["hello world", contractAddress, endUser.address]
  );
  const hash = ethers.utils.arrayify(ethers.utils.keccak256(data));
  const signature = await signingKey.signMessage(hash);
  const sig = ethers.utils.joinSignature(signature);

  const result = await otto.connect(endUser).mintOid("hello world", sig);
  console.log(result);
  const balance = await otto.balanceOf(endUser.address);
  console.log(balance);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
