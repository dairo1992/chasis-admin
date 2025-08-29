
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../domain/user.entity';

@Injectable({
    providedIn: 'root'
})
export abstract class GetUserUseCase {
    abstract execute(id: string): Observable<User>;
}
