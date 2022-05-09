import React, { createContext, useContext, useState } from 'react';

export interface IWalletContext {
  isMetaMaskInstalled: boolean;
  accounts?: string[];
  setAccounts?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const WalletContext = createContext<IWalletContext>({
  isMetaMaskInstalled: window.ethereum && window.ethereum.isMetaMask,
});

type Props = {
  children: React.ReactNode
}

const WalletProvider: React.FC<Props> = function({ children }) {
  const { isMetaMaskInstalled } = useContext(WalletContext);
  const [accounts, setAccounts] = useState<string[]>([]);

  return (
    <WalletContext.Provider value={{ accounts, setAccounts, isMetaMaskInstalled }}>
      {children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;