import { createContext } from "react";
import Report, { IReport } from "../core/report";

interface IReportContext {
  reports: Array<Report>;
  createReport: (props: IReport) => Report;
  getReport: (id: string) => Report | undefined;
  updateReport: (id: string, props: IReport) => Report | undefined;
  deleteReport: (id: string) => void;
}

const reportContext = createContext<IReportContext>({
  reports: [],
  createReport: (props: IReport) => new Report(props),
  getReport: () => new Report({} as IReport) as Report | undefined,
  updateReport: (_id: string, props: IReport) =>
    new Report(props) as Report | undefined,
  deleteReport: () => Function,
});

export default reportContext;
