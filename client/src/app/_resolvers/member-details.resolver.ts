import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Member } from "../_models/member";
import { MembersService } from "../_services/members.service";


@Injectable({
    providedIn: 'root'
})
export class MemberDetailsResolver  {
    
    constructor(private memberSerive: MembersService) { }
    
    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        return this.memberSerive.getMember(route.paramMap.get('username'));
    }
    
}