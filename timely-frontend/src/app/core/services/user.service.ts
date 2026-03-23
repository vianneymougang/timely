import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

/**
 * DTOs correspondant aux réponses du user-service backend
 */
export interface UserDto {
  id: string;
  name: string;
  surname: string;
  email: string;
  telephoneNumber?: number;
  role: 'ROLE_ADMIN' | 'ROLE_TEACHER';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED';
  creationDate?: string;
}

export interface TeacherDto extends UserDto {
  matricule: string;
  grade: string;
  rank: string;
  hourlyRate: string;
}

export interface AdminDto extends UserDto {
  accessLevel?: number;
  department?: number;
}

/**
 * Requêtes de création d'utilisateurs
 */
export interface CreateTeacherRequest {
  name: string;
  surname: string;
  email: string;
  telephoneNumber?: number;
  grade: string;
  rank: string;
  hourlyRate: string;
}

export interface CreateAdminRequest {
  name: string;
  surname: string;
  email: string;
  telephoneNumber?: number;
}

export interface UpdateUserRequest {
  name?: string;
  surname?: string;
  email?: string;
  telephoneNumber?: number;
}

export interface BulkUserActionRequest {
  userIds: string[];
}

export interface BulkUserActionResponse {
  successCount: number;
  failureCount: number;
  successIds: string[];
  failures: { userId: string; reason: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);

  private readonly USERS_API = '/users';

  /**
   * Créer un nouvel enseignant (Admin uniquement)
   */
  createTeacher(request: CreateTeacherRequest): Observable<TeacherDto> {
    return this.apiService.post<TeacherDto>(`${this.USERS_API}/teachers`, request).pipe(
      catchError((error) => {
        console.error('Error creating teacher:', error);
        return throwError(
          () => new Error(error.error?.message || "Erreur lors de la création de l'enseignant")
        );
      })
    );
  }

  /**
   * Créer un nouvel administrateur (Admin uniquement)
   */
  createAdmin(request: CreateAdminRequest): Observable<AdminDto> {
    return this.apiService.post<AdminDto>(`${this.USERS_API}/admins`, request).pipe(
      catchError((error) => {
        console.error('Error creating admin:', error);
        return throwError(
          () => new Error(error.error?.message || "Erreur lors de la création de l'administrateur")
        );
      })
    );
  }

  /**
   * Récupérer tous les utilisateurs
   */
  getAllUsers(): Observable<UserDto[]> {
    return this.apiService.get<UserDto[]>(this.USERS_API).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return throwError(
          () => new Error(error.error?.message || 'Erreur lors de la récupération des utilisateurs')
        );
      })
    );
  }

  /**
   * Récupérer un utilisateur par ID
   */
  getUserById(id: string): Observable<UserDto> {
    return this.apiService.get<UserDto>(`${this.USERS_API}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching user:', error);
        return throwError(
          () => new Error(error.error?.message || "Erreur lors de la récupération de l'utilisateur")
        );
      })
    );
  }

  /**
   * Mettre à jour un utilisateur
   */
  updateUser(id: string, request: UpdateUserRequest): Observable<UserDto> {
    return this.apiService.put<UserDto>(`${this.USERS_API}/${id}`, request).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(
          () => new Error(error.error?.message || "Erreur lors de la mise à jour de l'utilisateur")
        );
      })
    );
  }

  /**
   * Bloquer un utilisateur (Admin uniquement)
   */
  blockUser(id: string): Observable<UserDto> {
    return this.apiService.put<UserDto>(`${this.USERS_API}/${id}/block`, {}).pipe(
      catchError((error) => {
        console.error('Error blocking user:', error);
        return throwError(
          () => new Error(error.error?.message || "Erreur lors du blocage de l'utilisateur")
        );
      })
    );
  }

  /**
   * Débloquer un utilisateur (Admin uniquement)
   */
  unblockUser(id: string): Observable<UserDto> {
    return this.apiService.put<UserDto>(`${this.USERS_API}/${id}/unblock`, {}).pipe(
      catchError((error) => {
        console.error('Error unblocking user:', error);
        return throwError(
          () => new Error(error.error?.message || "Erreur lors du déblocage de l'utilisateur")
        );
      })
    );
  }

  /**
   * Supprimer un utilisateur (Admin uniquement)
   */
  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.USERS_API}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting user:', error);
        return throwError(
          () => new Error(error.error?.message || "Erreur lors de la suppression de l'utilisateur")
        );
      })
    );
  }

  /**
   * Bloquer plusieurs utilisateurs (Admin uniquement)
   */
  bulkBlockUsers(userIds: string[]): Observable<BulkUserActionResponse> {
    return this.apiService
      .put<BulkUserActionResponse>(`${this.USERS_API}/bulk-block`, { userIds })
      .pipe(
        catchError((error) => {
          console.error('Error bulk blocking users:', error);
          return throwError(
            () => new Error(error.error?.message || 'Erreur lors du blocage des utilisateurs')
          );
        })
      );
  }

  /**
   * Débloquer plusieurs utilisateurs (Admin uniquement)
   */
  bulkUnblockUsers(userIds: string[]): Observable<BulkUserActionResponse> {
    return this.apiService
      .put<BulkUserActionResponse>(`${this.USERS_API}/bulk-unblock`, { userIds })
      .pipe(
        catchError((error) => {
          console.error('Error bulk unblocking users:', error);
          return throwError(
            () => new Error(error.error?.message || 'Erreur lors du déblocage des utilisateurs')
          );
        })
      );
  }
}
