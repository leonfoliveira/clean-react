import { HttpResponse } from './http-response';

export type HttpPostParams<BodyType = any> = {
  url: string;
  body?: BodyType;
};

export interface HttpPostClient<ResponseType = any, BodyType = any> {
  post(params: HttpPostParams<BodyType>): Promise<HttpResponse<ResponseType>>;
}
