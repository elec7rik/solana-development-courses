import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("mainnet-beta"));

// with public key supplied as an argument
const suppliedPublicKey = process.argv[2];
if (!suppliedPublicKey) {
    throw new Error("❌ Provide a public key to check the balance of");
}
const publicKey = new PublicKey(suppliedPublicKey);
if (!PublicKey.isOnCurve(publicKey.toBytes())) {
    throw new Error("❌ Invalid public key")
}
const balance = await connection.getBalance(publicKey);
console.log(`Sol balance at ${suppliedPublicKey} is ${balance/LAMPORTS_PER_SOL}`);
console.log(`✅ Finished`);