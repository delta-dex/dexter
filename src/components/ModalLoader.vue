<template lang="pug">
transition(name="fade" mode='out-in')        
  .modal-loader(v-if="currentModal" @click="close" ref="modal_loader")
    .modal-container(ref="modal_container")
      DepositModal(v-if="currentModal === 'DepositModal'")
      WithdrawModal(v-if="currentModal === 'WithdrawModal'")      
    
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import DepositModal from '@/components/DepositModal'
import WithdrawModal from '@/components/WithdrawModal'

export default {
  name: 'ModalLoader',
  components: {
    DepositModal,
    WithdrawModal,
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
