import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorStudentIntroProgram } from "../target/types/anchor_student_intro_program";


describe("anchor-student-intro-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider)

  const program = anchor.workspace.anchorStudentIntroProgram as Program<AnchorStudentIntroProgram>;

  const student = {
    name: "test-student",
    message: "test-message",
  };

  const [studentAccountPda] = anchor.web3.PublicKey
    .findProgramAddressSync(
      [
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(student.name),
      ],
      program.programId
    );

  it("should initialize a student_account PDA", async () => {
    const tx = await program.methods
      .createIntro(
        student.name,
        student.message
      )
      .rpc();
  });

  it("should update the student_account PDA", async () => {
    const tx = await program.methods
      .updateIntro(
        student.name,
        "UPDATED-MESSAGE",
      )
      .rpc();
  });

  it("should delete the student_account PDA", async () => {
    const tx = await program.methods
      .deleteIntro(
        student.name
      )
      .rpc();
  })
});
