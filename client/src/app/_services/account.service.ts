import { HttpClient } from '@angular/common/http';
import { ArrayType } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

// services are Injectable
// services are singleton
@Injectable({
	providedIn: 'root'
})
export class AccountService {
	baseUrl = environment.apiUrl;
	private currentUserSource = new ReplaySubject<User>(1);
	currentUser$ = this.currentUserSource.asObservable();

	constructor(private http: HttpClient) { }

	setCurrentUser(user: User) {
		user.roles = [];
		const roles = this.getDecodedToken(user.token).role;
		Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
		
		localStorage.setItem("user", JSON.stringify(user));
		this.currentUserSource.next(user);
	}

	register(model: any) {
		return this.http.post(this.baseUrl + 'account/register', model).pipe(
			map((user: User) => {
				if (user) {
					this.setCurrentUser(user);
				}
			})
		);
	}

	login(model: any) {
		return this.http.post(this.baseUrl + 'account/login', model).pipe(
			map((response: User) => {
				const user = response;
				if (user) {
					// pass the value to current user
					this.setCurrentUser(user);
				}
			})
		);
	}

	logout() {
		localStorage.removeItem("user");
		this.currentUserSource.next(null);
	}
	
	getDecodedToken(token) {
		// get payload token
		return JSON.parse(atob(token.split('.')[1]));
	}
}
