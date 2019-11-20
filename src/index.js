'use strict'

const fetch = require("node-fetch");
const bip39 = require('bip39');
const bip32 = require('bip32');
const bech32 = require('bech32');
const secp256k1 = require('secp256k1');
const crypto = require('crypto');
const bitcoinjs = require('bitcoinjs-lib');

let HSN = function (url, chainId) {
    this.url = url;
    this.chainId = chainId;
    this.path = "m/44'/118'/0'/0/0";
    this.bech32MainPrefix = "hsn";

    if (!this.url) {
        throw new Error("url object was not set or invalid")
    }
    if (!this.chainId) {
        throw new Error("chainId object was not set or invalid")
    }
}
/**
 * HSN Network
 * @param {*} url LCD URL
 * @param {*} chainId 
 */
function network(url, chainId) {
    return new HSN(url, chainId);
}

function convertStringToBytes(str) {
    if (typeof str !== "string") {
        throw new Error("str expects a string")
    }
    var myBuffer = [];
    var buffer = Buffer.from(str, 'utf8');
    for (var i = 0; i < buffer.length; i++) {
        myBuffer.push(buffer[i]);
    }
    return myBuffer;
}

function getPubKeyBase64(ecpairPriv) {
    const pubKeyByte = secp256k1.publicKeyCreate(ecpairPriv);
    return Buffer.from(pubKeyByte, 'binary').toString('base64');
}

function sortObject(obj) {
    if (obj === null) return null;
    if (typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(sortObject);
    const sortedKeys = Object.keys(obj).sort();
    const result = {};
    sortedKeys.forEach(key => {
        result[key] = sortObject(obj[key])
    });
    return result;
}

HSN.prototype.genMnemonic = function(){
    return bip39.generateMnemonic()//the count of mnemonic is 12
}

/**
 * set the Bech32MainPrefix for hsn network.
 */
HSN.prototype.setBech32MainPrefix = function (bech32MainPrefix) {
    this.bech32MainPrefix = bech32MainPrefix;

    if (!this.bech32MainPrefix) {
        throw new Error("bech32MainPrefix object was not set or invalid")
    }
}

HSN.prototype.setPath = function (path) {
    this.path = path;

    if (!this.path) {
        throw new Error("path object was not set or invalid")
    }
}

HSN.prototype.getAccounts = function (address) {
    let accountsApi = "";
    if (this.chainId.indexOf("hsn") != -1 ||
        this.chainId.indexOf("hsn-testnet") != -1 ||
        this.chainId.indexOf("hsnhub") != -1
    ) {
        accountsApi = "/auth/accounts/";
    }
    return fetch(this.url + accountsApi + address)
        .then(response => response.json())
}

HSN.prototype.getAddress = function (mnemonic) {
    if (typeof mnemonic !== "string") {
        throw new Error("mnemonic expects a string")
    }
    const seed = bip39.mnemonicToSeed(mnemonic);
    const node = bip32.fromSeed(seed);
    const child = node.derivePath(this.path);
    const words = bech32.toWords(child.identifier);
    return bech32.encode(this.bech32MainPrefix, words);
}

HSN.prototype.getECPairPriv = function (mnemonic) {
    if (typeof mnemonic !== "string") {
        throw new Error("mnemonic expects a string")
    }
    const seed = bip39.mnemonicToSeed(mnemonic);
    const node = bip32.fromSeed(seed);
    const child = node.derivePath(this.path);
    const ecpair = bitcoinjs.ECPair.fromPrivateKey(child.privateKey, { compressed: false })
    return ecpair.privateKey;
}

HSN.prototype.NewStdMsg = function (input) {
    const stdSignMsg = new Object;

    if (input.type == "cosmos-sdk/MsgSend") {
        stdSignMsg.json =
            {
                account_number: String(input.account_number),
                chain_id: this.chainId,
                fee: {
                    amount: [
                        {
                            amount: String(input.fee),
                            denom: input.feeDenom
                        }
                    ],
                    gas: String(input.gas)
                },
                memo: input.memo,
                msgs: [
                    {
                        type: input.type,
                        value: {
                            amount: [
                                {
                                    amount: String(input.amount),
                                    denom: input.amountDenom
                                }
                            ],
                            from_address: input.from_address,
                            to_address: input.to_address
                        }
                    }
                ],
                sequence: String(input.sequence)
            }
    } else if (input.type == "cosmos-sdk/MsgDelegate") {
        stdSignMsg.json =
            {
                account_number: String(input.account_number),
                chain_id: this.chainId,
                fee: {
                    amount: [
                        {
                            amount: String(input.fee),
                            denom: input.feeDenom
                        }
                    ],
                    gas: String(input.gas)
                },
                memo: input.memo,
                msgs: [
                    {
                        type: input.type,
                        value: {
                            amount: {
                                amount: String(input.amount),
                                denom: input.amountDenom
                            },
                            delegator_address: input.delegator_address,
                            validator_address: input.validator_address
                        }
                    }
                ],
                sequence: String(input.sequence)
            }
    } else if (input.type == "cosmos-sdk/MsgUndelegate") {
        stdSignMsg.json =
            {
                account_number: String(input.account_number),
                chain_id: this.chainId,
                fee: {
                    amount: [
                        {
                            amount: String(input.fee),
                            denom: input.feeDenom
                        }
                    ],
                    gas: String(input.gas)
                },
                memo: input.memo,
                msgs: [
                    {
                        type: input.type,
                        value: {
                            amount: {
                                amount: String(input.amount),
                                denom: input.amountDenom
                            },
                            delegator_address: input.delegator_address,
                            validator_address: input.validator_address
                        }
                    }
                ],
                sequence: String(input.sequence)
            }
    } else if (input.type == "cosmos-sdk/MsgWithdrawDelegationReward") {
        stdSignMsg.json =
            {
                account_number: String(input.account_number),
                chain_id: this.chainId,
                fee: {
                    amount: [
                        {
                            amount: String(input.fee),
                            denom: input.feeDenom
                        }
                    ],
                    gas: String(input.gas)
                },
                memo: input.memo,
                msgs: [
                    {
                        type: input.type,
                        value: {
                            delegator_address: input.delegator_address,
                            validator_address: input.validator_address
                        }
                    }
                ],
                sequence: String(input.sequence)
            }
    } else if (input.type == "cosmos-sdk/MsgSubmitProposal") {
        stdSignMsg.json =
            {
                account_number: String(input.account_number),
                chain_id: this.chainId,
                fee: {
                    amount: [
                        {
                            amount: String(input.fee),
                            denom: input.feeDenom
                        }
                    ],
                    gas: String(input.gas)
                },
                memo: input.memo,
                msgs: [
                    {
                        type: input.type,
                        value: {
                            description: input.description,
                            initial_deposit: [
                                {
                                    amount: String(input.initialDepositAmount),
                                    denom: input.initialDepositDenom
                                }
                            ],
                            proposal_type: input.proposal_type,
                            proposer: input.proposer,
                            title: input.title
                        }
                    }
                ],
                sequence: String(input.sequence)
            }
    } else if (input.type == "cosmos-sdk/MsgDeposit") {
        stdSignMsg.json =
            {
                account_number: String(input.account_number),
                chain_id: this.chainId,
                fee: {
                    amount: [
                        {
                            amount: String(input.fee),
                            denom: input.feeDenom
                        }
                    ],
                    gas: String(input.gas)
                },
                memo: input.memo,
                msgs: [
                    {
                        type: input.type,
                        value: {
                            amount: [
                                {
                                    amount: String(input.amount),
                                    denom: input.amountDenom
                                }
                            ],
                            depositor: input.depositor,
                            proposal_id: String(input.proposal_id)
                        }
                    }
                ],
                sequence: String(input.sequence)
            }
    } else if (input.type == "cosmos-sdk/MsgVote") {
        stdSignMsg.json =
            {
                account_number: String(input.account_number),
                chain_id: this.chainId,
                fee: {
                    amount: [
                        {
                            amount: String(input.fee),
                            denom: input.feeDenom
                        }
                    ],
                    gas: String(input.gas)
                },
                memo: input.memo,
                msgs: [
                    {
                        type: input.type,
                        value: {
                            option: input.option,
                            proposal_id: String(input.proposal_id),
                            voter: input.voter
                        }
                    }
                ],
                sequence: String(input.sequence)
            }
    } else if (input.type == "cosmos-sdk/MsgBeginRedelegate") {
        stdSignMsg.json =
            {
                account_number: String(input.account_number),
                chain_id: this.chainId,
                fee: {
                    amount: [
                        {
                            amount: String(input.fee),
                            denom: input.feeDenom
                        }
                    ],
                    gas: String(input.gas)
                },
                memo: input.memo,
                msgs: [
                    {
                        type: input.type,
                        value: {
                            amount: {
                                amount: String(input.amount),
                                denom: input.amountDenom
                            },
                            delegator_address: input.delegator_address,
                            validator_dst_address: input.validator_dst_address,
                            validator_src_address: input.validator_src_address
                        }
                    }
                ],
                sequence: String(input.sequence)
            }
    } else if (input.type == "cosmos-sdk/MsgModifyWithdrawAddress") {
        stdSignMsg.json =
            {
                account_number: String(input.account_number),
                chain_id: this.chainId,
                fee: {
                    amount: [
                        {
                            amount: String(input.fee),
                            denom: input.feeDenom
                        }
                    ],
                    gas: String(input.gas)
                },
                memo: input.memo,
                msgs: [
                    {
                        type: input.type,
                        value: {
                            delegator_address: input.delegator_address,
                            withdraw_address: input.withdraw_address
                        }
                    }
                ],
                sequence: String(input.sequence)
            }
    } else {
        throw new Error("No such input.type: " + input.type)
    }

    stdSignMsg.bytes = convertStringToBytes(JSON.stringify(sortObject(stdSignMsg.json)));

    return stdSignMsg;
}

HSN.prototype.sign = function (stdSignMsg, ecpairPriv, modeType = "sync") {
    // The supported return types includes "block"(return after tx commit), "sync"(return afer CheckTx) and "async"(return right away).
    let signMessage = new Object;
    signMessage = stdSignMsg.json;
    const hash = crypto.createHash('sha256').update(JSON.stringify(sortObject(signMessage))).digest('hex');
    const buf = Buffer.from(hash, 'hex');
    let signObj = secp256k1.sign(buf, ecpairPriv);
    var signatureBase64 = Buffer.from(signObj.signature, 'binary').toString('base64');
    let signedTx = new Object;
    if (this.chainId.indexOf("hsn") != -1 ||
        this.chainId.indexOf("hsn-testnet") != -1 ||
        this.chainId.indexOf("hsnhub") != -1
    ) {
        signedTx = {
            "tx": {
                "msg": stdSignMsg.json.msgs,
                "fee": stdSignMsg.json.fee,
                "signatures": [
                    {
                        "signature": signatureBase64,
                        "pub_key": {
                            "type": "tendermint/PubKeySecp256k1",
                            "value": getPubKeyBase64(ecpairPriv)
                        }
                    }
                ],
                "memo": stdSignMsg.json.memo
            },
            "mode": modeType
        }
    }
    return signedTx;
}

HSN.prototype.broadcast = function (signedTx) {
    let broadcastApi = "";
    if (this.chainId.indexOf("hsn") != -1 ||
        this.chainId.indexOf("hsn-testnet") != -1 ||
        this.chainId.indexOf("hsnhub") != -1
    ) {
        broadcastApi = "/txs";
    }
    return fetch(this.url + broadcastApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signedTx)
    })
        .then(response => response.json())
}

module.exports = {
    network: network
}