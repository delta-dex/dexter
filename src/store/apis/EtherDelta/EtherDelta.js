// https://github.com/etherdelta/etherdelta.github.io/blob/master/docs/API.md

import config from './EtherDeltaConfig.json'
import io from 'socket.io-client'
import BigNumber from 'big-number'

import ABIEtherDelta from './EtherDeltaABI.json'
import ABIToken from './TokenABI.json'
// const sha256 = require('js-sha256').sha256;
// const ethUtil = require('ethereumjs-util');
// const Tx = require('ethereumjs-tx');

class EtherDelta {
  constructor() {
    this.w3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/Ky03pelFIxoZdAUsr82w"))
    this.contractEtherDelta = this.w3.eth.contract(ABIEtherDelta).at("0x8d12a197cb00d4747a1fe03395095ce2a5cc6819")
    this.contractToken = this.w3.eth.contract(ABIToken)
  }

  getEtherDeltaBalance(tokenAddress, userAddress){
    return new Promise((resolve, reject) => {
      this.contractEtherDelta.balanceOf(tokenAddress, userAddress, (err, result) => {
        if (err) reject(err);
        resolve(this.w3.fromWei(result.toNumber(), 'ether'))
      });
    });
  }

  getBalance(tokenAddress, userAddress){
    return new Promise((resolve, reject) => {
      if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        this.w3.eth.getBalance(userAddress, (err, result) => {
          if (err) reject(err);
          resolve(this.w3.fromWei(result.toNumber(), 'ether'))
        });
      } else {
        this.contractToken.at(tokenAddress).balanceOf(userAddress, (err, result) => {
          if (err) reject(err);
          resolve(this.w3.fromWei(result.toNumber(), 'ether'))
        })
      }
    })
  }

  initSocket(){
    return new Promise((resolve, reject) => {
      this.socket = io.connect(config.socketServer[0], { transports: ['websocket'] })
      this.socket.on('connect', () => {
        resolve(this.socket)
      })
    });

  }

  onConnect(){
    this.socket.emit('getMarket', { token: '', user: '' });          
  }
  onMarket(market){
    console.log("onMarket: ", market)    
    this.marktes = market.returnTicker
  }
  onOrders(orders){
    console.log("onOrders: ", orders)    
    this.buy_orders = this.buy_orders.concat(orders.buys)
    this.sell_orders = this.sell_orders.concat(orders.sells)
  }
  
  onTrades(trades){
    console.log("onTrades: ", trades)    
    this.trades = this.trades.concat(trades)
  }

  createOrder(side, expires, price, amount, token, user){
    const zeroPad = (num, places) => {
      const zero = (places - num.toString().length) + 1;
      return Array(+(zero > 0 && zero)).join('0') + num;
    };

    const parseToDigitsArray = (str, base) => {
      const digits = str.split('');
      const ary = [];
      for (let i = digits.length - 1; i >= 0; i -= 1) {
        const n = parseInt(digits[i], base);
        if (isNaN(n)) return null;
        ary.push(n);
      }
      return ary;
    };

    const add = (x, y, base) => {
      const z = [];
      const n = Math.max(x.length, y.length);
      let carry = 0;
      let i = 0;
      while (i < n || carry) {
        const xi = i < x.length ? x[i] : 0;
        const yi = i < y.length ? y[i] : 0;
        const zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i += 1;
      }
      return z;
    };

    const multiplyByNumber = (numIn, x, base) => {
      let num = numIn;
      if (num < 0) return null;
      if (num === 0) return [];
      let result = [];
      let power = x;
      while (true) { // eslint-disable-line no-constant-condition
        if (num & 1) { // eslint-disable-line no-bitwise
          result = add(result, power, base);
        }
        num = num >> 1; // eslint-disable-line operator-assignment, no-bitwise
        if (num === 0) break;
        power = add(power, power, base);
      }
      return result;
    };

    const convertBase = (str, fromBase, toBase) => {
      const digits = parseToDigitsArray(str, fromBase);
      if (digits === null) return null;
      let outArray = [];
      let power = [1];
      for (let i = 0; i < digits.length; i += 1) {
        if (digits[i]) {
          outArray = add(outArray,
                         multiplyByNumber(digits[i], power, toBase), toBase);
        }
        power = multiplyByNumber(fromBase, power, toBase);
      }
      let out = '';
      for (let i = outArray.length - 1; i >= 0; i -= 1) {
        out += outArray[i].toString(toBase);
      }
      if (out === '') out = 0;
      return out;
    };

    const decToHex = (dec, lengthIn) => {
      let length = lengthIn;
      if (!length) length = 32;
      if (dec < 0) {
        // return convertBase((Math.pow(2, length) + decStr).toString(), 10, 16);
        return (new BigNumber(2)).pow(length).add(new BigNumber(dec)).toString(16);
      }
      let result = null;
      try {
        result = convertBase(dec.toString(), 10, 16);
      } catch (err) {
        result = null;
      }
      if (result) {
        return result;
      }
      return (new BigNumber(dec)).toString(16);
    };

    const pack = (dataIn, lengths) => {
      let packed = '';
      const data = dataIn.map(x => x);
      for (let i = 0; i < lengths.length; i += 1) {
        if (typeof (data[i]) === 'string' && data[i].substring(0, 2) === '0x') {
          if (data[i].substring(0, 2) === '0x') data[i] = data[i].substring(2);
          packed += zeroPad(data[i], lengths[i] / 4);
        } else if (typeof (data[i]) !== 'number' && !(data[i] instanceof BigNumber) && /[a-f]/.test(data[i])) {
          if (data[i].substring(0, 2) === '0x') data[i] = data[i].substring(2);
          packed += zeroPad(data[i], lengths[i] / 4);
        } else {
          // packed += zeroPad(new BigNumber(data[i]).toString(16), lengths[i]/4);
          packed += zeroPad(decToHex(data[i], lengths[i]), lengths[i] / 4);
        }
      }
      return packed;
    };

    const sign = (msgToSignIn, privateKeyIn) => {
      const prefixMessage = (msgIn) => {
        let msg = msgIn;
        msg = new Buffer(msg.slice(2), 'hex');
        msg = Buffer.concat([
          new Buffer(`\x19Ethereum Signed Message:\n${msg.length.toString()}`),
          msg]);
        msg = self.web3.sha3(`0x${msg.toString('hex')}`, { encoding: 'hex' });
        msg = new Buffer(msg.slice(2), 'hex');
        return `0x${msg.toString('hex')}`;
      };
      const privateKey = privateKeyIn.substring(0, 2) === '0x' ?
            privateKeyIn.substring(2, privateKeyIn.length) : privateKeyIn;
      const msgToSign = prefixMessage(msgToSignIn);
      try {
        const sig = ethUtil.ecsign(
          new Buffer(msgToSign.slice(2), 'hex'),
          new Buffer(privateKey, 'hex'));
        const r = `0x${sig.r.toString('hex')}`;
        const s = `0x${sig.s.toString('hex')}`;
        const v = sig.v;
        const result = { r, s, v, msg: msgToSign };
        return result;
      } catch (err) {
        throw new Error(err);
      }
    };
    if (side !== 'buy' && side !== 'sell') throw new Error('Side must be buy or sell');
    const amountBigNum = new BigNumber(String(amount));
    const amountBaseBigNum = new BigNumber(String(amount * price));
    const contractAddr = self.config.addressEtherDelta;
    const tokenGet = side === 'buy' ? token.addr : '0x0000000000000000000000000000000000000000';
    const tokenGive = side === 'sell' ? token.addr : '0x0000000000000000000000000000000000000000';
    const amountGet = side === 'buy' ?
              self.toWei(amountBigNum, token.decimals) :
              self.toWei(amountBaseBigNum, 18);
    const amountGive = side === 'sell' ?
              self.toWei(amountBigNum, token.decimals) :
              self.toWei(amountBaseBigNum, 18);
    const orderNonce = Number(Math.random().toString().slice(2));

    const unpacked = [
      contractAddr,
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      expires,
      orderNonce,
    ];

    const condensed = pack(
      unpacked,
      [160, 160, 256, 160, 256, 256, 256]);
    const hash = `0x${sha256(new Buffer(condensed, 'hex'))}`;
    const sig = sign(hash, user.pk);

    const orderObject = {
      amountGet,
      amountGive,
      tokenGet,
      tokenGive,
              contractAddr,
              expires,
              nonce: orderNonce,
              user: user.addr,
              v: sig.v,
              r: sig.r,
              s: sig.s,
              };

    return orderObject;
  };
}

export default new EtherDelta()
