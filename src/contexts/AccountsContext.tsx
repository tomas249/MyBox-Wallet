import React, { createContext, useContext, useState } from "react";
import { AccountRecord, AccountRecords } from "../definitions/Records";
import { calc } from "../utils";
import accounts from "../mocks/accounts.json";

type AddAccount = (newAccount: AccountRecord) => void;
type EditAccount = (updatedAccount: Partial<AccountRecord>) => void;
type DeleteAccount = (deletedAccountId: string) => void;
type CurrencyContextProps = {
  totalBalance: number;
  accounts: AccountRecords;
  accountsObj: { [key: AccountRecord["id"]]: AccountRecord };
  addAccount: AddAccount;
  editAccount: EditAccount;
  deleteAccount: DeleteAccount;
};

const AccountContext = createContext({} as CurrencyContextProps);

function fromArrayToObj(arr: AccountRecords, key: string) {
  return arr.reduce((obj, account) => ({ ...obj, [account.id]: account }), {});
}

function getAccounts() {
  const fromLocalStorage = JSON.parse(localStorage.getItem("accounts") || "false");
  const fromMock = accounts.rowData;

  return fromLocalStorage || fromMock || [];
}

const DEFAULT_CURRENCY = "EUR";
const CURRENCY = {
  EUR: 1,
  BGN: 1.95,
};

function calculateTotal(accounts: AccountRecords) {
  const value = accounts.reduce((total, account) => {
    const balance = account.balance;
    const currency = CURRENCY[account.currency as keyof typeof CURRENCY];
    const toAdd = balance / currency;
    const totalFinal = calc(total + toAdd);
    // calc(total + account.balance / CURRENCY[currencyCode])
    return totalFinal;
  }, 0);
  return { DEFAULT_CURRENCY, value };
}

export const AccountProvider: React.FunctionComponent = ({ children }) => {
  const loadedAccounts = getAccounts();
  const [accounts, setAccounts] = useState<AccountRecords>(loadedAccounts);
  const [totalBalance, setTotalBalance] = useState(calculateTotal(loadedAccounts).value);

  const addAccount: AddAccount = (newAccount) => {
    setAccounts((prevAccounts) => {
      const updated = [...prevAccounts, newAccount];
      setTotalBalance(calculateTotal(updated).value);
      return updated;
    });
  };

  const editAccount: EditAccount = (updatedAccount) => {
    setAccounts((prevAccounts) => {
      const updated = prevAccounts.map((account) =>
        account.id === updatedAccount.id ? { ...account, ...updatedAccount } : account,
      );
      setTotalBalance(calculateTotal(updated).value);
      return updated;
    });
  };

  const deleteAccount: DeleteAccount = (deletedAccountId: string) => {
    setAccounts((prevAccounts) => {
      const updated = prevAccounts.filter((account) => account.id !== deletedAccountId);
      setTotalBalance(calculateTotal(updated).value);
      return updated;
    });
  };

  return (
    <AccountContext.Provider
      value={{
        totalBalance,
        accounts,
        accountsObj: fromArrayToObj(accounts, "id"),
        addAccount,
        editAccount,
        deleteAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
