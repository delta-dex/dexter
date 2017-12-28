import Vue from 'vue'
import Vuex from 'vuex'

import users from './users'
import markets from './markets.js'
import tokens from './tokens.js'
import orders from './orders.js'
import trades from './trades.js'

import components from './components'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    users: users,
    markets: markets,
    tokens: tokens,
    orders: orders,
    trades: trades,

    // Components
    navbar: components.Navbar,
    modal: components.Modal,
  }
})

export default store
