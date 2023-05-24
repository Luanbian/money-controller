import { IHttpsResponse } from "../../interfaces/interfaces";

export class HttpResponseErrors extends Error {
  private constructor( public readonly statusCode: number, message?: string, public readonly data?: any) { 
    super(message)
  }

  static badRequest({ data, message }: IHttpsResponse): IHttpsResponse {
    return new HttpResponseErrors(400, message ?? 'BadRequest', data);
  }
}
