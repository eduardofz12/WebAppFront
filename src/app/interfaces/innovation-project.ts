import { Idea } from "./idea";
import { Situacao } from "./situacao";
import { User } from "./user";

export interface InnovationProject {
    id: number;
    titulo: string;
    descricao:string;
    ideia:Idea;
    responsavel:User;
    dataInicio:Date;
    dataTermino:Date;
    usuarioInclusao:User;
    dataInclusao:Date;
    situacao: Situacao;
}
