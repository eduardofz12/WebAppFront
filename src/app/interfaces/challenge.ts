import { Situacao } from "./situacao";
import { User } from "./user";

export interface Challenge {
    id:number;
    titulo:string;
    situacao:Situacao;
    descricao:string;
    dataInclusao:Date;
    dataFinal:Date;
    usuario:User;
}
