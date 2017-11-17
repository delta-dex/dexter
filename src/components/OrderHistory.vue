<template lang="pug">
.order-history.component
  .header
    span ORDERS
  .body
    table
      thead
        tr
          th Volume
          th Price
          // th Total
          th Time
      tbody
        tr.sell(v-for='sell in sells')
          td.volume {{sell.amount.toFixed(3)}}
          td.price {{priceFormat(sell.price)}}
          // td.total {{priceFormat(buy.amount * buy.price)}}        
          td.time {{timeFormat(sell.updated)}}
        tr.buy(v-for='buy in buys')
          td.volume {{buy.amount.toFixed(3)}}
          td.price {{priceFormat(buy.price)}}
          // td.total {{priceFormat(sell.amount * sell.price)}}        
          td.time {{timeFormat(buy.updated)}}
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'  
export default {
  name: 'OrderHistory',
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
    buys: {
      type: Array,
      default: () => []
    },
    sells: {
      type: Array,
      default: () => []
    },    
  },
  methods: {
    volumeFormat(volume){
      return Math.abs(parseFloat(volume))
    },
    priceFormat(price){
      return parseFloat(price).toFixed(10)
    },
    timeFormat(dateString){
      let d = new Date(dateString)
      return this.dateFormatter.format(d)
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

.order-history
  display flex
  flex-wrap wrap
  height 100%
  
  .body
    display flex
    flex-wrap wrap
    overflow scroll
    height 100%
      
    table
      width 100%
      border-collapse collapse
      
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
              color $color-red
          &.buy
            td.price
              color $color-green
              
          &:hover
            background lighten($color-component-background, 15%)
          
</style>
