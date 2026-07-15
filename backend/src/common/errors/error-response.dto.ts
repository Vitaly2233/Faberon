import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({ example: 'Resource was not found.' })
  message!: string;

  @ApiProperty({ example: 'Not Found' })
  error!: string;
}
