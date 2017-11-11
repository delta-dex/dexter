// https://github.com/etherdelta/etherdelta.github.io/blob/master/docs/API.md

import Vue from 'vue'
import io from 'socket.io-client'

const base_url = "https://api.etherdelta.com"
const socket_url = "https://socket.etherdelta.com"

export default class EtherDelta {
  constructor() {
    // this.socket.on('connect', this.onConnect.bind(this))
    // this.socket.on('market', this.onMarket.bind(this))
    // this.socket.on('orders', this.onOrders.bind(this))
    // this.socket.on('trades', this.onTrades.bind(this))

    // this.markets = []
    // this.buy_orders = []
    // this.sell_orders = []
    // this.trades = []
  }

  initSocket(){
    let promise = new Promise((resolve, reject) => {
      this.socket = io.connect(socket_url, { transports: ['websocket'] })
      this.socket.on('connect', () => {
        resolve(this.socket)
      })
    });

    return promise
  }

  onConnect(){
    console.log("onConnect")
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

