// State
const state = {
  navbar: {
    brand: "Dexter",
    searching: false,
    search: "",
  },
  modal_loader: {
    current_modal: null
  },
  toast: {
    message: "",
    duration: 2000,
    visible: false
  }
}

// Getters
var getters = {
  navbar: (state) => state.navbar,
  modal_loader: (state) => state.modal_loader,
  toast: (state) => state.toast,
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
  ["OPEN_TOAST"] (state, message) {
    state.toast.message = message
    state.toast.visible = true
    setTimeout(()=> {
      state.toast.visible = false
    }, state.toast.duration)
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
