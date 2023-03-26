import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { race, map, Observable, delay } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  public factory() {
    const httpA = this.getHttpA();
    const httpB = this.getHttpB();

    return race([httpA, httpB]).pipe(
      map((result: User[]) => {
        const users: User[] = result.sort((a: User, b: User) => a.id - b.id);
        return users;
      })
    );
  }

  private getHttpA() {
    const url = 'assets/userA.json';
    return this.getData(url).pipe(delay(1000));
  }

  private getHttpB() {
    const url = 'assets/userB.json';
    return this.getData(url);
  }

  private getData(url: string): Observable<User[]> {
    return this.http.get(url).pipe(
      map((results: any) => {
        const users: User[] = [];
        results.user.forEach((user: any) => {
          users.push(new User(user))
        });
        return users;
      })
    )
  }
}
