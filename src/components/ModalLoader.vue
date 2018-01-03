<template lang="pug">
transition(name="fade" mode='out-in')
  .modal-loader(v-if="currentModal" @click="close" ref="modal_loader")
    .modal-container(ref="modal_container")
      DepositModal(v-if="currentModal === 'DepositModal'")
      WithdrawModal(v-if="currentModal === 'WithdrawModal'")
      OrderModal(v-if="currentModal === 'OrderModal'")
      LoadingOverlay(v-if="currentModal === 'LoadingOverlay'")
      TradeConfirmModal(v-if="currentModal === 'TradeConfirmModal'")

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import DepositModal from '@/components/modals/DepositModal'
import WithdrawModal from '@/components/modals/WithdrawModal'
import OrderModal from '@/components/modals/OrderModal'
import LoadingOverlay from '@/components/LoadingOverlay'
import TradeConfirmModal from '@/components/modals/TradeConfirmModal'

export default {
  name: 'ModalLoader',
  components: {
    DepositModal,
    WithdrawModal,
    OrderModal,
    LoadingOverlay,
    TradeConfirmModal,
  },
  data(){
    return {

    }
  },
  methods: {
    ...mapMutations({
      setCurrentModal: 'modal/SET_CURRENT_MODAL'
    }),

    close(e){
      if(e.target == this.$refs.modal_loader || e.target == this.$refs.modal_container){
        this.setCurrentModal(null)
      }
    }
  },
  computed: {
    ...mapGetters({
      currentModal: 'modal/current_modal'
    }),
  },
  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

.modal-loader
  height 100vh
  width 100vw
  position absolute
  background rgba(0, 0, 0, .4)
  top 0px
  left 0px
  display flex
  align-items center
  justify-content center

  .modal-container
    flex-basis 100%
    display flex
    align-items center
    justify-content center




</style>
