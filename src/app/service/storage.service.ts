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

  // Esta cosa solo elimina los temporales
  clearSessionData(): void {
    this.remove('email');
    this.remove('tokenID');
  }

  // Nuevo método para obtener datos de sesión
  obtenerStorage(): any {
    const email = localStorage.getItem('email');
    const tokenID = localStorage.getItem('tokenID');
    
    if (email && tokenID) {
      return {
        email: email,
        token: tokenID
      };
    }
    return null;
  }  

  // Método de almacenamiento genérico
  agregarStorage(key: string, data: any): void {
    try {
      this.set(key, data);
      console.log('Datos guardados en storage:', data);
    } catch (error) {
      console.error('Error al guardar en storage:', error);
      throw error;
    }
  }  

  // Método para limpiar todo el storage
  limpiarStorage(): void {
    try {
      localStorage.clear();
      console.log('Storage limpiado completamente');
    } catch (error) {
      console.error('Error al limpiar storage:', error);
    }
  }

  // Método para eliminar storage
  eliminarStorage(): void {
    try {
      localStorage.clear();
      console.log('Storage limpiado completamente');
    } catch (error) {
      console.error('Error al eliminar el storage:', error);
    }
  }
}