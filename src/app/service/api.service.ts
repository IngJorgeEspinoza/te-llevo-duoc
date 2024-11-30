import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private firebaseService: FirebaseService) {}

  // Método para agregar un usuario
  async agregarUsuario(data: BodyUser, imageFile: File): Promise<any> {
    const formData = new FormData();
    formData.append('p_nombre', data.p_nombre);
    formData.append('p_correo_electronico', data.p_correo_electronico);
    formData.append('p_fecha_nacimiento', data.p_fecha_nacimiento);
    formData.append('p_telefono', data.p_telefono);
    if (data.token) {
      formData.append('token', data.token);
    }
    formData.append('image_usuario', imageFile, imageFile.name);

    return await lastValueFrom(
      this.http.post<any>(`${environment.apiUrl}/user/agregar`, formData)
    );
  }

  // Método para agregar un vehículo
  async agregarVehiculo(data: BodyVehicle, imageFile: File): Promise<any> {
    const formData = new FormData();
    formData.append('p_id_usuario', data.p_id_usuario.toString());
    formData.append('p_patente', data.p_patente);
    formData.append('p_marca', data.p_marca);
    formData.append('p_modelo', data.p_modelo);
    formData.append('p_anio', data.p_anio.toString());
    formData.append('p_color', data.p_color);
    formData.append('p_tipo_combustible', data.p_tipo_combustible);
    formData.append('token', data.token);
    formData.append('image', imageFile, imageFile.name);

    return await lastValueFrom(
      this.http.post<any>(`${environment.apiUrl}/vehiculo/agregar`, formData)
    );
  }

  // Método para obtener el ID del usuario
  async getUserId(): Promise<string> {
    try {
      const token = await this.firebaseService.getTokenID();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const response = await lastValueFrom(
        this.http.get<any>(`${environment.apiUrl}/user/obtener-id`, { headers })
      );

      if (!response.id) {
        throw new Error('ID de usuario no encontrado en la respuesta.');
      }

      return response.id;
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
      throw new Error(
        'No se pudo obtener el ID del usuario. Verifica tu conexión o la configuración del servidor.'
      );
    }
  }

  // Método para publicar un viaje
  async publicarViaje(data: BodyTrip): Promise<any> {
    const token = await this.firebaseService.getTokenID();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return await lastValueFrom(
      this.http.post<any>(`${environment.apiUrl}/viaje/publicar`, data, { headers })
    );
  }
}

// Interfaz para el cuerpo de la solicitud al agregar un usuario
export interface BodyUser {
  p_nombre: string;
  p_correo_electronico: string;
  p_fecha_nacimiento: string;
  p_telefono: string;
  token?: string;
}

// Interfaz para el cuerpo de la solicitud al agregar un vehículo
export interface BodyVehicle {
  p_id_usuario: string;
  p_patente: string;
  p_marca: string;
  p_modelo: string;
  p_anio: number;
  p_color: string;
  p_tipo_combustible: string;
  token: string;
}

// Interfaz para el cuerpo de la solicitud al publicar un viaje
export interface BodyTrip {
  origen: string;
  destino: string;
  fechaHoraSalida: string;
  asientosDisponibles: number;
  precioAsiento: number;
  descripcion?: string;
}
