import { IHelper, IHttpsResponse } from "../interfaces/interfaces";

export class HttpResponseHelper implements IHelper {
  ok({ statusCode, data, message }: IHttpsResponse): IHttpsResponse {
    return {
      statusCode: statusCode ?? 200,
      message: message ?? "ok",
      data,
    };
  }
}
