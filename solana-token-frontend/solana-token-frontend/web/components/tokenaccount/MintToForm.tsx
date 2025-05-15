'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { FC, useState } from 'react';
import styles from '../../app/styles/Home.module.css';
import {
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
} from '@solana/spl-token';

export const MintToForm: FC = () => {
  const [txSig, setTxSig] = useState('');
  const [tokenAccount, setTokenAccount] = useState('');
  const [balance, setBalance] = useState('');
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : '';
  };

  const mintTo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const mintString = formData.get('mint') as string;
    const recipientString = formData.get('recipient') as string;
    const amountString = formData.get('amount') as string;

    let mintPubKey: web3.PublicKey;
    let recipientPubkey: web3.PublicKey;
    const amount = Number(amountString);

    try {
      mintPubKey = new web3.PublicKey(mintString);
      recipientPubkey = new web3.PublicKey(recipientString);
    } catch (err) {
      alert('Invalid public key(s).');
      return;
    }

    const associatedToken = await getAssociatedTokenAddress(
      mintPubKey,
      recipientPubkey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = new web3.Transaction();

    tx.add(
      createMintToInstruction(
        mintPubKey,
        associatedToken,
        publicKey,
        amount
      )
    );

    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, 'confirmed');

    setTxSig(signature);
    setTokenAccount(associatedToken.toString());

    const account = await getAccount(connection, associatedToken);
    setBalance(account.amount.toString());
  };

  return (
    <div>
      <br />
      {publicKey ? (
        <form onSubmit={mintTo} className={styles.form}>
          <label htmlFor="mint">Token Mint:</label>
          <input
            id="mint"
            name="mint"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Mint"
            required
          />
          <label htmlFor="recipient">Recipient:</label>
          <input
            id="recipient"
            name="recipient"
            type="text"
            className={styles.formField}
            placeholder="Enter Recipient PublicKey"
            required
          />
          <label htmlFor="amount">Amount Tokens to Mint:</label>
          <input
            id="amount"
            name="amount"
            type="number"
            className={styles.formField}
            placeholder="e.g. 100"
            required
          />
          <button type="submit" className={styles.formButton}>
            Mint Tokens
          </button>
        </form>
      ) : (
        <span>Connect Your Wallet</span>
      )}
      {txSig ? (
        <div>
          <p>Token Balance: {balance}</p>
          <p>View your transaction on</p>
          <a className={styles.link} href={link()}>
            Solana Explorer
          </a>
        </div>
      ) : null}
    </div>
  );
};
