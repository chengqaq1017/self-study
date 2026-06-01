"use client";

import { useMemo, useState } from "react";
import { sortSubjectsByPinyin } from "@/lib/subjects";

export interface SubjectOption {
  id: string;
  name: string;
}

export function SubjectCombobox({
  subjects,
  name = "subjectId",
  value,
  inputValue,
  placeholder = "输入课程名称",
  allowCreate = false,
  required = false,
  onChange,
}: {
  subjects: SubjectOption[];
  name?: string;
  value?: string;
  inputValue?: string;
  placeholder?: string;
  allowCreate?: boolean;
  required?: boolean;
  onChange?: (subject: SubjectOption | null, typedName: string) => void;
}) {
  const sortedSubjects = useMemo(() => sortSubjectsByPinyin(subjects), [subjects]);
  const initialSubject = sortedSubjects.find((subject) => subject.id === value);
  const [selectedId, setSelectedId] = useState(value ?? "");
  const [query, setQuery] = useState(inputValue ?? initialSubject?.name ?? "");
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const list = normalized
      ? sortedSubjects.filter((subject) => subject.name.toLowerCase().includes(normalized))
      : sortedSubjects;
    return list;
  }, [query, sortedSubjects]);

  const exactMatch = sortedSubjects.find((subject) => subject.name === query.trim());
  const canCreate = allowCreate && query.trim() && !exactMatch;

  function selectSubject(subject: SubjectOption) {
    setSelectedId(subject.id);
    setQuery(subject.name);
    setOpen(false);
    onChange?.(subject, subject.name);
  }

  function handleInput(nextValue: string) {
    setQuery(nextValue);
    setOpen(true);
    const subject = sortedSubjects.find((item) => item.name === nextValue);
    setSelectedId(subject?.id ?? "");
    onChange?.(subject ?? null, nextValue);
  }

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selectedId} />
      {allowCreate && <input type="hidden" name="subjectName" value={query.trim()} />}
      <input
        type="text"
        required={required}
        value={query}
        onChange={(event) => handleInput(event.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder={placeholder}
        autoComplete="off"
      />

      {open && (matches.length > 0 || canCreate) && (
        <div className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-md border bg-white py-1 text-sm shadow-lg">
          {matches.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSubject(subject)}
              className="block w-full px-3 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-primary"
            >
              {subject.name}
            </button>
          ))}
          {canCreate && (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setSelectedId("");
                setQuery(query.trim());
                setOpen(false);
                onChange?.(null, query.trim());
              }}
              className="block w-full border-t px-3 py-2 text-left text-primary hover:bg-blue-50"
            >
              新增课程：{query.trim()}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
