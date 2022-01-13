import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
	providedIn: 'root',
})
export class MembersService {
	baseUrl = environment.apiUrl;
	members: Member[] = [];

	constructor(private http: HttpClient) {}

	getMembers(userParams: UserParams) {
		let params = this.getPaginationHeaders(userParams.PageNumber, userParams.pageSize);

		params = params.append('minAge', userParams.minAge.toString());
		params = params.append('maxAge', userParams.maxAge.toString());
		params = params.append('gender', userParams.gender);

		return this.getPaginationResult<Member[]>(this.baseUrl + 'users', params);
	}

	getMember(username: string) {
		const member = this.members.find((x) => x.username === username);
		if (member !== undefined) return of(member);

		return this.http.get<Member>(this.baseUrl + 'users/' + username);
	}

	updateMember(member: Member) {
		return this.http.put(this.baseUrl + 'users', member).pipe(
			map(() => {
				const index = this.members.indexOf(member);
				this.members[index] = member;
			})
		);
	}

	// Send http request
	setMainPhoto(photoId: number) {
		return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
	}

	deletePhoto(photoId: number) {
		return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
	}

	private getPaginationHeaders(pageNumber: number, pageSize: number) {
		let params = new HttpParams();

		params = params.append('pageNumber', pageNumber.toString());
		params = params.append('pageSize', pageSize.toString());

		return params;
	}

	private getPaginationResult<T>(url, params) {
		const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

		return this.http.get<T>(url, { observe: 'response', params }).pipe(
			map((response) => {
				paginatedResult.result = response.body;
				if (response.headers.get('Pagination') !== null) {
					paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
				}

				return paginatedResult;
			})
		);
	}
}
