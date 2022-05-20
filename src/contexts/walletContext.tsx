import React, { createContext, useContext, useState } from 'react';
import Web3 from 'web3';

const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');

export interface IWalletContext {
  web3: Web3;
  accounts: string[];
  isMetaMaskInstalled: boolean;
  setAccounts?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const WalletContext = createContext<IWalletContext>({
  web3,
  isMetaMaskInstalled: window.ethereum && window.ethereum.isMetaMask,
  accounts: [],
});

type Props = {
  children: React.ReactNode;
};

const WalletProvider: React.FC<Props> = function ({ children }) {
  const { isMetaMaskInstalled } = useContext(WalletContext);
  const [accounts, setAccounts] = useState<string[]>([]);

  return (
    <WalletContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ web3, accounts, setAccounts, isMetaMaskInstalled }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
