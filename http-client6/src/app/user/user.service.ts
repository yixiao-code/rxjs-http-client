import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { forkJoin, map, mergeMap, Observable, race } from 'rxjs';
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
      mergeMap((ids: number[]) => {
        const httpc = this.getHttpC(ids);
        const httpd = this.getHttpD(ids);
        return race([httpc, httpd]).pipe(
          map((results: User[]) => {
            const users: User[] = results.sort(
              (a: User, b: User) => a.id - b.id
            );
            return users;
          })
        )
      })
    );
  }

  private getHttpA() {
    const url = 'assets/userA.json';
    return this.getData(url);
  }

  private getHttpB() {
    const url = 'assets/userB.json';
    return this.getData(url);
  }

  private getHttpC(ids: any) {
    const url = 'assets/userC.json'; 
    return this.getHttpData(url, ids);
  }

  private getHttpD(ids: any) {
    const url = 'assets/userD.json';
    return this.getHttpData(url, ids);
  }

  private getData(url: string): Observable<any> {
    return this.http.get(url).pipe(
      map((ids: any) => ids.id)
    )
  }

  private getHttpData(url: string, ids: any) {
    return this.http.get(url).pipe(
      map((userList: any) => {
        const users: User[] = [];
        userList.user.forEach((user: User) => {
          if (ids.indexOf(user.id) > -1) {
            users.push(new User(user));
          }
        });
        return users;
      })
    )
  }
}
