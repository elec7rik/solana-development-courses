import * as anchor from "@coral-xyz/anchor";
import { AnchorStudentIntroProgram } from "../target/types/anchor_student_intro_program";
import * as dotenv from "dotenv";
dotenv.config();

const main = async () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.anchorStudentIntroProgram as anchor.Program<AnchorStudentIntroProgram>;

    // updated student message
    // name should be the same to access the created PDA
    const name = "student-on-devnet";
    const newMessage = "update: it's all lies";

    // PDA derivation
    const [studentPda] = anchor
        .web3
        .PublicKey
        .findProgramAddressSync(
            [
                provider.wallet.publicKey.toBuffer(),
                Buffer.from(name),
            ],
            program.programId
        );
    
    console.log("student PDA: ", studentPda.toBase58());

    // sending the transaction
    const tx = await program.methods.updateIntro(
        name,
        newMessage,
    ).rpc();

    console.log("Transaction signature: ", tx);

    // fetching and logging on-chain account data
    const account = await program.account.studentAccount.fetch(studentPda);
    console.log("Updated On-chain Student Account data: ", account);
};

main().catch((err) => {
    console.error("Error running client script", err);
});