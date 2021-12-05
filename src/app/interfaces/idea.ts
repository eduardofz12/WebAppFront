import { Challenge } from "./challenge";
import { User } from "./user";

export interface Idea {
    id:number;
    titulo:string;
    situacao:number;
    descricao:string;
    dataInclusao:Date;
    desafio:Challenge;
    autor:User;
}
