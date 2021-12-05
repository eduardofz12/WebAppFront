import { InnovationProject } from "./innovation-project";
import { User } from "./user";

export class Activity {
    id!: number;
    titulo!: string;
    descricao!: string;
    dataInclusao!: Date;
    dataInicio!: Date;
    dataTermino!: Date;
    status!: number;
    ultimaAlteracaoData!: Date;
    ultimaAlteracaoUsuario!: User;
    projetoInovacao!: InnovationProject;
    responsavel!: User;
}
