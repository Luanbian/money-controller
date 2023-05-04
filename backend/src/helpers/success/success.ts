import { IHttpsResponse } from "../../interfaces/interfaces";

export class HttpResponseSuccess {
    private constructor(
        public readonly statusCode: number,
        public readonly message?: string,
        public readonly data?: any
    ) {}

    static ok({ data, message }: IHttpsResponse): IHttpsResponse {
        return new HttpResponseSuccess(200, message ?? 'Ok', data);
    }

    static created({ data, message }: IHttpsResponse): IHttpsResponse {
        return new HttpResponseSuccess(201, message ?? 'Created', data);
    }

}