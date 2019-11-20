# HSN JavaScript Library

*Transplant  from [Cosmostation](https://github.com/cosmostation/cosmosjs) and Developing by  [HSN](https://www.hsn.link/)*

## Installation

### NPM

```shell
npm install hsnjs
```

### Import

```javascript
const HSN = require('hsnjs');
```

### Usage

#### local

1. Generate mnemonic

```javascript
const HSN = require('hsnjs');
...
const hsn = HSN.network("https://hsn.link","hsn");
let mnemonic = hsn.genMnemonic();
console.log(mnemonic)
//entry age emotion elbow output paper nut pumpkin eagle fancy indicate inspire
```

2. Get address from mnemonic

```javascript
const HSN = require('hsnjs');
...
const hsn = HSN.network("https://hsn.link","hsn");
let address = hsn.getAddress(mnemonic);
console.log(address);
//hsn1jqs9tu58ws7n0h9sxg0qjaurcskmyrjcqn72je
```

3. Get Prikey from mnemonic

```javascript
const HSN = require('hsnjs');
...
const hsn = HSN.network("https://hsn.link","hsn");
let priKey = hsn.getECPairPriv(mnemonic)
//other code
```

Get account infomation from HSN LCD

```javascript
const HSN = require('hsnjs');
...
const hsn = HSN.network("https://hsn.link","hsn");
hsn.getAccounts(address).then(data =>{
    console.log("the account_number is ",data.value.account_number);
    console.log("the sequence is ",data.value.sequence);
    //more data.value
})
```

> The response jsons maybe found in [HSN-LCD-API](https://documenter.getpostman.com/view/1975930/SVfNuUWc?version=latest)

#### Msg

- MsgSend

```javascript
let stdSignMsg = hsn.NewStdMsg({
	type: "cosmos-sdk/MsgSend",
	from_address: address,
	to_address: "hsn1jqs9tu58ws7n0h9sxg0qjaurcskmyrjcqn72je",
	amountDenom: "hsn",
	amount: 1000000,
	feeDenom: "hsn",
	fee: 5000,
	gas: 200000,
	memo: "",
	account_number: data.value.account_number,
	sequence: data.value.sequence
});
```

- MsgDelegate

 ```javascript
  let stdSignMsg = hsn.NewStdMsg({
  	type: "cosmos-sdk/MsgDelegate",
  	delegator_address: address,
  	validator_address: "hsnvaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4epsluffn",
  	amountDenom: "hsn",
  	amount: 1000000,
  	feeDenom: "hsn",
  	fee: 5000,
  	gas: 200000,
  	memo: "",
  	account_number: data.value.account_number,
  	sequence: data.value.sequence
  });
 ```

- MsgUndelegate

```javascript
 let  stdSignMsg = hsn.NewStdMsg({
  	type: "cosmos-sdk/MsgUndelegate",
  	delegator_address: address,
  	validator_address: "hsnvaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4epsluffn",
  	amountDenom: "hsn",
  	amount: 1000000,
  	feeDenom: "hsn",
  	fee: 5000,
  	gas: 200000,
  	memo: "",
  	account_number: data.value.account_number,
  	sequence: data.value.sequence
  });
```

- MsgWithdrawDelegationReward

```javascript
let stdSignMsg = hsn..NewStdMsg({
	type: "cosmos-sdk/MsgWithdrawDelegationReward",
	delegator_address: address,
	validator_address: "hsnvaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4epsluffn",
	feeDenom: "hsn",
	fee: 5000,
	gas: 200000,
	memo: "",
	account_number: data.value.account_number,
	sequence: data.value.sequence
});
```

- MsgSubmitProposal

```javascript
let stdSignMsg = hsn.NewStdMsg({
	type: "cosmos-sdk/MsgSubmitProposal",
	title: "Activate the Community Pool",
	description: "hsnhub is coming",
	initialDepositDenom: "hsn",
	initialDepositAmount: 1000000,
	proposal_type: "Text",
	proposer: address,
	feeDenom: "hsn",
	fee: 5000,
	gas: 200000,
	memo: "",
	account_number: data.value.account_number,
	sequence: data.value.sequence
});
```

- MsgDeposit

```javascript
let stdSignMsg = hsn.NewStdMsg({
	type: "cosmos-sdk/MsgDeposit",
	depositor: address,
	proposal_id: 1,
	amountDenom: "hsn",
	amount: 1000000,
	feeDenom: "hsn",
	fee: 5000,
	gas: 200000,
	memo: "",
	account_number: data.value.account_number,
	sequence: data.value.sequence
});
```

- MsgBeginRedelegate

```javascript
let stdSignMsg =hsn.NewStdMsg({
	type: "cosmos-sdk/MsgBeginRedelegate",
	delegator_address: address,
	validator_src_address: "hsnvaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4epsluffn",
	validator_dst_address: "hsnvaloper1ec3p6a75mqwkv33zt543n6cnxqwun37rr5xlqv",
	amountDenom: "hsn",
	amount: 1000000,
	feeDenom: "hsn",
	fee: 5000,
	gas: 200000,
	memo: "",
	account_number: data.value.account_number,
	sequence: data.value.sequence
});
```

- MsgModifyWithdrawAddress

```javascript
let stdSignMsg = hsn.NewStdMsg({
	type: "cosmos-sdk/MsgModifyWithdrawAddress",
	delegator_address: address,
	withdraw_address: "hsn1jqs9tu58ws7n0h9sxg0qjaurcskmyrjcqn72je",
	feeDenom: "hsn",
	fee: 5000,
	gas: 200000,
	memo: "",
	account_number: data.value.account_number,
	sequence: data.value.sequence
});
```

- MsgVote

```javascript
let stdSignMsg = hsn.NewStdMsg({
	type: "cosmos-sdk/MsgVote",
	voter: address,
	proposal_id: 1,
	option: "Yes",	// Yes, No, NowithVeto, Abstain
	feeDenom: "hsn",
	fee: 5000,
	gas: 200000,
	memo: "",
	account_number: data.value.account_number,
	sequence: data.value.sequence
});
```

## Example

 Here is a complete transfer process:

```javascript
const HSN = require('hsnjs');
...
const hsn = HSN.network("https://hsn.link","hsn");
hsn.getAccounts(address).then(data =>{
let stdSignMsg = hsn.NewStdMsg({
	type: "cosmos-sdk/MsgSend",
	from_address: address,
	to_address: "hsn1jqs9tu58ws7n0h9sxg0qjaurcskmyrjcqn72je",
	amountDenom: "hsn",
	amount: 1000000,
	feeDenom: "hsn",
	fee: 5000,
	gas: 200000,
	memo: "",
	account_number: data.value.account_number,
	sequence: data.value.sequence
});
});
//...
const signedTx = hsn.sign(stdSignMsg, privKey);//the privKey could generate by your mnemonic  
cosmos.broadcast(signedTx).then(response => {
 //do something after broadcasting the Tx
});
```

> Other functions are coming!
