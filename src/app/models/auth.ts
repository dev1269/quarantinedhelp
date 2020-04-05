export enum IAuthMode {
    LOGIN,
    REGISTER
}

export interface ILoginForm {
    email: string;
    password: string;
}

export enum EUserType {
    HELPER, AFFECTED, AUTHORITIES, THIRD_PARTY
}

export interface IUSer {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface IPosition {
    longitude: any;
    lattitude: any;
}
export interface IRegisterForm {
    user: IUSer;
    position: IPosition;
    type: EUserType;
    firstLineOfAddress: string;
    secondLineOfAddress?: string;
    country: string;
    placeId?: string;
    postCode: number;
    city: string;
    phone: number;
    crisis: any;
}