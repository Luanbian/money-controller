import { IHttpsResponse } from "../../interfaces/interfaces";

export class HttpResponseErrors extends Error {
  private constructor( public readonly statusCode: number, message?: string, public readonly data?: any) { 
    super(message)
  }

  static badRequest({ data }: IHttpsResponse): IHttpsResponse {
    return new HttpResponseErrors(400, 'Bad Request', data);
  }

  static internalServerError({ data }: IHttpsResponse): IHttpsResponse {
    return new HttpResponseErrors(500, 'Internal Server Error', data);
  }

  static NotFound({ data }: IHttpsResponse): IHttpsResponse {
    return new HttpResponseErrors(404, 'Not Found', data);
  }

}
