// State
const state = {
  navbar: {
    brand: "Dexter",
    searching: false,
    search: "",
  },
  modal_loader: {
    current_modal: null
  }
}

// Getters
var getters = {
  navbar: (state, commit, rootState) => state.navbar,
  modal_loader: (state, commit, rootState) => state.modal_loader,
}

// Mutations
var mutations = {
  ["UPDATE_NAVBAR"] (state, navbar) {
    state.navbar = navbar
  },
  ["UPDATE_MODAL_LOADER"] (state, modal_loader) {
    state.modal_loader = modal_loader
  },
  ["OPEN_MODAL"] (state, modal) {
    state.modal_loader.current_modal = modal
  },
  ["CLOSE_MODAL"] (state) {
    state.modal_loader.current_modal = null
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
