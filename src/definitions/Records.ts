import { RecordBase } from "./Common";

export type TransactionRecord = RecordBase & {
  date: string;
  account: string;
  amount: number;
  description: string;
  tags: string[];
};
export type TransactionRecords = TransactionRecord[];

export type AccountRecord = {
  id: string;
  name: string;
  currency: string;
  balance: number;
};
export type AccountRecords = AccountRecord[];
