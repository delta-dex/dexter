import APIs from './apis'
import Vue from 'vue'


// State
const state = {
  markets: [],
  currentmarket: {},
  current_market_filter: "",
  filtered_markets: [],
  sorted_markets: []
}
const getters = {
  markets: (state) => state.markets,
}

// Mutations
const mutations = {
  ["UPDATE_MARKETS"] (state, markets) {
    state.markets = markets
  },
}


// Actions
const actions = {
  watch_current_market: ({commit, state}, market) => {
    
  },
  update_current_market: ({dispatch, commit, state, rootState}) => {
    // Remove Listeners
    APIs.EtherDelta.socket.off('trades')
    APIs.EtherDelta.socket.off('orders')

    // Get new Market
    APIs.EtherDelta.socket.emit('getMarket', {
      token: rootState.tokens.current_token.addr,
      user: rootState.users.address
    })

    console.log("getting new market")

    return new Promise((resolve, reject) => {
      APIs.EtherDelta.socket.once('market', (market) => {
        log(market)

        // Update Trades
        commit("trades/UPDATE_TRADES", market.trades, {root: true})

        // Update Orders
        commit("orders/UPDATE_BUY_ORDERS", market.orders.buys, {root: true})
        commit("orders/UPDATE_SELL_ORDERS", market.orders.sells, {root: true})

        // Update Users
        let user_trades = market.myTrades ? market.myTrades : []
        commit("users/UPDATE_TRADES", user_trades, {root: true})

        let user_buy_orders = market.myOrders ? market.myOrders.buys : []
        let user_sell_orders = market.myOrders ? market.myOrders.sells : []
        commit("users/UPDATE_BUY_ORDERS", user_buy_orders, {root: true})
        commit("users/UPDATE_SELL_ORDERS", user_sell_orders, {root: true})

        // Watch stuff
        dispatch("orders/watch_orders", {}, {root: true})
        dispatch("trades/watch_trades", {}, {root: true})
        dispatch("users/update_ed_wallet", {}, {root: true})
        dispatch("users/update_current_wallet", {}, {root: true})

        
        
        resolve(market)
      })
      
      APIs.EtherDelta.socket.on('market', (market) => {
        log("watch market update: ", market)
      })
    })
  },

  watch_current_market: ({commit, state}) => {
    APIs.EtherDelta.socket.on('market', (market) => {
      log("watch market update: ", market)
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
