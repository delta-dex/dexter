<template lang="pug">
.order-history.component
  .header
    span(@click="openOrders = true" :class="{'active': openOrders}") OPEN ORDERS
    span(@click="openOrders = false" :class="{'active': !openOrders}") FILLED ORDERS

  .body
    .order-list-header
      span.Type Type
      span.volume Volume
      span.price Price
      span.time Time
    .order-list
      .order-container(v-for='order in orders' v-if="orders.length")
        .order(:class="{'buy': order.side == 'buy', 'sell': order.side == 'sell'}")
          .info.type-container
            span.type {{order.side}}
          .info.volume-container
            span.volume {{parseFloat(order.amount).toFixed(3)}}
          .info.price-container
            span.price {{priceFormat(order.price)}}
          .info.time-container
            span.time {{timeFormat(order.date)}}

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'

export default {
  name: 'OrderHistory',
  data(){
    return {
      openOrders: false
    }
  },
  props: {
    open_buys: {
      type: Array,
      default: () => []
    },
    open_sells: {
      type: Array,
      default: () => []
    },
    filled_buys: {
      type: Array,
      default: () => []
    },
    filled_sells: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    ...mapMutations({
      updateOrderForm: 'orders/UPDATE_ORDER_FORM'
    }),
    priceFormat(price){
      return parseFloat(price).toFixed(10)
    },
    timeFormat(dateString){
      let d = new Date(dateString)
      return moment(d).fromNow()
    },
  },
  computed: {
    ...mapGetters({

    }),
    orders(){
      if(!this.openOrders){
        return this.filled_buys.concat(this.filled_sells).sort((a,b) => {
          if(a.date > b.date){
            return 1
          }
          if(a.date > b.date){
            return -1
          }
          return 0
        })
      } else {
        return this.open_buys.concat(this.open_sells).sort((a,b) => {
          if(a.date > b.date){
            return 1
          }
          if(a.date > b.date){
            return -1
          }
          return 0
        })
      }

    }
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
  overflow hidden

  .header
    display flex
    align-items center
    justify-content space-around
    span
      cursor pointer
      margin-right 10px
      color rgba(255, 255, 255, .5) !important
      transition all .2s

      &.active
        color #fff !important
        border-bottom 1px solid white

  .body
    display flex
    flex-wrap wrap
    height 100%

    .order-list-header
      display flex
      flex-basis 100%
      padding 3px 0px
      align-items center
      border-bottom solid 1px lighten($color-component-background, 13%)
      background $color-component-background
      box-shadow 0px 1px 1px 1px rgba(0, 0, 0, .2)
      justify-content space-around

      span
        text-align right
        font-size 13px
        font-weight 400

        &.type
          text-align center
        &.volume
          text-align center
        &.price
          text-align center
        &.fee
          text-align center
        &.time
          text-align center
    .order-list
      display block
      flex-basis 100%
      overflow scroll
      flex-wrap wrap
      height 100%
      overflow scroll

      .order-container
        display flex
        flex-basis 100%
        cursor pointer

        .order
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
            line-height 1
            align-items center
            justify-content center
            flex-basis 25%
            flex-grow 1
            text-align center

          .type-container
            text-transform uppercase
            height 100%


          .volume-container

            height 100%
          .price-container
            line-height 1
            justify-content center
            padding 2px 0px

          .time-container
            line-height 1

          &:hover
            background lighten($color-component-background, 15%)

          &.sell
            span.type
                color $color-red
          &.buy
            span.type
              color $color-green

</style>
