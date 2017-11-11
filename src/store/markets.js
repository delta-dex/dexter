import APIs from './apis'
import Vue from 'vue'

// State
const state = {
  markets: [],
  current_market: null,
  current_market_filter: "ALL TOKENS",
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
  watch_market: ({commit, state}, market) => {
    
  },

  get_markets: ({commit, state}, socket) => {
    socket.emit('getMarket', { token: '', user: '' })
    socket.once('market', (market) => {
      console.log("markets", market)
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
