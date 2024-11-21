import { EntityState } from "@ngrx/entity";

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    gender: string;
    role: string;
    status:boolean
}

export interface UserModel extends EntityState<User>{

}
