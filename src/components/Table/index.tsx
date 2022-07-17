import React, { useState } from "react";

import { FieldEditors } from "@definitions/FieldEditors";
import { TableProps, TableCellProps, RecordBase } from "./definitions";
import { generateId } from "../../utils";

const editorFields: {
  [key in FieldEditors["editorType"]]: (props: {
    newValue: string;
    onChange: (value: string) => void;
    placeholder?: string;
    editorProps?: FieldEditors["editorProps"];
  }) => JSX.Element;
} = {
  text: ({ newValue, onChange, placeholder }) => (
    <input
      type="text"
      value={newValue}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      autoFocus
      style={{
        marginTop: "auto",
        // width: `${newValue.length}ch`,
        border: 0,
        borderBottom: "2px solid black",
        padding: 0,
        outline: 0,
      }}
    />
  ),
  number: ({ newValue, onChange, placeholder }) => (
    <input
      type="number"
      value={newValue}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      autoFocus
      style={{
        marginTop: "auto",
        // width: `${newValue.length}ch`,
        border: 0,
        borderBottom: "2px solid black",
        padding: 0,
        outline: 0,
      }}
    />
  ),
  date: ({ newValue, onChange, placeholder }) => (
    <input
      type="date"
      value={newValue}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      autoFocus
      style={{
        marginTop: "auto",
        // width: `${newValue.length}ch`,
        border: 0,
        borderBottom: "2px solid black",
        padding: 0,
        outline: 0,
      }}
    />
  ),
  select: ({ newValue, onChange, editorProps }) => (
    <select value={newValue} onChange={(e) => onChange(e.target.value)}>
      {editorProps?.options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
};

function TableHeader<Record extends RecordBase>({
  columnDefs,
}: Pick<TableProps<Record>, "columnDefs">) {
  return (
    <tr>
      {columnDefs.map((columnDef, index) => (
        <th key={index}>{columnDef.headerName}</th>
      ))}
    </tr>
  );
}

function TableCell({ value, editorType, editorProps, actions = {} }: TableCellProps) {
  const [editMode, setEditMode] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const canEdit = !!actions.onEdit;

  return (
    <td style={{ position: "relative" }}>
      <div {...(canEdit && { onClick: () => setEditMode(true) })}>{value}</div>
      {editMode && (
        <div>
          <div
            style={{
              left: 0,
              bottom: 0,
              position: "absolute",
              zIndex: 2,
              display: "flex",
            }}
          >
            {editorFields[editorType]({ newValue, editorProps, onChange: setNewValue })}
            <button
              onClick={() => {
                setEditMode(false);
                actions.onEdit?.(newValue);
              }}
              style={{ paddingTop: 0, paddingBottom: 0, border: "1px solid black" }}
            >
              save
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setNewValue(value);
              }}
              style={{ paddingTop: 0, paddingBottom: 0, border: "1px solid black" }}
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </td>
  );
}

function TableData<Record extends RecordBase>({
  columnDefs,
  rowDefs,
  rowData,
}: TableProps<Record>) {
  type NewRecord = { [K in keyof Record]: string };
  const emptyRecord = columnDefs.reduce(
    (record, { field, defaultValue }) => ({
      ...record,
      [field]: typeof defaultValue === "undefined" ? "" : String(defaultValue),
    }),
    {} as NewRecord,
  );
  const emptyRecordDefault = columnDefs.reduce(
    (record, { field, defaultValue }) => ({
      ...record,
      ...(typeof defaultValue !== "undefined" && { [field]: defaultValue }),
    }),
    {} as Partial<Record>,
  );
  const [newRecord, setNewRecord] = useState<NewRecord>(emptyRecord);
  const [newRecordEdited, setNewRecordEdited] = useState(emptyRecordDefault);

  return (
    <>
      {rowDefs.actions?.onAdd && (
        <tr>
          {columnDefs.map(({ field, headerName, editorType, editorProps, actions = {} }, index) => (
            <td key={index}>
              {editorFields[editorType]({
                editorProps,
                newValue: newRecord[field],
                placeholder: headerName,
                onChange: (newValue) => {
                  setNewRecord((prevNewRecord) => ({
                    ...prevNewRecord,
                    [field]: newValue,
                  }));
                  setNewRecordEdited((prevNewRecord) => ({
                    ...prevNewRecord,
                    [field]: actions.onEdit?.(newValue) || newValue,
                  }));
                },
              })}
            </td>
          ))}
          <td>
            <button
              onClick={() => {
                rowDefs.actions?.onAdd?.({ ...newRecordEdited, id: generateId() } as Record);
                setNewRecord(emptyRecord);
                setNewRecordEdited(emptyRecordDefault);
              }}
            >
              Add
            </button>
          </td>
          <td>
            <button
              onClick={() => {
                setNewRecord(emptyRecord);
                setNewRecordEdited(emptyRecordDefault);
              }}
            >
              Clear
            </button>
          </td>
        </tr>
      )}
      {rowData
        .slice() // create a copy with .slice() because .reverse() is mutable
        .reverse()
        .map((row) => (
          <tr key={row.id}>
            {columnDefs.map(({ field, editorType, editorProps, actions = {} }, index) => (
              <TableCell
                key={index}
                value={String(row[field])}
                editorProps={editorProps}
                editorType={editorType}
                {...(actions.onEdit && {
                  actions: {
                    onEdit: (newValue) => {
                      const newValueEdited = actions.onEdit?.(newValue);
                      const updatedRecord = { ...row, [field]: newValueEdited };
                      rowDefs.actions?.onEdit?.(updatedRecord);
                    },
                  },
                })}
              />
            ))}
          </tr>
        ))}
    </>
  );
}

export function Table<Record extends RecordBase>({
  columnDefs,
  rowDefs,
  rowData,
}: TableProps<Record>) {
  return (
    <>
      <table style={{ borderSpacing: 12 }}>
        <thead>
          <TableHeader columnDefs={columnDefs} />
        </thead>
        <tbody>
          <TableData columnDefs={columnDefs} rowDefs={rowDefs} rowData={rowData} />
        </tbody>
      </table>
    </>
  );
}
