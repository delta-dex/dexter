// State
const state = {
  current_modal: null
}

// Getters
var getters = {
  current_modal: state =>  state.current_modal,
}

// Mutations
var mutations = {
  ["SET_CURRENT_MODAL"] (state, modal) {
    state.current_modal = modal
  },
}

// Actions
var actions = {
  
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
