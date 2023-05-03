import { IHelper, IHttpsResponse } from "../interfaces/interfaces";

export class HttpResponseHelper {
  private constructor(
    public readonly statusCode: number, 
    public readonly message?: string, 
    public readonly data?: any
  ) {}

  static ok({ statusCode, message, data }: IHttpsResponse): IHttpsResponse {
    return new HttpResponseHelper(statusCode ?? 200, message ?? 'Ok', data);
  }
}
