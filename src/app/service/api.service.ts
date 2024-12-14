// src/app/service/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { StorageService } from './storage.service';

export interface BodyUser {
  [key: string]: string | undefined;
  p_nombre: string;
  p_correo_electronico: string;
  p_telefono: string;
  token: string;
}

export interface BodyVehicle {
  [key: string]: string | number;
  p_id_usuario: string;
  p_patente: string;
  p_marca: string;
  p_modelo: string;
  p_anio: number;
  p_color: string;
  p_tipo_combustible: string;
  token: string;
}

export interface BodyTrip {
  p_id_usuario: string;
  p_ubicacion_origen: string;
  p_ubicacion_destino: string;
  p_costo: number;
  p_id_vehiculo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl.replace(/\/$/, ''); // Removemos cualquier barra al final

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  // User Management
  async agregarUsuario(userData: BodyUser, imageFile: File): Promise<any> {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key]) {
        formData.append(key, userData[key] as string);
      }
    });
    formData.append('image_usuario', imageFile);

    try {
      const response = await lastValueFrom(
        this.http.post(`${this.baseUrl}/user/agregar`, formData)
      );
      return response;
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw error;
    }
  }

  async obtenerUsuario(email: string): Promise<any> {
    const params = {
      p_correo: email,
      token: this.storage.get('tokenID')
    };

    try {
      return await lastValueFrom(
        this.http.get(`${this.baseUrl}/user/obtener`, { params })
      );
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  // Vehicle Management
  async agregarVehiculo(vehicleData: BodyVehicle, imageFile: File): Promise<any> {
    const formData = new FormData();
    Object.keys(vehicleData).forEach(key => {
      formData.append(key, vehicleData[key].toString());
    });
    formData.append('image', imageFile);

    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/vehiculo/agregar`, formData)
      );
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      throw error;
    }
  }

  async obtenerVehiculos(userId: string): Promise<any> {
    const params = {
      p_id: userId,
      token: this.storage.get('tokenID')
    };

    try {
      return await lastValueFrom(
        this.http.get(`${this.baseUrl}/vehiculo/obtener`, { params })
      );
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      throw error;
    }
  }

  // Trip Management
  async agregarViaje(tripData: BodyTrip): Promise<any> {
    const token = this.storage.get('tokenID');
    const payload = { ...tripData, token };

    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/viaje/agregar`, payload)
      );
    } catch (error) {
      console.error('Error al agregar viaje:', error);
      throw error;
    }
  }

  async obtenerViajes(filters?: { p_id?: string; p_id_usuario?: string }): Promise<any> {
    const params = {
      token: this.storage.get('tokenID'),
      ...filters
    };

    try {
      return await lastValueFrom(
        this.http.get(`${this.baseUrl}/viaje/obtener`, { params })
      );
    } catch (error) {
      console.error('Error al obtener viajes:', error);
      throw error;
    }
  }

  async actualizarEstadoViaje(viajeId: string, estadoId: number): Promise<any> {
    const payload = {
      p_id: viajeId,
      p_id_estado: estadoId,
      token: this.storage.get('tokenID')
    };

    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/viaje/actualiza_estado_viaje`, payload)
      );
    } catch (error) {
      console.error('Error al actualizar estado del viaje:', error);
      throw error;
    }
  }

  // Alias para publicarViaje
  publicarViaje = this.agregarViaje;

  // Helper method for getting user ID from email
  async getUserId(): Promise<string> {
    const email = this.storage.get('email');
    if (!email) throw new Error('No hay usuario logueado');
    
    try {
      const userResponse = await this.obtenerUsuario(email);
      return userResponse.id;
    } catch (error) {
      console.error('Error al obtener ID del usuario:', error);
      throw error;
    }
  }
}