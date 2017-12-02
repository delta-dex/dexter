import APIs from './apis'
import Vue from 'vue'

// State
const state = {
  markets: [],
  current_market: {},
  current_market_filter: "",
  filtered_markets: [],
  sorted_markets: []
}
const getters = {
  markets: (state) => state.markets,
  filtered_markets: (state) => {
    if(state.current_market_filter.length){
      return state.markets.filter(m => {
        if(m.currency.toLowerCase().indexOf(state.current_market_filter.toLowerCase()) > -1){
          return true
        } else  {
          return false
        }
      }).sort((a,b) => {
      if(a.currency < b.currency){
        return -1
      }
      if(a.currency > b.currency){
        return 1
      }
      return 0
    })
    } else {
      return state.markets.sort((a,b) => {
      if(a.currency < b.currency){
        return -1
      }
      if(a.currency > b.currency){
        return 1
      }
      return 0
    })
    }
  },
  current_market: (state) => state.current_market,
  current_market_filter: (state) => state.current_market_filter
  
}

// Mutations
const mutations = {
  ["UPDATE_MARKETS"] (state, markets) {
    state.markets = markets
  },
  ["UPDATE_CURRENT_MARKET"] (state, market) {
    state.current_market = market
  },
  ["UPDATE_CURRENT_MARKET_FILTER"] (state, filter) {
    state.current_market_filter = filter
  },  
  
}


// Actions
const actions = {
  watch_current_market: ({commit, state}, market) => {
    
  },
  update_current_market: ({dispatch, commit, state, rootState}, market) => {
    commit("UPDATE_CURRENT_MARKET", market)
    
    // Remove Listeners
    APIs.EtherDelta.socket.off('trades')
    APIs.EtherDelta.socket.off('orders')

    // Get new Market
    APIs.EtherDelta.socket.emit('getMarket', {
      token: market.tokenAddr,
      user: rootState.users.address
    })

    return new Promise((resolve, reject) => {
      APIs.EtherDelta.socket.once('market', (market) => {
        log(market)
        if(market.orders && market.returnTicker && market.trades && market.myTrades && market.myOrders){
          let markets = []
          for(let key in market.returnTicker){
            let m = market.returnTicker[key]
            m.currency = key.split("_")[1]
            markets.push(m)
          }
          
          commit("UPDATE_MARKETS", markets)
          commit("trades/UPDATE_TRADES", market.trades, {root: true})
          commit("orders/UPDATE_BUY_ORDERS", market.orders.buys, {root: true})
          commit("orders/UPDATE_SELL_ORDERS", market.orders.sells, {root: true})


          commit("users/UPDATE_TRADES", market.myTrades, {root: true})
          commit("users/UPDATE_BUY_ORDERS", market.myOrders.buys, {root: true})
          commit("users/UPDATE_SELL_ORDERS", market.myOrders.sells, {root: true})
          
          dispatch("orders/watch_orders", {}, {root: true})
          dispatch("trades/watch_trades", {}, {root: true})
          dispatch("users/update_ed_wallet", {}, {root: true})
          dispatch("users/update_current_wallet", {}, {root: true})
          resolve(market)
        } else {
          reject()
        }
      })
    })
  },

  get_markets: ({commit, state}, tokenAddress, userAddress) => {
    APIs.EtherDelta.socket.emit('getMarket', { token: tokenAddress, user: userAddress })
    APIs.EtherDelta.socket.once('market', (market) => {
      log("GOT MARKET", market)
      let markets = []
      for(let key in market.returnTicker){
        let m = market.returnTicker[key]
        m.currency = key.split("_")[1]
        markets.push(m)
      }
      commit("UPDATE_MARKETS", markets)
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
