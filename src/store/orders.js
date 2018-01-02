import Vue from 'vue'
import APIs from './apis'
import BigNumber from 'big-number'

// State
const state = {
  orders: [],
  buy_orders: [],
  sell_orders: [],
  order_form: {
    order_type: "buy",
    price: 0.00,
    volume: 0.00,
    expires: 10000,
    trade_order: null
  },
}


// Getters
const getters = {
  order_form: (state) => state.order_form,
  orders: (state) => {
    return state.buy_orders.concat(state.sell_orders)
  },
  buy_orders: (state, commit, rootState) => {
    return state.buy_orders
      .filter(order => {
        if(order.tokenGet == rootState.tokens.current_token.addr){
          return true
        } else {
          return false
        }
      })
      .sort((a, b) => {
        if(a.price > b.price){
          return -1
        }
        if(a.price < b.price){
          return 1
        }
        return 0
      })
  },
  sell_orders: (state, commit, rootState) => {
    return state.sell_orders
      .filter(order => {
        if(order.tokenGive == rootState.tokens.current_token.addr){
          return true
        } else {
          return false
        }
      })
      .sort((a, b) => {
        if(a.price > b.price){
          return 1
        }
        if(a.price < b.price){
          return -1
        }
        return 0
      })
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
    state.order_form = Object.assign({}, state.order_form, form)
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
  place_order: ({commit, state}, {tokenGet, amountGet, tokenGive, amountGive, expires, nonce}) => {
    APIs.EtherDelta.placeOrder(tokenGet, amountGet, tokenGive, amountGive, expires, nonce).then(result => {
      log("result ", result)
    }).catch(error => {
      log("error ", error)
    })
  },
  trade: ({commit, state}, {tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount}) => {
    APIs.EtherDelta.trade(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount).then(result => {
      log("result ", result)
    }).catch(error => {
      log("error ", error)
    })
  },
}


export default  {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
