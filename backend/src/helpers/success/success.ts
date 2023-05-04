import { IHttpsResponse } from "../../interfaces/interfaces";

export class HttpResponseSuccess {
    private constructor(
        public readonly statusCode: number,
        public readonly message: string,
        public readonly data: any
    ) {}

    static ok({ data }: IHttpsResponse): IHttpsResponse {
        return new HttpResponseSuccess(200, 'Ok', data);
    }

    static created({ data }: IHttpsResponse): IHttpsResponse {
        return new HttpResponseSuccess(201, 'Created', data);
    }

    static NoContent({ data }: IHttpsResponse): IHttpsResponse {
        return new HttpResponseSuccess(204, 'No Content', data);
    }
}