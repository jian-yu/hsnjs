const HSN = require("../src/index");
const expect = require('chai').expect;

const HSNWallet = HSN.network("https://hsn.link","hsn");

describe('test genMnemonic',function(){
    it('the length of mnemonic array must equal to 12',function(){
        let mnemonic = HSNWallet.genMnemonic();
        console.log(mnemonic);
    });
});

describe('test getAddress',function(){
    it('the length of mnemonic array must equal to 12',function(){
        let mnemonic = HSNWallet.genMnemonic();
        HSNWallet.getECPairPriv(mnemonic)
        let address = HSNWallet.getAddress(mnemonic)
        console.log(address);
    });
});