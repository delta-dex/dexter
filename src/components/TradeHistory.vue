<template lang="pug">
.trade-history.component
  .header
    span TRADE HISTORY
  .body
    .trade-list-header
      span.volume Volume
      span.price Price
      span.time Time
    .trade-list
      .trade-container(v-for='trade in trades')
        .trade(:class="{'buy': trade.side == 'buy', 'sell': trade.side == 'sell' }" @click="goToTx(trade.txHash)")
          .info.volume-container(:style="tradeStyle(trade)")
            span.volume {{parseFloat(trade.amount).toFixed(3)}}
          .info.price-container
            span.price {{priceFormat(trade.price)}}
          .info.time-container
            span.time {{timeFormat(trade.date)}}


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
    },
    tradeStyle(trade){
      let total = trade.amount * trade.price
      let percent = Math.ceil((total / this.maxAmount) * 100)
      let color = "rgba(132,247,102,.6) "
      if(trade.side == "sell"){
        color = "rgba(255,105,57,.55) "
      }
      let style = "background: linear-gradient(to right," + color + percent + "%, rgba(0, 0, 0, 0)" + percent + "%)"
      return style
    }
  },
  computed: {
    ...mapGetters([

    ]),
    maxAmount(){
      let max = 0
      this.trades.forEach(t => {
        if((t.amount * t.price) > max){
          max = t.amount * t.price
        }
      })
      return max
    }
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
  height 100%

  .body
    display flex
    flex-wrap wrap
    overflow scroll
    height 100%

    .trade-list-header
      display flex
      flex-basis 100%
      padding 3px 0px
      align-items center
      // justify-content space-around
      border-bottom solid 1px lighten($color-component-background, 13%)
      
      span
        text-align right
        font-size 13px
        font-weight 400
        flex-basis 33%
        &.volume
          flex-basis 40%
        &.price
          flex-basis 35%
          text-align center
        &.time
          flex-basis 25%
          text-align center
    .trade-list
      display block
      flex-basis 100%
      overflow scroll
      flex-wrap wrap
      height 100%
      overflow scroll

      .trade-container
        display flex
        flex-basis 100%
        cursor pointer
        
        .trade
          display flex
          flex-basis 100%
          align-items center
          justify-content space-around

          
          span
            font-size 11px
            font-weight 700
            line-height 1

          .info
            display flex
            flex-basis 33%
            line-height 1
            align-items center
            justify-content center
            
          .volume-container
            justify-content flex-end
            flex-basis 40%
            height 100%
          .price-container
            line-height 1
            flex-basis 35%
            justify-content center
            padding 2px 0px
            
          .time-container
            line-height 1
            flex-basis 25%
            
          &.sell
            span.price
              color $color-red
          &.buy
            span.price
              color $color-green
              
          &:hover
            background lighten($color-component-background, 15%)
          
</style>
