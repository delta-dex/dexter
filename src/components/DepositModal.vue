<template lang="pug">
.deposit.modal.component
  .header
    span DEPOSIT
    i.material-icons(@click="close(null)") close
      
  .body
    .form
      .eth.balance-row
        .left
          span.currency ETH
          input(placeholder="0.00" type="number")
        .right
          .button(@click="depositEth()")  DEPOSIT
          
      .alt.balance-row(v-if="current_market")
        .left
          span.currency {{current_market.currency}}
          input(placeholder="0.00" type="number")
        .right
          .button(@click="depositToken()")  DEPOSIT
        
      
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'  
export default {
  name: 'DepositModal',
  data(){
    return {
      
    }
  },
  methods: {
    ...mapMutations({
      close: "modal/SET_CURRENT_MODAL"
    }),
    depositEth(){

    },
    depositToken(){

    }
  },
  computed: {
    ...mapGetters({
      current_market: 'markets/current_market',
      trades: 'trades/current_market_trades',
      buy_orders: 'orders/current_market_buy_orders',
      sell_orders: 'orders/current_market_sell_orders',
      current_wallet: 'users/current_wallet',
      ed_wallet: 'users/ed_wallet',
    }),
  },
  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"
.deposit
  flex-basis 30% !important
  .body
    display flex
    .form
      display flex
      flex-wrap wrap
      flex-basis 100%
      
      .balance-row
        display flex
        align-items center
        justify-content space-between
        margin-bottom .5em
        align-items center
        flex-basis 100%        

        .left
          display flex
          flex-grow 1
          flex-wrap wrap
          padding-right 2em
          
          span.currency 
            font-size 14px
            font-weight 700

          input
            margin-top 5px
            flex-basis 100%
            
        .right
          height 100%
          display flex
          align-items flex-end
          margin-left auto

          .button
            height 32px
            padding 0px
       
      
</style>
