import { Activity } from "./activity";

export class ListSchema {
    id!: number;
    name!: string;
    cards!: Activity[];
  }