export type Msg91ResponseType = "success" | "error";

export interface Msg91BaseResponse {
  message: string;
  type: Msg91ResponseType;
  code?: string;
}

export interface Msg91ResponseDto extends Msg91BaseResponse {}