import { useEffect, useState } from "react";
import Report, { IReport } from "../core/report";
import ReportManager from "../core/report.manager";

export default function useReports() {
  const [reports, setReports] = useState<Array<Report>>([]);

  useEffect(() => {
    if (reports?.length === 0) {
      const savedReports = ReportManager.load();
      if (savedReports) {
        setReports(savedReports);
      }
    }
  }, [reports]);

  function createReport(props: IReport) {
    const report = ReportManager.createReport(props);
    setReports(ReportManager.allReports);

    return report;
  }

  function getReport(id: string) {
    return ReportManager.allReports.find((report) => report.id === id);
  }

  function updateReport(id: string, props: IReport) {
    const report = ReportManager.updateReport(id, props);
    setReports(ReportManager.allReports);
    return report;
  }

  function deleteReport(id: string) {
    ReportManager.deleteReport(id);
    setReports(ReportManager.allReports);
  }

  return {
    reports,
    setReports,
    createReport,
    getReport,
    updateReport,
    deleteReport,
  };
}
