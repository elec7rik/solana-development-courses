//imports
//connection
// const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
// const PING_PROGRAM_DATA_ADDRESS = "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";
// convert strings to public keys
// create instruction
// add to tx
// send tx and log it

import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, clusterApiUrl, sendAndConfirmTransaction, } from "@solana/web3.js";
import "dotenv/config";
import { airdropIfRequired, getKeypairFromEnvironment } from "@solana-developers/helpers";

const connection = new Connection(clusterApiUrl("devnet"));

// keypair from .env
const payer = getKeypairFromEnvironment("SECRET_KEY");

// airdrop if required
// const newBalance = await airdropIfRequired(connection, payer.publicKey, LAMPORTS_PER_SOL, 0.1 * LAMPORTS_PER_SOL);

// programs to interact with
const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
const PING_PROGRAM_DATA_ADDRESS = "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";

const programId = new PublicKey(PING_PROGRAM_ADDRESS);
const pingProgramDataAddress = new PublicKey(PING_PROGRAM_DATA_ADDRESS);

const tx = new Transaction();
const instruction = new TransactionInstruction({
    keys: [
        {
            pubkey: pingProgramDataAddress,
            isSigner: false,
            isWritable: true,
        },
    ],
    programId,
});

tx.add(instruction);

const signature = await sendAndConfirmTransaction(connection, tx, [payer]);

console.log(`✅ Transaction signature: ${signature}`);