import { TransactionsTable } from "./TransactionsTable";
import { AccountsTable } from "./AccountsTable";

export function Manager() {
  return (
    <div>
      <h3>Accounts</h3>
      <AccountsTable />
      <br />
      <h3>Transactions</h3>
      <TransactionsTable />
    </div>
  );
}
