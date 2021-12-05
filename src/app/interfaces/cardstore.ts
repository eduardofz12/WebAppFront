import { Activity } from "./activity";
import { CardSchema } from "./cardschema";
export class CardStore {
  cards: any = {};
  lastid = -1;
  
  _addCard(card: Activity) {
    card.id = Number(++this.lastid);
    this.cards[card.id] = card;
    return card.id;
  }

  getCard(cardId: string) {
    return this.cards[cardId];
  }
  
  newCard(descricao: string): Number {
    const card = new Activity();
    card.descricao = descricao;
    return this._addCard(card);
  }
}