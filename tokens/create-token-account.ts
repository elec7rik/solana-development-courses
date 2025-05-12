import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import "dotenv/config";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";

const connection = new Connection(clusterApiUrl("devnet"));

const user = getKeypairFromEnvironment("SECRET_KEY");
const tokenMintAccount = new PublicKey("CZ8SdghfAcx4muqu1v4XBkCgihYgoitEMeJ78FpEmCT8");

const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAccount,
    user.publicKey,
);

const link = getExplorerLink("address", associatedTokenAccount.address.toBase58(), "devnet");

console.log(`Associated Token Account has been created for ${user.publicKey}`);
console.log(`Associated Token Account Address: ${associatedTokenAccount.address.toBase58()}`);

console.log(`Check on Solana Explorer: ${link}`);