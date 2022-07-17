import { useEffect, useState } from "react";

import { Table } from "./components/Table";
import { ColumnDefs, RowDefs, RowData } from "./components/Table/definitions";
import { useAccount } from "./contexts/AccountsContext";
import { AccountRecord, TransactionRecord } from "./definitions/Records";
import { calc } from "./utils";
import transactions from "./mocks/transactions.json";

function getTransactions() {
  const fromLocalStorage = JSON.parse(localStorage.getItem("transactions") || "false");
  // const fromMock = transactions.rowData;
  const fromMock = false;

  return fromLocalStorage || fromMock || [];
}

function setTransactions(newTransactions: RowData<TransactionRecord>) {
  const parsed = JSON.stringify(newTransactions);
  localStorage.setItem("transactions", parsed);
}

export function TransactionsTable() {
  const [rowData, setRowData] = useState<RowData<TransactionRecord>>(getTransactions());
  const { accounts, accountsObj, editAccount } = useAccount();

  function updateAccountBalance(accountId: string, difference: number) {
    const account = accountsObj[accountId];
    const newBalance = calc(account.balance + difference);
    editAccount({ id: accountId, balance: newBalance });
  }

  useEffect(() => {
    const availableAccounts = Object.keys(accountsObj);
    const updatedAccounts = rowData.reduce(
      (updatedAccounts, record) => {
        if (availableAccounts.includes(record.account)) {
          const account = updatedAccounts[record.account];
          return {
            ...updatedAccounts,
            [account.id]: { ...account, balance: calc(account.balance + record.amount) },
          };
        } else {
          return updatedAccounts;
        }
      },
      { ...accountsObj },
    );
    console.log(updatedAccounts);
  }, []);

  function mapAccountToSelectFieldEditor(account: AccountRecord) {
    return {
      label: account.name,
      value: account.id,
    };
  }

  const columnDefs: ColumnDefs<TransactionRecord> = [
    {
      field: "date",
      headerName: "Date",
      defaultValue: new Date().toISOString().substring(0, 10),
      editorType: "date",
      actions: {
        onEdit: (updatedValue) => updatedValue,
      },
    },
    {
      field: "account",
      headerName: "Account",
      editorType: "select",
      editorProps: {
        options: accounts.map(mapAccountToSelectFieldEditor),
      },
      actions: {
        onEdit: (updatedValue) => updatedValue,
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      editorType: "number",
      parse: (value) => calc(parseFloat(value)),
      actions: {
        onEdit: (updatedValue) => calc(parseFloat(updatedValue)),
      },
    },
    {
      field: "description",
      headerName: "Description",
      editorType: "text",
      parse: (value) => value.trim(),
      isValid: (value) => !!value,
      actions: {
        onEdit: (updatedValue) => updatedValue.trim(),
      },
    },
  ];

  const rowDefs: RowDefs<TransactionRecord> = {
    actions: {
      onEdit: (updatedRecord) => {
        updateAccountBalance(updatedRecord.account, updatedRecord.amount);
        setRowData((prevRowData) => {
          const updated = prevRowData.map((record) =>
            record.id === updatedRecord.id ? updatedRecord : record,
          );
          setTransactions(updated);
          return updated;
        });
      },
      onAdd: (newRecord) => {
        updateAccountBalance(newRecord.account, newRecord.amount);
        setRowData((prevRowData) => {
          const updated = [...prevRowData, newRecord];
          setTransactions(updated);
          return updated;
        });
      },
      onDelete: (deletedRecord) => {
        updateAccountBalance(deletedRecord.account, -deletedRecord.amount);
        setRowData((prevRowData) => {
          const updated = prevRowData.filter((record) => record.id !== deletedRecord.id);
          setTransactions(updated);
          return updated;
        });
      },
    },
  };

  return <Table<TransactionRecord> columnDefs={columnDefs} rowDefs={rowDefs} rowData={rowData} />;
}
