'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { FC, useState } from 'react';
import styles from '../../app/styles/Home.module.css';
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
} from '@solana/spl-token';

export const CreateMintForm: FC = () => {
  const [txSig, setTxSig] = useState('');
  const [mintAddress, setMintAddress] = useState('');

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : '';
  };

  const createMint = async (event: any) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }

    // BUILD AND SEND CREATE MINT TRANSACTION HERE

    const mint = web3.Keypair.generate();

    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    const tx = new web3.Transaction();

    tx.add(
      web3.SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports: lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        0,
        publicKey,
        publicKey,
        TOKEN_PROGRAM_ID,
      ),
    );

    sendTransaction(
      tx,
      connection,
      {
        signers: [mint]
      }).then(
        (sig) => {
          setTxSig(sig);
          setMintAddress(mint.publicKey.toString())
        }
      );
    };

  return (
    <div>
      {publicKey ? (
        <form onSubmit={createMint} className={styles.form}>
          <button type="submit" className={styles.formButton}>
            Create Mint
          </button>
        </form>
      ) : (
        <span>Connect Your Wallet</span>
      )}
      {txSig ? (
        <div>
          <p>Token Mint Address: {mintAddress}</p>
          <p>View your transaction on </p>
          <a className={styles.link} href={link()}>
            Solana Explorer
          </a>
        </div>
      ) : null}
    </div>
  );
};
