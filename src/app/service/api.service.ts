import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { StorageService } from './storage.service';

export interface BodyUser {
  p_nombre: string;
  p_correo_electronico: string;
  p_telefono: string;
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
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = `${environment.apiUrl}/api`.replace(/\/$/, '');

  constructor(private http: HttpClient, private storage: StorageService) {}

  async obtenerUsuario(email: string): Promise<any> {
    const params = {
      p_correo: email,
      token: this.storage.get('tokenID'),
    };

    try {
      const response = await lastValueFrom(
        this.http.get(`${this.baseUrl}/user/obtener`, { params })
      );
      return response;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw new Error('No se pudo obtener la información del usuario.');
    }
  }

  async agregarUsuario(userData: BodyUser, imageFile: File): Promise<any> {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key as keyof BodyUser] as string);
    });
    formData.append('image_usuario', imageFile);

    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/user/agregar`, formData)
      );
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw error;
    }
  }

  async agregarVehiculo(vehicleData: any, imageFile: File): Promise<any> {
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
      throw new Error('No se pudo agregar el vehículo.');
    }
  }

  async obtenerVehiculos(userId: string): Promise<any[]> {
    const params = {
      p_id: userId,
      token: this.storage.get('tokenID'),
    };

    try {
      const response = await lastValueFrom(
        this.http.get<any[]>(`${this.baseUrl}/vehiculo/obtener`, { params })
      );
      return response || [];
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      throw new Error('No se pudo cargar la lista de vehículos.');
    }
  }

  async publicarViaje(tripData: BodyTrip): Promise<any> {
    const token = this.storage.get('tokenID');
    const payload = { ...tripData, token };

    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/viaje/agregar`, payload)
      );
    } catch (error) {
      console.error('Error al publicar viaje:', error);
      throw new Error('No se pudo publicar el viaje.');
    }
  }

  async obtenerViajes(): Promise<any[]> {
    const token = this.storage.get('tokenID');
    const params = { token };

    try {
      const response = await lastValueFrom(
        this.http.get<any[]>(`${this.baseUrl}/viaje/obtener`, { params })
      );
      return response || [];
    } catch (error) {
      console.error('Error al obtener viajes:', error);
      throw new Error('No se pudo cargar la lista de viajes.');
    }
  }

  async actualizarEstadoViaje(viajeId: string, estadoId: number): Promise<any> {
    const payload = {
      p_id: viajeId,
      p_id_estado: estadoId,
      token: this.storage.get('tokenID'),
    };

    try {
      return await lastValueFrom(
        this.http.post(`${this.baseUrl}/viaje/actualiza_estado_viaje`, payload)
      );
    } catch (error) {
      console.error('Error al actualizar estado del viaje:', error);
      throw new Error('No se pudo actualizar el estado del viaje.');
    }
  }

  async getUserId(): Promise<string> {
    const email = this.storage.get('email');
    if (!email) {
      throw new Error('No hay usuario logueado.');
    }

    try {
      const userResponse = await this.obtenerUsuario(email);
      return userResponse.id;
    } catch (error) {
      console.error('Error al obtener ID del usuario:', error);
      throw new Error('No se pudo obtener el ID del usuario.');
    }
  }
}
