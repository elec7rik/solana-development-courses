import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorMovieReviewProgram } from "../target/types/anchor_movie_review_program";
import { expect } from "chai";

describe("anchor-movie-review-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.anchorMovieReviewProgram as Program<AnchorMovieReviewProgram>;

  const movie = {
    rating: 4,
    title: "test-movie",
    description: "a great movie to test the program",
  };

  const [moviePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(movie.title),
     provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  // console.log(provider);

  it("movie review is added", async () => {
    const tx = await program
      .methods
      .addMovieReview(
        movie.rating, 
        movie.title, 
        movie.description
      ).rpc();
    // pda must have been created by the program using the above instruction data
    // and this data must have been stored at the a/c initialized at pda by the program
    // now we fetch on chain data using moviePda

    // compare on chain fetched a/c with the a/c we sent
    const account = await program.account.movieAccountState.fetch(moviePda);

    // comparison using expect
    expect(movie.rating === account.rating);
    expect(movie.title === account.title);
    expect(movie.description === account.description);
    expect(account.reviewer === provider.wallet.publicKey);
  });

  it("movie review is updated", async () => {
    const tx = await program.methods.updateMovieReview(
      5,
      movie.title,
      "new boring test-movie",
    ).rpc();
  
    const account = await program.account.movieAccountState.fetch(moviePda);
    console.log(account);

    // expect(movie.rating === 5);
    // expect(movie.title === account.title);
    // expect(movie.description === "new boring test-movie");
    // expect(account.reviewer === provider.wallet.publicKey);
  });

  it("movie review is deleted", async () => {
    const tx = await program.methods
    .deleteMovieReview(movie.title)
    .accounts({
      movieReview: moviePda, // must match Rust: pub movie_review
      reviewer: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
  });
});
