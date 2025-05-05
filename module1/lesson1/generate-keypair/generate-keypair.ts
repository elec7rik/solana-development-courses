// LAB-1 => Cryptography and the Solana Network

// import { Keypair } from "@solana/web3.js";

// logic to generate keypair is commented out after saving the key to .env

// const keypair = Keypair.generate();
// console.log("✅ Keypair generated")

// console.log("✨ Public key is : {}", keypair.publicKey.toBase58());
// console.log("✨ Secret key is : {}", keypair.secretKey);

// getting the keypair from env using solana-developers/helpers
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
const keypair = getKeypairFromEnvironment("SECRET_KEY");
console.log("✅ Got the keypair from .env");
console.log("✨ Public key is : {}", keypair.publicKey.toBase58());