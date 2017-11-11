import Vue from 'vue'
import APIs from './apis'

// State
const state = {
  orders: [],
  buy_orders: [],
  sell_orders: [],
  current_market_orders: [],
  current_market_buy_orders: [],
  current_market_sell_orders: [],
}


// Getters
const getters = {
  orders: (state) => {
    return state.buy_orders.concat(state.sell_orders)
  },
  buy_orders: (state) => {
    return state.buy_orders
  },
  sell_orders: (state) => {
    return state.sell_orders
  },
  current_market_orders: (state, commit, rootState) => {
    if(rootState.markets.current_market){
      return state.buy_orders.concat(state.sell_orders).filter(order => {
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
        if(order.tokenGive == rootState.markets.current_market.tokenAddr){
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
        if(order.tokenAddr == rootState.markets.current_market.tokenAddr){
          return true
        } else {
          return false
        }
      })      
    } else {
      return state.sell_orders
    }
  },
}

// Mutations
const mutations = {
  ["ADD_BUY_ORDERS"] (state, orders) {
    state.buy_orders = orders.concat(state.buy_orders).slice(0, 15)
  },
  ["ADD_SELL_ORDERS"] (state, orders) {
    state.sell_orders = orders.concat(state.sell_orders).slice(0, 15)
  },
}

// Actions
const actions = {
  watch_orders: ({commit, state}, socket) => {
    socket.on('orders', (orders) => {
      commit("ADD_BUY_ORDERS", orders.buys)
      commit("ADD_SELL_ORDERS", orders.sells)
    })
  }
}


export default  {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
