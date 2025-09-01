// src/features/home/presentation/home.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetUserUseCase } from '../../user/application/get-user.usecase';
import { User } from '../../user/domain/user.entity';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule]
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