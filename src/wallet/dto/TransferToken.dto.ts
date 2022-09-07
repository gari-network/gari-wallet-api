import { ApiProperty } from '@nestjs/swagger';

export class TransferToken {
  @ApiProperty({
    required: true,
    description: 'sender public  key ',
    example: '',
  })
  fromPublicKey: String;

  @ApiProperty({
    required: true,
    description: 'sender private  key ',
    example: '',
  })
  fromPrivateKey: String;

  @ApiProperty({
    required: true,
    description: 'receiver public  key ',
    example: '',
  })
  receiverPublicKey: String;

  @ApiProperty({
    required: true,
    description: 'enter coin',
    example: 100,
  })
  coins: number;
}
