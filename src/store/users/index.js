import APIs from '../apis'
const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

// State
const state = {
  lang: "en-US",
  address: "0x7859df45f9446796d88c909b610e071ddcf82e9b",
  current_wallet: {
    address: "0x7859df45f9446796d88c909b610e071ddcf82e9b",
    balance: "",
    tokens: [
      {
        address: "0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6",
        balance: "0",
        name: "Raiden Network",
        symbol: "RDN"
      }
    ]
  },
  ed_wallet: {
    address: "0x7859df45f9446796d88c909b610e071ddcf82e9b",
    balance: "0.0",
    tokens: [
      {
        address: "0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6",
        balance: "0.0",
        name: "Raiden Network",
        symbol: "RDN"
      }
    ]    
  },
  trades: [],
  buy_orders: [],
  sell_orders: [],
  wallets: [
    // {
    //   address: "",
    //   balance: "",
    //   tokens: [
    //     {
    //       address: "",
    //       balance: ""
    //     }
    //   ]
    // }
  ]
}

// Getters
var getters = {
  ed_wallet: state => state.ed_wallet,
  current_wallet: state => state.current_wallet,
  wallets: state =>  state.wallets,
  lang: state => state.lang,
  address: state => state.address,
  trades: state => state.trades,
  filled_buys: (state) => {
    return state.trades.filter(t => {
      if(t.side == 'buy'){
        return true 
      } else {
        return false
      }
    })
  },
  filled_sells: (state) => {
    return state.trades.filter(t => {
      if(t.side == 'sell'){
        return true 
      } else {
        return false
      }
    })
  },
  buy_orders: state => state.buy_orders,
  sell_orders: state => state.sell_orders,
}

// Mutations
var mutations = {
  ["UPDATE_LANG"] (state, lang) {
    state.lang = lang
  },
  ["UPDATE_CURRENT_WALLET"] (state, wallet) {
    state.current_wallet = wallet
  },
  ["UPDATE_ED_WALLET"] (state, wallet) {
    state.ed_wallet = wallet
  },  
  ["ADD_WALLET"] (state, account) {
    state.accounts.push(account)
  },  
  ["UPDATE_WALLETS"] (state, wallets) {
    state.wallets = wallets
  },
  ["UPDATE_TRADES"] (state, trades) {
    state.trades = trades
  },
  ["UPDATE_BUY_ORDERS"] (state, orders) {
    state.buy_orders = orders
  },
  ["UPDATE_SELL_ORDERS"] (state, orders) {
    state.sell_orders = orders
  },
  
}

// Actions
var actions = {
  save_user: ({ commit, state }) => {
    let user = JSON.stringify(state)
    localStorage.setItem("user", user)
  },
  update_current_wallet: ({ commit, state }) => {
    let wallet = Object.assign({}, state.current_wallet)
    
    // Get ETH Balance
    APIs.EtherDelta.getBalance(ETH_ADDRESS, state.current_wallet.address).then(results => {
      wallet.balance = results
    })

    wallet.tokens.forEach(token => {
      APIs.EtherDelta.getBalance(token.address, state.current_wallet.address).then(results => {
        token.balance = results
      })
    })

    commit("UPDATE_CURRENT_WALLET", wallet)
  },
  update_ed_wallet: ({ commit, state }) => {
    let wallet = Object.assign({}, state.ed_wallet)

    // Get ETH Balance
    APIs.EtherDelta.getEtherDeltaBalance(ETH_ADDRESS, wallet.address).then(results => {
      wallet.balance = results
    })

    wallet.tokens.forEach(token => {
      APIs.EtherDelta.getEtherDeltaBalance(token.address, wallet.address).then(results => {
        token.balance = results
      })
    })
    
    commit("UPDATE_ED_WALLET", wallet)
  },
  
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
