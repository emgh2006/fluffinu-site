

import React, { useEffect, useMemo, useState } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  getAccount
} from '@solana/spl-token';
import '@solana/wallet-adapter-react-ui/styles.css';

const FLUF_TOKEN_MINT = 'xOw36LBCliJQj5OONV6q7r2H'; // Replace with real token mint if needed

const TokenBalance = () => {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) return;
      try {
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const tokenMint = new PublicKey(FLUF_TOKEN_MINT);
        const ata = getAssociatedTokenAddressSync(tokenMint, publicKey);
        const tokenAccount = await getAccount(connection, ata);
        setBalance(Number(tokenAccount.amount) / 1e9);
      } catch (err) {
        console.error('Error fetching token balance:', err);
        setBalance(0);
      }
    };

    if (connected) fetchBalance();
  }, [connected, publicKey]);

  return connected ? (
    <p>Your FLUF Balance: <strong>{balance ?? '...'}</strong></p>
  ) : (
    <p>Connect your wallet to view FLUF balance.</p>
  );
};

const App = () => {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <nav>
            <a href="#about">About</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#tokenomics">Tokenomics</a>
          </nav>

          <section id="hero" style={{ marginTop: '60px', textAlign: 'center' }}>
            <h1>🚀 FluffInu (FLUF)</h1>
            <WalletMultiButton />
            <TokenBalance />
            <p style={{ fontSize: '0.9em' }}>
              Token Mint: <code>{FLUF_TOKEN_MINT}</code>
            </p>
          </section>

          <section id="about">
            <h2>🐶 About FluffInu</h2>
            <p>
              FluffInu is the softest bark in the blockchain! Born on Solana, FLUF is a meme-powered token
              built for fun, community, and a little bit of chaos.
            </p>
          </section>

          <section id="roadmap">
            <h2>🛣 Roadmap</h2>
            <ul>
              <li>✅ Launch token</li>
              <li>🚀 Website live</li>
              <li>🖼 NFT minting</li>
              <li>💰 Staking rewards</li>
              <li>📈 CEX listings</li>
            </ul>
          </section>

          <section id="tokenomics">
            <h2>📊 Tokenomics</h2>
            <ul>
              <li>Total Supply: 1,000,000,000 FLUF</li>
              <li>50% Liquidity Pool</li>
              <li>20% Community Airdrops</li>
              <li>15% Team (vested)</li>
              <li>10% Staking Rewards</li>
              <li>5% Marketing</li>
            </ul>
          </section>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
