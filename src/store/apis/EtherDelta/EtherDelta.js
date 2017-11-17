// https://github.com/etherdelta/etherdelta.github.io/blob/master/docs/API.md

import config from './EtherDeltaConfig.json'
import io from 'socket.io-client'
import BigNumber from 'big-number'
// import Web3 from 'web3'

const ABIEtherDelta = require('./EtherDeltaABI.json');
const ABIToken = require('./TokenABI.json');
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
}

export default new EtherDelta()
