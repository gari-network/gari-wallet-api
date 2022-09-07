
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


# API DOCS
## /create-new-wallet
```
Create a new wallet in solana blockchain
 ```
## /airdrop
```
Used to do airdrop of 1000000000 Gari, also create and gari associated account if not exists.
```
## /token-transfer
```
This api is to send gari from sender account to receiver account
```
## /get-balance/:publickey
```
this api is use to get the balance on solana block chain using the public key of wallet
```
## /get-transactions/:publickey
```
this api is use to get the transaction done the particular account on blockchain using the public key of wallet
```