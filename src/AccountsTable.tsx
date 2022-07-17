import { Table } from "./components/Table";
import { useAccount } from "./contexts/AccountsContext";
import { ColumnDefs } from "./components/Table/definitions";
import { AccountRecord } from "./definitions/Records";

export function AccountsTable() {
  const { totalBalance, accounts } = useAccount();

  const columnDefs: ColumnDefs<AccountRecord> = [
    {
      field: "name",
      headerName: "Name",
      editorType: "text",
    },
    {
      field: "currency",
      headerName: "Currency",
      editorType: "text",
    },
    {
      field: "balance",
      headerName: "Balance",
      editorType: "text",
    },
  ];

  return (
    <>
      <h3>Total balance: {totalBalance}</h3>
      <Table columnDefs={columnDefs} rowDefs={{}} rowData={accounts} />
    </>
  );
}
