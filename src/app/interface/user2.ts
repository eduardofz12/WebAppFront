import { Address } from "./address";
import { Company } from "./company";

export interface User2 {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}
