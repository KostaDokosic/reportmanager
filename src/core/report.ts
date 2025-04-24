import { nanoid } from "nanoid";

export type IReport = {
  id?: string;
  title: string;
  desc: string;
};

export default class Report {
  public id: string;
  public title: string;
  public desc: string;

  constructor({ id, title, desc }: IReport) {
    this.id = id ?? nanoid();
    this.title = title;
    this.desc = desc;
  }
}
