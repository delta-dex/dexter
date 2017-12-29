<template lang="pug">
#exchange-page
  .left-container
    balance(:token="token" :current_wallet="current_wallet" :ed_wallet="ed_wallet")
    order-form(:token="token")

  .orders-container
    order-book(:buys="buy_orders", :sells="sell_orders")
    order-history(:open_buys="user_buy_orders", :open_sells="user_sell_orders", :filled_buys="user_filled_buys", :filled_sells="user_filled_sells")

  .chart-container
    depth-chart(:buys="buy_orders", :sells="sell_orders")

  .trade-history-container
    trade-history(:trades="trades")


</template>

<script>
import Balance from "@/components/Balance"
import TradeHistory from "@/components/TradeHistory"
import OrderHistory from "@/components/OrderHistory"
import OrderBook from "@/components/OrderBook"
import OrderForm from "@/components/OrderForm"
import DepthChart from "@/components/graphs/DepthChart"
import { mapGetters, mapActions, mapMutations } from 'vuex'

import APIs from '../store/apis'

export default {
  name: 'ExchangePage',
  components: {
    TradeHistory,
    OrderHistory,
    OrderBook,
    OrderForm,
    DepthChart,
    Balance,
  },
  computed: {
    ...mapGetters({
      trades: 'trades/current_token_trades',
      buy_orders: 'orders/buy_orders',
      sell_orders: 'orders/sell_orders',
      current_wallet: 'users/current_wallet',
      ed_wallet: 'users/ed_wallet',
      user_filled_buys: 'users/filled_buys',
      user_filled_sells: 'users/filled_sells',
      user_sell_orders: 'users/sell_orders',
      user_buy_orders: 'users/buy_orders',
      tokens: 'tokens/tokens',
      token: 'tokens/current_token',
    })
  },
  methods: {
    ...mapActions({
      watchOrders: 'orders/watch_orders',
      watchTrades: 'trades/watch_trades',
      updateCurrentWallet: 'users/update_current_wallet',
      updateCurrentMarket: 'markets/update_current_market',
      updateEdWallet: 'users/update_ed_wallet',
    }),
    ...mapMutations({
      openModal: "modal/SET_CURRENT_MODAL",
      updateCurrentToken: "tokens/UPDATE_CURRENT_TOKEN",
      updateTokenFilter: "tokens/UPDATE_TOKEN_FILTER",
    }),
    initMarket(){
      this.updateCurrentMarket().then(market => {
        this.openModal(null)
      }, error => {
        this.initMarket()
      })
    }
  },
  watch: {
    trades: function(){
      if(this.trades.length){
        document.title = this.token.name + " " + this.trades[0].price
      }
    }
  },
  created(){
    this.openModal("LoadingOverlay")
    let param_token = null
    if(this.$route.params.token){
      param_token = this.tokens.find(t => {
        return t.name.toLowerCase() == this.$route.params.token.toLowerCase()
      })

      if(param_token){
        this.updateCurrentToken(param_token)
        this.updateTokenFilter(param_token.name)
      }
    }

    APIs.EtherDelta.initSocket().then(socket => {
      this.initMarket()
    })

    this.updateCurrentWallet()
    this.updateEdWallet()
  },
  mounted(){

  }
}
</script>

<style lang="stylus" scoped>
#exchange-page
  display flex
  flex-basis 100%
  height 100%

  .left-container
    flex-basis 15%

  .order-form-container
    flex-basis 15%

  .orders-container
    flex-basis 35%
    flex-wrap wrap

    .order-book
      height 70% !important

    .order-history
      height 30% !important

  .chart-container
    flex-basis 25%

  .trade-history-container
    margin-left auto
    flex-basis 25%


</style>
