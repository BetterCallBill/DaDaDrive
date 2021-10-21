import { Photo } from "./photo";

export interface Member {
    id: number;
    username: string;
    photoUrl: string;
    passwordHash: string;
    passwordSalt: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;
    lookingFor: string;
    suburb: string;
    street: string;
    photos: Photo[];
}


