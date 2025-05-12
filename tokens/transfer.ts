import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import "dotenv/config";
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("SECRET_KEY");
const mintAddress = new PublicKey("CZ8SdghfAcx4muqu1v4XBkCgihYgoitEMeJ78FpEmCT8");
const MINOR_UNITS_PER_MAJOR_UNIT = Math.pow(10, 2);
const randomFrenFromDevnet = new PublicKey("CETDUg7tKivXWMkj9btRE1bQ7t4TR1N3GH6VUmLJWMRk");


// getting or retrieving own token account
const senderAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    mintAddress,
    user.publicKey,
)

// getting or creating fren's token account
const frenAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    mintAddress,
    randomFrenFromDevnet,
);

const amount = 0.69;

const signature = await transfer(
    connection,
    user,
    senderAssociatedTokenAccount.address,
    frenAssociatedTokenAccount.address,
    user,
    amount * MINOR_UNITS_PER_MAJOR_UNIT,
)

const link = getExplorerLink("transaction", signature, "devnet");

console.log(`🪙 ${amount} Tokens send to randomFrenFromDevnet`);
console.log(`✅ Check the transaction: ${link}`);