import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  // Guardar datos en el almacenamiento local
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtener datos del almacenamiento local
  get(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Eliminar datos específicos del almacenamiento
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Limpiar sesión (elimina datos como email y token)
  clearSessionData(): void {
    this.remove('email');
    this.remove('tokenID');
  }

  // Obtener información de sesión (email y token)
  obtenerStorage(): any {
    const email = localStorage.getItem('email');
    const tokenID = localStorage.getItem('tokenID');
    
    if (email && tokenID) {
      return { email, token: tokenID };
    }
    return null;
  }

  // Método genérico para guardar datos en el almacenamiento
  agregarStorage(key: string, data: any): void {
    try {
      this.set(key, data);
      console.log('Datos guardados en storage:', data);
    } catch (error) {
      console.error('Error al guardar en storage:', error);
      throw error;
    }
  }

  // Limpiar todo el almacenamiento local
  limpiarStorage(): void {
    try {
      localStorage.clear();
      console.log('Storage limpiado completamente');
    } catch (error) {
      console.error('Error al limpiar storage:', error);
    }
  }

  // Eliminar todo el almacenamiento
  eliminarStorage(): void {
    try {
      localStorage.clear();
      console.log('Storage limpiado completamente');
    } catch (error) {
      console.error('Error al eliminar el storage:', error);
    }
  }
}
