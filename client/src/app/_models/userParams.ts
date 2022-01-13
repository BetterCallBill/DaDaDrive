import { User } from "./user";

export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 100;
    pageSize = 6;
    PageNumber = 1;
    orderBy = "lastActive";

    constructor(user: User) {
        this.gender = user.gender;
    }
}