'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { FC, useState } from 'react';
import styles from '../../app/styles/Home.module.css';

import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';

export const CreateTokenAccountForm: FC = () => {
  const [txSig, setTxSig] = useState('');
  const [tokenAccount, setTokenAccount] = useState('');
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : '';
  };

  const createTokenAccount = async (event: any) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }
    // BUILD AND SEND CREATE TOKEN ACCOUNT TRANSACTION HERE
    const tx = new web3.Transaction();
    const owner = new web3.PublicKey(event.target.owner.value);
    const mint = new web3.PublicKey(event.target.mint.value);

    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    tx.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedToken,
        owner,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      ),
    );

    sendTransaction(tx, connection,)
    .then((sig) => {
      setTxSig(sig);
      setTokenAccount(associatedToken.toString());
    });
  };

  return (
    <div>
      <br />
      {publicKey ? (
        <form onSubmit={createTokenAccount} className={styles.form}>
          <label htmlFor="owner">Token Mint:</label>
          <input
            id="mint"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Mint"
            required
          />
          <label htmlFor="owner">Token Account Owner:</label>
          <input
            id="owner"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Account Owner PublicKey"
            required
          />
          <button type="submit" className={styles.formButton}>
            Create Token Account
          </button>
        </form>
      ) : (
        <span></span>
      )}
      {txSig ? (
        <div>
          <p>Token Account Address: {tokenAccount}</p>
          <p>View your transaction on </p>
          <a className={styles.link} href={link()}>
            Solana Explorer
          </a>
        </div>
      ) : null}
    </div>
  );
};
