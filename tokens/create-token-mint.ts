import "dotenv/config";
import { createMint } from "@solana/spl-token";
import {
    getKeypairFromEnvironment,
    getExplorerLink
} from "@solana-developers/helpers";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = getKeypairFromEnvironment("SECRET_KEY");

console.log("🔑 Keypair loaded from .env");
console.log("🔑 Public Key is: `${user.publicKey.toBase58()}`");

const tokenMint = await createMint(connection, user, user.publicKey, null, 2);
const link = await getExplorerLink("address", tokenMint.toString(), "devnet");

console.log(`✅ Created token mint: ${link}`);