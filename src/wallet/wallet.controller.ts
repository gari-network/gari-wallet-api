import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { SendAirdropDto } from './dto/SendAirdropDto';
import * as web3 from '@solana/web3.js';
import _, { get as _get } from 'lodash';

import { TransferToken } from './dto/TransferToken.dto';

@ApiTags('Wallet')
@Controller('/')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/create-new-wallet')
  create() {
    let wallet = this.walletService.createWallet();

    console.log('wallet', wallet.publicKey.toString());
    const resp = {
      publickey: wallet.publicKey.toString(),
      privateKey: wallet.secretKey.toString(),
    };

    return {
      code: 200,
      error: null,
      message: 'Success',
      data: resp,
    };
  }
  @Post('/airdrop')
  async sendAirdrop(@Body() sendAirdropDto: SendAirdropDto) {
    const { publicKey } = sendAirdropDto;
    const associatedAccount = await this.walletService.getAssociatedAccount(
      publicKey,
    );

    const accountInfo: any = await this.walletService.getAccountInfo(
      associatedAccount.toString(),
    );

    let isAssociatedAccount = true;

    if (!accountInfo.value) {
      isAssociatedAccount = false;
    }

    const data = await this.walletService.assocaiatedAccountTransaction(
      associatedAccount,
      publicKey,
      isAssociatedAccount,
    );

    return {
      code: 200,
      error: null,
      message: 'Success',
      signature: data,
    };
  }
  @Post('token-transfer')
  async tokenTransfer(@Body() transferToken: TransferToken) {
    try {
      const { fromPublicKey, fromPrivateKey, receiverPublicKey, coins } =
        transferToken;

      let receiverPubkeyAta = await this.walletService.getAssociatedAccount(
        receiverPublicKey,
      );

      let senderPubkeyAta = await this.walletService.getAssociatedAccount(
        fromPublicKey,
      );

      const accountInfoReceiver: any = await this.walletService.getAccountInfo(
        receiverPubkeyAta.toString(),
      );

      const accountInfoSender: any = await this.walletService.getAccountInfo(
        senderPubkeyAta.toString(),
      );

      let balance = _get(
        accountInfoSender,
        'value.data.parsed.info.tokenAmount.amount',
        undefined,
      );
      if (!balance || balance < coins) {
        throw new Error('Insufficient balance');
      }
      let isAssociatedAccount = true;

      if (!accountInfoReceiver.value) {
        isAssociatedAccount = false;
      }

      const data = await this.walletService.sendData(
        senderPubkeyAta,
        receiverPubkeyAta,
        fromPublicKey,
        receiverPublicKey,
        fromPrivateKey,
        coins,
        isAssociatedAccount,
      );

      const resp = { signature: data };

      return {
        code: 200,
        error: null,
        message: 'Success',
        data: resp,
      };
    } catch (error) {
      return {
        code: 400,
        error: error.message,
        message: 'Error',
      };
    }
  }
  @Get('getBalance/:publickey')
  @ApiParam({
    name: 'publickey',
    type: String,
    required: true,
  })
  async getBalance(@Req() req:any) {
    try {
      const publickey = req.params.publickey;

      let receiverPubkeyAta = await this.walletService.getAssociatedAccount(
        publickey,
      );

      const data = await this.walletService.getAccountInfo(receiverPubkeyAta);
      if (data.value == null) {
        throw new Error(
          `Gari associated account with public key ${publickey} does not exist`,
        );
      }
      let balance = _get(
        data,
        'value.data.parsed.info.tokenAmount.amount',
        undefined,
      );
      const resp = { balance };

      return {
        code: 200,
        error: null,
        message: 'Success',
        data: resp,
      };
    } catch (error) {
      return {
        code: 400,
        error: error.message,
        message: 'Error',
      };
    }
  }

  @Post('getTransactions/:publickey')
  @ApiParam({
    name: 'publickey',
    type: String,
    required: true,
  })
  async transactions(@Req() req:any) {
    try {
      const publickey = req.params.publickey;
   
    let receiverPubkeyAta = await this.walletService.getAssociatedAccount(
      publickey,
    );

    const signatures = await this.walletService.getSignature(receiverPubkeyAta);
    const transactions = []
    for(let sign of signatures){
     const transData = await this.walletService.getTransactionsBySignature(sign.signature)
     transactions.push(transData)
    }

    const resp = { transactions };
    return {
      code: 200,
      error: null,
      message: 'Success',
      data:resp
    };
    } catch (error) {
      return {
        code: 400,
        error: error.message,
        message: 'Error',
      }; 
    }
  }
}
