import { mintTo } from "@solana/spl-token";
import "dotenv/config";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";

const MINOR_UNITS_PER_MAJOR_UNITS = 100;

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("SECRET_KEY");

const mint = new PublicKey("CZ8SdghfAcx4muqu1v4XBkCgihYgoitEMeJ78FpEmCT8");
const amount = 10 * MINOR_UNITS_PER_MAJOR_UNITS;
const destination = new PublicKey("H9Q3hH1dnodfNWmKp47hMWEFgWT9UVJJguysyoAf616S");

const tx = await mintTo(connection, user, mint, destination, user, amount);

console.log(`🪙 Minted ${amount} to ${destination}`);
console.log(`Check the transaction: ${ getExplorerLink("transaction", tx, "devnet")}`);