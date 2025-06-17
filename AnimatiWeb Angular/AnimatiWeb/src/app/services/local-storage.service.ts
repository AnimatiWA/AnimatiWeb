import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * Almacena un valor en localStorage
   * @param key La clave a usar
   * @param value El valor a almacenar
   */
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error guardando en localStorage', e);
    }
  }

  /**
   * Obtiene un valor de localStorage
   * @param key La clave del valor a recuperar
   * @returns El valor almacenado o null si no existe
   */
  getItem(key: string): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error recuperando de localStorage', e);
      return null;
    }
  }

  /**
   * Elimina un valor de localStorage
   * @param key La clave del valor a eliminar
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error eliminando de localStorage', e);
    }
  }

  /**
   * Limpia todo el localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error limpiando localStorage', e);
    }
  }
}
