import { HttpResponse } from './http-response';

export type HttpGetParams<HeadersType = any> = {
  url: string;
  headers?: HeadersType;
};

export interface HttpGetClient<ResponseType = any, HeadersType = any> {
  get(params: HttpGetParams<HeadersType>): Promise<HttpResponse<ResponseType>>;
}
