import Report, { IReport } from "./report";

export default class ReportManager {
  private static reports: Report[] = [];

  public static createReport(props: IReport) {
    const report = new Report(props);
    this.reports.push(report);

    this.save();
    return report;
  }

  static get allReports() {
    return this.reports;
  }

  public static updateReport(id: string, props: IReport) {
    let report: Report | undefined;
    this.reports = this.reports.map((r) => {
      if (r.id === id) {
        report = new Report({ ...r, ...props });
        report.id = r.id;
        return report;
      }
      return r;
    });

    this.save();

    return report;
  }

  public static deleteReport(id: string) {
    this.reports = this.reports.filter((report) => report.id !== id);
    this.save();
  }

  private static save() {
    localStorage.setItem("reports", JSON.stringify(this.reports));
  }

  public static reorderReports(ids: string[]) {
    const map = new Map(this.reports.map((r) => [r.id, r]));
    this.reports = ids.map((id) => map.get(id)).filter(Boolean) as Report[];
    this.save();
  }

  public static load() {
    const data = localStorage.getItem("reports");
    this.reports = [];

    if (data) {
      const parsedData = JSON.parse(data) || [];
      if (Array.isArray(parsedData)) {
        parsedData.forEach((report) => {
          const r = new Report(report);
          r.id = report.id;
          this.reports.push(r);
        });
      }
    }

    return this.reports;
  }
}
