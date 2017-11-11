<template lang="pug">
.order-form.component
  .header
    span NEW ORDER
  .body
    .balance-container
      .balance-header
        span BALANCE
      .eth.balance-row
        span.currency ETH
        span.balance 2.9137
      .alt.balance-row(v-if="current_market")
        span.currency {{current_market.currency}}
        span.balance 510.55000
    .action-container
      div.button DEPOSIT
      div.button WITHDRAW
    .new-order-container
      .buy-or-sell
        span buy
        span sell
      
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'  
export default {
  name: 'OrderForm',
  data(){
    return {
      
    }
  },
  props: {
    current_market: {
      default: {}
    }
  },
  methods: {
    
  },
  computed: {
    ...mapGetters([

    ]),
  },
  mounted(){
    log(this.current_market)
  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

.order-form
  display flex
  flex-wrap wrap
  
  .body
    display flex
    flex-wrap wrap
    
    .balance-container
      padding .5em 1em
      flex-basis 100%
      margin-bottom 1em

      .balance-header
        margin-bottom 10px
        span
          font-size 13px
          color white
          font-weight 700
            
      .balance-row
        display flex
        align-items center
        justify-content space-between
        
        span.currency
          font-size 13px
          font-weight 400

        span.balance
          font-size 12px
          font-weight 700

    .action-container
      display flex
      flex-basis 100%
      align-items center
      justify-content space-around
      padding-bottom 1em
      
    .new-order-container
      display flex
      flex-basis 100%
      align-items center
      justify-content space-around
      background lighten($color-component-background, 10%)
      padding-bottom 1em
      
</style>
