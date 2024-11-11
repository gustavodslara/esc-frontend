import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private uploadUrl = 'server.js';

  constructor(private http: HttpClient) {}

  uploadProfilePic(file: File): Observable<{ filePath: string }> {
    const formData = new FormData();
    formData.append('profile-pic', file);
    return this.http.post<{ filePath: string }>(this.uploadUrl, formData);
  }
}
