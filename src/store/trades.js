import Vue from 'vue'
import APIs from './apis'

// State
const state = {
  trades: [],
  current_token_trades: []
}

// Getters
const getters = {
  trades: (state) => state.trades,
  current_token_trades: (state, commit, rootState) => {
    return state.trades.filter(trade => {
      if(trade.tokenAddr == rootState.tokens.current_token.addr){
        return true
      } else {
        return false
      }
    })      
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
