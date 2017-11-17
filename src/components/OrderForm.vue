<template lang="pug">
.order-form.component
  .header
    span PLACE ORDER
  .body
    .buy-or-sell
      div.button.buy(@click="setOrderType('buy')" :class="{'active': orderType == 'buy'}")
        span BUY
      div.button.sell(@click="setOrderType('sell')" :class="{'active': orderType == 'sell'}")
        span SELL

    .price-container
      span.label Price
      .input-container
        input(placeholder="0.00" type="number" v-model="price")
        span.info ETH

    .amount-container
      span.label Amount
      .input-container
        input(placeholder="0.00" type="number", v-model="volume")
        span.info {{current_market.currency}}


    .total-container
      span.info TOTAL
      span.eth (ETH) 
      span.total {{total}}
      
    .expires-container
      span.label Expires
      .input-container
        input(placeholder="0" type="number")

    .place-order-container
      div.button.place-order(@click="placeOrder()" :class="{'sell': orderType == 'sell'}")
        span PLACE {{orderType.toUpperCase()}} ORDER
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'  
export default {
  name: 'OrderForm',
  data(){
    return {
      orderType: "buy",
      price: 0.00,
      volume: 0.00,
    }
  },
  props: {
    current_market: {
      default: null
    }
  },
  methods: {
    setOrderType(type){
      this.orderType = type
    },
    placeOrder(){

    }
  },
  computed: {
    ...mapGetters([

    ]),
    total(){
      let total = this.price * this.volume
      return total
      // return Math.round(total, -2)
    }
  },
  mounted(){

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
    padding 1em
    
    .buy-or-sell
      display flex
      align-items center
      justify-content center
      flex-basis 100%
      margin-bottom 1em
      
      .button
        font-size 12px
        border none
        border-radius 1px
        background lighten($color-component-background, 5%)
        padding-top 1em
        padding-bottom 1em
        transition all .2s
        
        span
          color white

        &:hover
          background lighten($color-component-background, 15%)
        &.buy
          margin-right 2px
        &.active.buy
          background $color-green-dark
        &.sell
          margin-left 2px
        &.active.sell
          background $color-red

    .amount-container, .price-container, .expires-container
      flex-basis 100%
      display flex
      flex-wrap wrap
      margin-bottom 1em
      .label
        flex-basis 100%
        font-size 10px
        margin-bottom 5px
        font-weight bold
      .input-container
        display flex
        position relative
        flex-basis 100%
        input 
          flex-basis 100%
        .info
          line-height 1
          position absolute
          font-size 12px
          font-weight bold
          top 11px
          right 14px

    .total-container
      display flex
      flex-basis 100%
      align-items center
      margin-bottom 1em
      
      span
        font-weight bold
        font-size 12px
        
        &.eth
          font-size 10px
          font-weight 500
          margin-left 5px
        &.total
          margin-left auto
      
    .place-order-container
      flex-basis 100%
      display flex
      border none
      
      .button
        flex-basis 100%
        border none
        border-radius 3px
        background lighten($color-component-background, 5%)
        padding-top 1.2em
        padding-bottom 1.2em
        background $color-green-dark
        font-size 13px
        transition all .2s
        
        span
          color white
          
        &:hover
          background lighten($color-green-dark, 15%)

        &.sell
          background $color-red
          &:hover
            background lighten($color-red, 15%)


      
</style>
