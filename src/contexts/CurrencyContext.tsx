import React, { createContext, useContext, useState } from "react";
import { Currencies } from "../definitions/Common";

type CurrencyContextProps = {
  currencies: Currencies;
  setCurrencies: React.Dispatch<React.SetStateAction<Currencies>>;
};
const CurrencyContext = createContext({} as CurrencyContextProps);

export const CurrencyProvider: React.FunctionComponent = ({ children }) => {
  const [currencies, setCurrencies] = useState<Currencies>([]);

  return (
    <CurrencyContext.Provider value={{ currencies, setCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
