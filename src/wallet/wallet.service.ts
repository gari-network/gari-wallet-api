import { Injectable } from '@nestjs/common';
// const web3 = require('@solana/web3.js');
import * as web3 from '@solana/web3.js';

import * as splToken from '@solana/spl-token';
@Injectable()
export class WalletService {
  private SOLANA_API: string = process.env.SOLANA_API;
  private connection = new web3.Connection(this.SOLANA_API, 'confirmed');

  private chingariAccountsPublickey;

  private programId;
  private AIRDROP_FEEPAYER_PRIVATE_KEY;

  private chingariWallet;

  private myMint;

  private myToken;

  private ASSOCIATED_TOKEN_PROGRAM_ID;

  constructor() {
    this.programId = new web3.PublicKey(process.env.PROGRAM_ID);
    this.AIRDROP_FEEPAYER_PRIVATE_KEY = new Uint8Array(
      process.env.AIRDROP_FEEPAYER_PRIVATE_KEY.split(',').map((e: any) => e * 1),
    );
    this.chingariWallet = web3.Keypair.fromSecretKey(
      this.AIRDROP_FEEPAYER_PRIVATE_KEY,
    );
    this.myMint = new web3.PublicKey(process.env.GARI_TOKEN_ADDRESS);
    this.myToken = new splToken.Token(
      this.connection,
      this.myMint,
      this.programId,
      this.chingariWallet,
    );

    this.chingariAccountsPublickey = new web3.PublicKey(
      process.env.AIRDROP_FEEPAYER_ASSOCIATED_ACCOUNT,
    );
    this.ASSOCIATED_TOKEN_PROGRAM_ID = new web3.PublicKey(
      process.env.GARI_ASSOCIATED_TOKEN_PROGRAM_ID,
    );
  }
  createWallet() {
    let wallet = web3.Keypair.generate();
    return wallet;
  }
  async getAssociatedAccount(pubkey) {
    try {
      const publicKey = new web3.PublicKey(pubkey);
      const associatedAddress = await splToken.Token.getAssociatedTokenAddress(
        this.ASSOCIATED_TOKEN_PROGRAM_ID, //this is in env
        this.programId,
        this.myMint, //gari
        publicKey, //owner
      );
      return associatedAddress;
    } catch (error) {
      throw error;
    }
  }

  async assocaiatedAccountTransaction(
    associatedAddress,
    pubkey,
    isAssociatedAccount,
  ) {
    let coins = Number(process.env.AIRDROP_AMOUNT);
    const publicKey = new web3.PublicKey(pubkey);
    const instructions = [];
    if (!isAssociatedAccount) {
      instructions.push(
        splToken.Token.createAssociatedTokenAccountInstruction(
          this.ASSOCIATED_TOKEN_PROGRAM_ID,
          this.programId,
          this.myMint,
          associatedAddress,
          publicKey,
          this.chingariWallet.publicKey,
        ),
      );
    }


    instructions.push(
      splToken.Token.createTransferInstruction(
        this.programId,
        this.chingariAccountsPublickey,
        associatedAddress,
        this.chingariWallet.publicKey,
        [],
        coins,
      ),
    );

    const transaction = new web3.Transaction({
      feePayer: new web3.PublicKey(process.env.AIRDROP_FEEPAYER_PUBLIC_KEY),
    }).add(...instructions);
    let blockhashObj = await this.connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhashObj.blockhash;

    transaction.sign(this.chingariWallet);
    let endocdeTransction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
    var signature = await this.connection.sendRawTransaction(
      endocdeTransction,
      { skipPreflight: false },
    );

    return signature;
  }
  async sendData(
    senderPubkeyAta,
    receiverPubkeyAta,
    fromPublicKey,
    receiverPublicKey,
    fromPrivateKey,
    coins,
    isAssociatedAccount,
  ) {

    const fromWalletSecret = new Uint8Array(
      fromPrivateKey.split(',').map((e: any) => e * 1),
    );
    const fromWallet = web3.Keypair.fromSecretKey(
      fromWalletSecret,
    );
    
    
    const instructions = [];
    if (!isAssociatedAccount) {
      instructions.push(
        splToken.Token.createAssociatedTokenAccountInstruction(
          this.ASSOCIATED_TOKEN_PROGRAM_ID,
          this.programId,
          this.myMint,
          new web3.PublicKey(receiverPubkeyAta),
          new web3.PublicKey(receiverPublicKey),
          this.chingariWallet.publicKey,
        ),
      );
    }
    instructions.push(
      splToken.Token.createTransferInstruction(
        this.programId,
        new web3.PublicKey(senderPubkeyAta),
        new web3.PublicKey(receiverPubkeyAta),
        new web3.PublicKey(fromPublicKey),
        [],
        coins,
      ),
    );

    const transaction = new web3.Transaction({
      feePayer: new web3.PublicKey(process.env.AIRDROP_FEEPAYER_PUBLIC_KEY),
    }).add(...instructions);
    

    let blockhashObj = await this.connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhashObj.blockhash;

    transaction.partialSign(fromWallet);

    transaction.partialSign(this.chingariWallet);



    let endocdeTransction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
   
    var signature = await this.connection.sendRawTransaction(
      endocdeTransction,
      { skipPreflight: false },
    );

    return signature;
  }
 
   getBalance(publicKey) {
    const publicKeyOb = new web3.PublicKey(publicKey);
    return  this.connection.getBalance(publicKeyOb);
  }
   getSignature(publicKey) {
       return this.connection.getConfirmedSignaturesForAddress2(publicKey);
  }

  getAccountInfo(publicKey) {
    return this.connection.getParsedAccountInfo(new web3.PublicKey(publicKey));
  }
  getTransactionsBySignature(signature:any) {
    return this.connection.getTransaction(signature);
  }
}
