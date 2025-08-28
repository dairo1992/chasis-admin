
import { Component, Inject, OnInit } from '@angular/core';
import { GetUserUseCase } from '../../application/get-user.usecase';
import { User } from '../../domain/user.entity';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    user: User | undefined;

    constructor(@Inject(GetUserUseCase) private getUserUseCase: GetUserUseCase) { }

    ngOnInit(): void {
        this.getUserUseCase.execute('1').subscribe((user: User) => {
            this.user = user;
        });
    }

}
