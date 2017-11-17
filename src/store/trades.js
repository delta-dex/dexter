import Vue from 'vue'
import APIs from './apis'

// State
const state = {
  trades: [],
}

// Getters
const getters = {
  trades: (state) => state.trades,
  current_market_trades: (state, commit, rootState) => {
    if(rootState.markets.current_market){
      return state.trades.filter(trade => {
        if(trade.tokenAddr == rootState.markets.current_market.tokenAddr){
          return true
        } else {
          return false
        }
      })      
    } else {
      return state.trades
    }
  },
}

// Mutations
const mutations = {
  ["ADD_TRADES"] (state, trades) {
    state.trades = trades.concat(state.trades)
  },
  ["UPDATE_TRADES"] (state, trades) {
    state.trades = trades
  },
  
}

// Actions
const actions = {
  watch_trades: ({commit, state}) => {
    APIs.EtherDelta.socket.on('trades', (trades) => {
      commit("ADD_TRADES", trades)
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
