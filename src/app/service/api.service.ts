import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

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

    // Realiza la solicitud POST con formData, sin httpOptions
    return await lastValueFrom(
      this.http.post<any>(`${environment.apiUrl}/user/agregar`, formData)
    );
  }
}

export interface BodyUser {
  p_nombre: string;
  p_correo_electronico: string;
  p_fecha_nacimiento: string;
  p_telefono: string;
  token?: string;
}
