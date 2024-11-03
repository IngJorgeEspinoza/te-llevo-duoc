// src/app/service/storage.service.ts
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

  // Clear temporary session data but keep user-specific data (e.g., cards)
  clearSessionData(): void {
    this.remove('email');
    this.remove('name');
    this.remove('photo');
    this.remove('tokenID');
  }

  // Store cards for a specific user
  setUserCards(userEmail: string, cards: any[]): void {
    this.set(`cards_${userEmail}`, cards);
  }

  // Retrieve cards for a specific user
  getUserCards(userEmail: string): any[] {
    return this.get(`cards_${userEmail}`) || [];
  }

  // Store selected card for a specific user
  setUserSelectedCard(userEmail: string, selectedCard: any): void {
    this.set(`selectedCard_${userEmail}`, selectedCard);
  }

  // Retrieve selected card for a specific user
  getUserSelectedCard(userEmail: string): any | null {
    return this.get(`selectedCard_${userEmail}`);
  }
}