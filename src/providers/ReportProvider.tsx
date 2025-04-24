import { ReactNode } from "react";
import ReportContext from "../context/ReportContext";
import useReports from "../hooks/useReports";

export default function ReportProvider({ children }: { children: ReactNode }) {
  const reports = useReports();
  return (
    <>
      <ReportContext.Provider value={reports}>
        {children}
      </ReportContext.Provider>
    </>
  );
}
