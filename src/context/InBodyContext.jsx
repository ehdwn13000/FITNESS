import { createContext, useContext, useEffect, useState } from "react";
import * as inbodyStore from "../data/inbodyStore";

const InBodyContext = createContext(null);

export function InBodyProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function refresh() {
    const data = await inbodyStore.listRecords();
    setRecords(data);
  }

  useEffect(() => {
    let cancelled = false;
    inbodyStore.listRecords().then((data) => {
      if (cancelled) return;
      setRecords(data);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function addRecord(record) {
    setIsSaving(true);
    try {
      await inbodyStore.addRecord(record);
      await refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function updateRecord(id, updates) {
    setIsSaving(true);
    try {
      await inbodyStore.updateRecord(id, updates);
      await refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteRecord(id) {
    setIsSaving(true);
    try {
      await inbodyStore.deleteRecord(id);
      await refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <InBodyContext.Provider value={{ records, isLoading, isSaving, addRecord, updateRecord, deleteRecord }}>
      {children}
    </InBodyContext.Provider>
  );
}

export function useInBody() {
  const ctx = useContext(InBodyContext);
  if (!ctx) throw new Error("useInBody must be used within InBodyProvider");
  return ctx;
}
