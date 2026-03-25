import cls from "./UserLogsListItem.module.css";

import { useMemo, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";

import type { IUserLog } from "@/entities/user-logs";
import { formatDateTime } from "@/shared/lib/formater";
import {
  getLogEntityTitle,
  getLogObjectHref,
  getMethodLabel,
  getSerializerDisplayName,
} from "@/shared/lib/user-logs/userLogDisplay";

type UserLogsListItemProps = {
  log: IUserLog;
};

/** Формат полей в old_value / new_value (PATCH/PUT, DELETE — см. UserLoggingMixin._log_action). */
type LogChangeEntry = {
  field_name: string;
  value: unknown;
  verbose_name: string;
};

type LogChangeRow = {
  label: string;
  fieldName: string;
  was: string;
  now: string;
};

const parseLogChangeEntries = (raw: unknown): LogChangeEntry[] => {
  if (!Array.isArray(raw)) return [];
  const out: LogChangeEntry[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const o = item as Record<string, unknown>;
    const field_name =
      typeof o.field_name === "string"
        ? o.field_name
        : typeof o.fieldName === "string"
          ? o.fieldName
          : null;
    if (field_name === null) continue;
    const vn = o.verbose_name ?? o.verboseName;
    const verbose_name = typeof vn === "string" ? vn : field_name;
    out.push({
      field_name,
      value: o.value,
      verbose_name,
    });
  }
  return out;
};

const parseObjectSnapshot = (obj: Record<string, unknown>): LogChangeEntry[] =>
  Object.entries(obj)
    .filter(([key]) => key !== "password")
    .map(([field_name, value]) => ({
      field_name,
      value,
      verbose_name: field_name,
    }));

/** Снимок DELETE: массив из бэкенда или плоский объект. */
const parseLogSnapshotPayload = (raw: unknown): LogChangeEntry[] => {
  let data: unknown = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw) as unknown;
    } catch {
      return [];
    }
  }
  if (Array.isArray(data)) {
    return parseLogChangeEntries(data);
  }
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    return parseObjectSnapshot(data as Record<string, unknown>);
  }
  return [];
};

const formatLogCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const buildUpdateChangeRows = (oldRaw: unknown, newRaw: unknown): LogChangeRow[] => {
  const oldEntries = parseLogChangeEntries(oldRaw);
  const newEntries = parseLogChangeEntries(newRaw);
  const oldByField = new Map(oldEntries.map((e) => [e.field_name, e]));
  const newByField = new Map(newEntries.map((e) => [e.field_name, e]));

  const fieldNames = new Set<string>([
    ...oldEntries.map((e) => e.field_name),
    ...newEntries.map((e) => e.field_name),
  ]);

  return [...fieldNames].map((fieldName) => {
    const oldEntry = oldByField.get(fieldName);
    const newEntry = newByField.get(fieldName);
    const label = oldEntry?.verbose_name || newEntry?.verbose_name || fieldName;
    return {
      label,
      fieldName,
      was: formatLogCellValue(oldEntry?.value),
      now: formatLogCellValue(newEntry?.value),
    };
  });
};

const isUpdateMethod = (method: string): boolean => {
  const u = method.toUpperCase();
  return u === "PATCH" || u === "PUT";
};

const isDeleteMethod = (method: string): boolean => (method ?? "").toUpperCase() === "DELETE";

const hasUpdateDiff = (oldRaw: unknown, newRaw: unknown): boolean => {
  const oldEntries = parseLogChangeEntries(oldRaw);
  const newEntries = parseLogChangeEntries(newRaw);
  return oldEntries.length > 0 || newEntries.length > 0;
};

type LogSnapshotRow = {
  label: string;
  fieldName: string;
  value: string;
};

const buildLogSnapshotRowsFromEntries = (entries: LogChangeEntry[]): LogSnapshotRow[] =>
  entries.map((e) => ({
    label: e.verbose_name || e.field_name,
    fieldName: e.field_name,
    value: formatLogCellValue(e.value),
  }));

type LogSnapshotFieldsTableProps = {
  rows: LogSnapshotRow[];
};

const LogSnapshotFieldsTable = ({ rows }: LogSnapshotFieldsTableProps) => (
  <div className={cls.changesTableWrap}>
    <table className={cls.changesTable}>
      <thead>
        <tr>
          <th className={cls.changesTh}>Поле</th>
          <th className={cls.changesTh}>Значение</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.fieldName} className={cls.changesTr}>
            <td className={cls.changesTd}>{row.label}</td>
            <td className={cn(cls.changesTd, cls.changesTdValue, cls.deleteSnapshotValue)}>
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const methodClassName = (method: string) => {
  switch (method.toUpperCase()) {
    case "POST":
      return cls.methodPost;
    case "PATCH":
      return cls.methodPatch;
    case "PUT":
      return cls.methodPut;
    case "DELETE":
      return cls.methodDelete;
    default:
      return cls.methodDefault;
  }
};

export const UserLogsListItem = ({ log }: UserLogsListItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const href = getLogObjectHref(log);
  const entityTitle = getLogEntityTitle(log);
  const idPart = log.object_id != null ? ` · ID ${log.object_id}` : "";

  const showChanges = isUpdateMethod(log.method) && hasUpdateDiff(log.old_value, log.new_value);
  const changeRows = useMemo(
    () => (showChanges ? buildUpdateChangeRows(log.old_value, log.new_value) : []),
    [log.old_value, log.new_value, showChanges],
  );

  const deleteSnapshotEntries = useMemo(() => {
    if (!isDeleteMethod(log.method ?? "")) return [];
    return parseLogSnapshotPayload(log.old_value);
  }, [log.method, log.old_value]);

  const showDeleteSnapshot = deleteSnapshotEntries.length > 0;
  const deleteSnapshotRows = useMemo(
    () => buildLogSnapshotRowsFromEntries(deleteSnapshotEntries),
    [deleteSnapshotEntries],
  );

  return (
    <div className={cls.item}>
      <div className={cls.itemHeader}>
        <p className={cn(cls.methodTitle, methodClassName(log.method))}>
          {getMethodLabel(log.method)}
        </p>
        <p className={cls.date}>{formatDateTime(log.date)}</p>
      </div>
      <div className={cls.itemBody}>
        <p className={cls.meta}>
          {href ? (
            <Link className={cls.entityLink} to={href}>
              {entityTitle}
              {idPart}
            </Link>
          ) : (
            <>
              {entityTitle}
              {idPart}
            </>
          )}
        </p>
        {log.serializer_class && !getSerializerDisplayName(log.serializer_class) ? (
          <p className={cls.serializer}>{log.serializer_class}</p>
        ) : null}
        {showChanges && changeRows.length > 0 ? (
          <div className={cls.changesSection}>
            <button
              type="button"
              className={cls.expandBtn}
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded((v) => !v)}
            >
              {isExpanded ? "Свернуть детали" : "Показать изменения"}
            </button>
            {isExpanded ? (
              <div className={cls.changesTableWrap}>
                <table className={cls.changesTable}>
                  <thead>
                    <tr>
                      <th className={cls.changesTh}>Поле</th>
                      <th className={cls.changesTh}>Было</th>
                      <th className={cls.changesTh}>Стало</th>
                    </tr>
                  </thead>
                  <tbody>
                    {changeRows.map((row) => (
                      <tr key={row.fieldName} className={cls.changesTr}>
                        <td className={cls.changesTd}>{row.label}</td>
                        <td className={cn(cls.changesTd, cls.changesTdValue)}>{row.was}</td>
                        <td className={cn(cls.changesTd, cls.changesTdValue)}>{row.now}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        ) : null}
        {showDeleteSnapshot ? (
          <div className={cls.changesSection}>
            <button
              type="button"
              className={cls.expandBtn}
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded((v) => !v)}
            >
              {isExpanded ? "Свернуть детали" : "Данные удалённого объекта"}
            </button>
            {isExpanded ? <LogSnapshotFieldsTable rows={deleteSnapshotRows} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
