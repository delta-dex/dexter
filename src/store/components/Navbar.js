// State
const state = {
  brand: "Dexter",
  searching: false,
  search: "",
}

// Getters
var getters = {
  brand: (state, commit, rootState) => state.brand,
  searching: state =>  state.searching,
  search: state =>  state.search,
}

// Mutations
var mutations = {
  ["SET_BRAND"] (state, brand) {
    state.brand = brand
  },
}

// Actions
var actions = {
  
}

export default {
  state,
  getters,
  mutations,
  actions
}
