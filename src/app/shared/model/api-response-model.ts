
// export class ApiResponseModel<T> {
//     message?: string;
//     result?: T;
// }

export interface ApiResponseModel<T> {
    status_code: number;
    status_message: string;
    message: string;
    result?: T;
}