<template lang="pug">
.trade-history.component
  .header
    span TRADE HISTORY
  .body
    table
      thead
        tr
          th Volume
          th Price
          th Time
      tbody
        tr(v-for='trade in trades' :class="{'buy': trade.side == 'buy', 'sell': trade.side == 'sell' }" @click="goToTx(trade.txHash)")
          td.volume
            span {{volumeFormat(trade.amount)}}
          td.price
            span {{priceFormat(trade.price)}}
          td.time
            span {{timeFormat(trade.date)}}

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'  
export default {
  name: 'TradeHistory',
  data(){
    return {
      dateFormatter: new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,        
      })
    }
  },
  props: {
    trades: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    volumeFormat(volume){
      return parseFloat(volume).toFixed(10)
    },
    priceFormat(price){
      return parseFloat(price).toFixed(10)
    },
    timeFormat(dateString){
      let d = new Date(dateString)
      return this.dateFormatter.format(d)
    },
    goToTx(tx){
      window.open('https://etherscan.io/tx/' + tx)
    }
  },
  computed: {
    ...mapGetters([

    ]),
  },

  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

.trade-history
  display flex
  flex-wrap wrap

  .body
    display flex
    flex-wrap wrap

    table
      width 100%
      border-collapse collapse
      table-layout fixed
      th
        padding 3px
        font-size 13px
        font-weight 400        
        border-bottom solid 1px lighten($color-component-background, 13%) 
      td
        font-size 11px
        font-weight 700
        
        &.volume
          text-align right
          padding-right 5%
        &.price
          text-align center
        &.time
          text-align center
          
      tbody
        overflow scroll
        
        tr
          cursor pointer
          &.sell
            td.price
              span
                color #ff4e38
          &.buy
            td.price
              span
                color #15f315
              
          &:hover
            background lighten($color-component-background, 15%)
          
</style>
