import { ApiProperty } from '@nestjs/swagger';

export class SendAirdropDto {
  @ApiProperty({
    required: true,
    description: 'receiver public key',
    example: '',
  })
  publicKey: String;
}
