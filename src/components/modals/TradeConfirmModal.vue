<template lang="pug">
.trade-confirm.modal.component
  .header
    span.trade-type CONFIRM {{tradeType}}
    i.material-icons(@click="close(null)") close
  .body
    .form
      .field
        .info
          span Amount to {{tradeType}} ({{token.name}})
          span.max(@click="maxAmount()") (max)
        input(v-model="amount" min="0" type="number")
      .field
        .info
          span Price ({{token.name}} / ETH)
        input(v-model="tradeOrder.price" disabled)
      .field.fee
        .info
          span(v-if="tradeType === 'sell'") Fee ({{token.name}})
          span(v-else) Fee (ETH)
          span.amount {{fee.toFixed(10)}}
      .field.order
        .info
          span Order (ETH)
          span.amount {{total.toFixed(10)}}
      .field
        .button(@click="submitTrade()" :class="{'sell': tradeType === 'sell'}")
          span {{tradeType}} {{amount}} {{token.name}} @{{tradeOrder.price}}
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import APIs from '@/store/apis'

export default {
  name: 'TradeConfirmModal',
  data(){
    return {
      amount: 0
    }
  },
  methods: {
    ...mapMutations({
      close: "modal/SET_CURRENT_MODAL"
    }),
    ...mapActions({
      trade: "trades/trade"
    }),
    maxAmount(){
      let max = this.tradeOrder.ethAvailableVolume

      if(max > parseFloat(this.ed_wallet.current_token_balance)){
        log("?????")
        max = this.ed_wallet.current_token_balance
      }
      log(max)
      this.amount = max
    },
    submitTrade(){
      if(this.validTrade){
        let amount = this.amount
        if(this.tradeType === "buy"){
          amount = this.amount * this.tradeOrder.price
        }

        let data = {
          tokenGet: this.tradeOrder.tokenGet,
          amountGet: this.tradeOrder.amountGet,
          tokenGive: this.tradeOrder.tokenGive,
          amountGive: this.tradeOrder.amountGive,
          expires: this.tradeOrder.expires,
          nonce: this.tradeOrder.nonce,
          user: this.tradeOrder.user,
          v: this.tradeOrder.v,
          r: this.tradeOrder.r,
          s: this.tradeOrder.s,
          amount: amount
        }

        // TODO show loading
        this.trade(data)
      }
    }
  },
  computed: {
    ...mapGetters({
      token: 'tokens/current_token',
      tradeOrder: 'trades/trade_order',
      wallet: 'users/current_wallet',
      ed_wallet: 'users/ed_wallet',
    }),
    maxVolume(){
      let max = this.ed_wallet.current_token_balance
      if(max > this.tradeOrder.ethAvailableVolume){
        max = this.tradeOrder.ethAvailableVolume
      }
      return max
    },
    validTrade(){
      if(parseFloat(this.tradeOrder.price) <= 0){
        return false
      }
      if(parseFloat(this.amount) <= 0){
        return false
      }
      if(parseInt(this.tradeOrder.expires) <= 0){
        return false
      }
      return true
    },
    total(){
      if(this.amount == 0 || this.tradeOrder.price == 0){
        return 0
      }

      let total = this.tradeOrder.price * this.amount
      return total
      // return Math.round(total, -2)
    },
    fee(){
      if(this.amount == 0 || this.tradeOrder.price == 0){
        return 0
      }

      if(this.tradeType === 'buy'){
        return parseFloat(this.amount) * parseFloat(this.tradeOrder.price) * .003
      } else {
        return parseFloat(this.amount) * .003
      }

    },
    tradeType(){
      if(this.tradeOrder.tokenGet === "0x0000000000000000000000000000000000000000"){
        return "buy"
      } else {
        return "sell"
      }
    }
   },
  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../../styles/main.styl"

.trade-confirm
  flex-basis 20% !important

  .header
    text-transform uppercase

  .body
    display flex
    .form
      display flex
      flex-wrap wrap
      flex-basis 100%

      .field
        display flex
        flex-basis 100%
        flex-wrap wrap
        margin-bottom .5em

        &.total
          border-top 1px solid white
          padding-top .2em
        .info
          display flex
          align-items center
          flex-basis 100%
          font-size 14px
          font-weight 600
          margin-bottom 5px

          .max
            margin-left auto
            font-weight 800
            font-size 12px
            cursor pointer
          .amount
            color white
            margin-left auto
            font-weight 800
            font-size 14px
            cursor pointer

        input
          flex-basis 100%

        .button
          font-size 16px
          height 30px
          margin-top 1em
          margin-left auto
          flex-basis 100%
          background-color $color-green-dark
          border none
          text-transform uppercase
          &.sell
            background-color $color-red

</style>