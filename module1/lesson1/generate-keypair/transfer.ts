// create conenction
// get keypair from args
// create tx run it

import { Connection, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

import "dotenv/config";

const connection = new Connection("http://api.devnet.solana.com");

const suppliedToKeypair = process.argv[2];
const toKeypair = new PublicKey(suppliedToKeypair);

const sender = getKeypairFromEnvironment("SECRET_KEY");
console.log(`✅ Keypair retrieved from .env`);

const tx = new Transaction();
const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: toKeypair,
    lamports: 5000
});
tx.add(sendSolInstruction);

const signature = await sendAndConfirmTransaction(
    connection,
    tx,
    [sender],
);

console.log(`Transaction signature: ${signature}`);