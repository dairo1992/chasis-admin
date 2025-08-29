
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GetUserUseCase } from '../application/get-user.usecase';
import { User } from '../domain/user.entity';

@Injectable({
    providedIn: 'root'
})
export class UserService extends GetUserUseCase {
    execute(id: string): Observable<User> {
        return of({
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com'
        });
    }
}
