import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // esta cosa solo elimina los temporales
  clearSessionData(): void {
    this.remove('email');
    this.remove('tokenID');
  }

  // asocia el nombre al token (set y get)
  setUserName(tokenID: string, name: string): void {
    this.set(`name_${tokenID}`, name);
  }
  getUserName(tokenID: string): string | null {
    return tokenID ? this.get(`name_${tokenID}`) : null;
  }

  // asocia tarjetas al  token (set y get)
  setUserCards(tokenID: string, cards: any[]): void {
    if (tokenID) this.set(`cards_${tokenID}`, cards);
  }
  getUserCards(tokenID: string): any[] {
    return tokenID ? this.get(`cards_${tokenID}`) || [] : [];
  }

  // asocia tarjeta seleccionada al token (set y get)
  setUserSelectedCard(tokenID: string, selectedCard: any): void {
    if (tokenID) this.set(`selectedCard_${tokenID}`, selectedCard);
  }
  getUserSelectedCard(tokenID: string): any | null {
    return tokenID ? this.get(`selectedCard_${tokenID}`) : null;
  }
}
