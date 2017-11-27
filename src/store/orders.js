import Vue from 'vue'
import APIs from './apis'
import BigNumber from 'big-number'

// State
const state = {
  orders: [],
  buy_orders: [],
  sell_orders: [],
  current_market_orders: [],
  current_market_buy_orders: [],
  current_market_sell_orders: [],
  order_form: {
    order_type: "buy",
    price: 0.00,
    volume: 0.00,
    expires: null,
  },
}


// Getters
const getters = {
  order_form: (state) => state.order_form,
  orders: (state) => {
    return state.buy_orders.concat(state.sell_orders)
  },
  buy_orders: (state) => {
    return state.buy_orders.sort((a, b) => { 
      if(a.price > b.price){
        return -1
      }
      if(a.price < b.price){
        return 1
      }
      return 0
    })
  },
  sell_orders: (state) => {
    return state.sell_orders.sort((a, b) => { 
      if(a.price > b.price){
        return 1
      }
      if(a.price < b.price){
        return -1
      }
      return 0
    })
  },
  current_market_orders: (state, commit, rootState) => {
    if(rootState.markets.current_market){
      return state.orders.filter(order => {
        if(order.tokenGet == rootState.markets.current_market.tokenAddr){
          return true
        } else {
          return false
        }
      })      
    } else {
      return state.buy_orders.concat(state.sell_orders)      
    }
  },
  current_market_buy_orders: (state, commit, rootState) => {
    if(rootState.markets.current_market){
      return state.buy_orders.filter(order => {
        if(order.tokenGet == rootState.markets.current_market.tokenAddr){
          return true
        } else {
          return false
        }
      })      
    } else {
      return state.buy_orders
    }
  },
  current_market_sell_orders: (state, commit, rootState) => {
    if(rootState.markets.current_market){
      return state.sell_orders.filter(order => {
        if(order.tokenGive == rootState.markets.current_market.tokenAddr){
          return true
        } else {
          return false
        }
      }).reverse()
    } else {
      return state.sell_orders
    }
  },
}

var formatOrders = function(orders){
  return orders.map(order => {
    order.amount = Math.abs(parseFloat(order.amount) / Math.pow(10, 18))
    order.price = Math.abs(parseFloat(order.price))
    return order
  })
}

// Mutations
const mutations = {
  ["UPDATE_BUY_ORDERS"] (state, orders) {
    state.buy_orders = formatOrders(orders)
  },
  ["UPDATE_SELL_ORDERS"] (state, orders) {
    state.sell_orders = formatOrders(orders)
  },
  ["ADD_BUY_ORDERS"] (state, orders) {
    state.buy_orders = formatOrders(orders).concat(state.buy_orders)
  },
  ["ADD_SELL_ORDERS"] (state, orders) {
    state.sell_orders = formatOrders(orders).concat(state.sell_orders)
  },
  ["UPDATE_ORDER_FORM"] (state, form) {
    state.order_form = form
  },
}

// Actions
const actions = {
  watch_orders: ({commit, state}) => {
    APIs.EtherDelta.socket.on('orders', (orders) => {
      commit("ADD_BUY_ORDERS", orders.buys)
      commit("ADD_SELL_ORDERS", orders.sells)
    })
  },
  creat_order: ({commit, state}, {side, expires, price, amount, token, user}) => {
    APIs.EtherDelta.createOrder(side, expires, price, amount, token, user)
  },
}


export default  {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
