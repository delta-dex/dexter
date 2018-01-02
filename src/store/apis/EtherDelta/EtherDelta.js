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
    // this.w3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/Ky03pelFIxoZdAUsr82w"))
    this.w3 = new Web3(web3.currentProvider)
    this.contract = this.w3.eth.contract(ABIEtherDelta).at("0x8d12a197cb00d4747a1fe03395095ce2a5cc6819")
    this.contractToken = this.w3.eth.contract(ABIToken)
    this.ed_abi = ABIEtherDelta
    this.token_abi = ABIToken
  }

  initSocket(){
    return new Promise((resolve, reject) => {
      this.socket = io.connect(config.socketServer[0], { transports: ['websocket'] })
      this.socket.on('connect', () => {
        resolve(this.socket)
      })
    });
  }

  getEtherDeltaBalance(tokenAddress, userAddress){
    return new Promise((resolve, reject) => {
      this.contract.balanceOf(tokenAddress, userAddress, (err, result) => {
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

  depositEth(amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contract.deposit(amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  withdrawEth(amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contract.withdraw(amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  approve(token, amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contractToken.at(token).approve("0x8d12a197cb00d4747a1fe03395095ce2a5cc6819", amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  depositToken(token, amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contract.depositToken(token, amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  withdrawToken(token, amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contract.withdrawToken(token, amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  placeOrder(tokenGet, amountGet, tokenGive, amountGive, expires, nonce){
    amountGive = this.w3.toWei(amountGive, 'ether')
    amountGet = this.w3.toWei(amountGet, 'ether')
    log("tokenGet: ", tokenGet)
    log("amountGet: ", amountGet)
    log("tokenGive: ", tokenGive)
    log("amountGive: ", amountGive)
    log("expires: ", expires)
    log("nonce: ", nonce)


    return new Promise((resolve, reject) => {
      this.contract.order(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  cancelOrder(tokenGive, tokenGet, amountGive, amountGet, expires, nonce){
    amountGive = this.w3.toWei(amountGive, 'ether')
    amountGet = this.w3.toWei(amountGet, 'ether')
    this.contract.cancelOrder(tokenGive, tokenGet, amountGive, amountGet, expires, nonce, function(error, result){
      if(!error){
        resolve(result)
      } else {
        reject(error)
      }
    })
  }

  trade(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contract.trade(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }
}

export default new EtherDelta()
