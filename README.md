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

>  Other functions are coming!
