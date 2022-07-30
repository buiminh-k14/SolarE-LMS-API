import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpMessage } from './httpMessage';

export interface HttpResponse {
  status: HttpStatus;
  message: HttpMessage;
  data?: any;
}

export function HttpResponse(
  data?: any,
  successMessage: HttpMessage = HttpMessage.SUCCESS,
  successCode: HttpStatus = HttpStatus.OK,
  failMessage: HttpMessage = HttpMessage.INTERNAL_SERVER_ERROR,
  failCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
) {
  if (data === 'success') {
    return {
      status: successCode,
      message: successMessage,
    };
  } else if (data) {
    return {
      status: successCode,
      message: successMessage,
      data: data,
    };
  } else {
    throw new HttpException(failMessage, failCode);
  }
}
