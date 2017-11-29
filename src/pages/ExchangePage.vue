<template lang="pug">
#exchange-page
  .left-container
    balance(:current_market="current_market" :current_wallet="current_wallet" :ed_wallet="ed_wallet")
    order-form(:current_market="current_market" v-if="current_market")  
    
  .order-history-container
    order-history(:buys="buy_orders", :sells="sell_orders")

  .chart-container  
    depth-chart(:buys="buy_orders", :sells="sell_orders")
  
  .trade-history-container
    trade-history(:trades="trades")

  
</template>

<script>
import Balance from "@/components/Balance"
import TradeHistory from "@/components/TradeHistory"
import OrderHistory from "@/components/OrderHistory"
import OrderForm from "@/components/OrderForm"
import DepthChart from "@/components/graphs/DepthChart"
import { mapGetters, mapActions, mapMutations } from 'vuex'

import APIs from '../store/apis'

export default {
  name: 'ExchangePage',
  components: {
    TradeHistory,
    OrderHistory,
    OrderForm,
    DepthChart,
    Balance,
  },
  computed: {
    ...mapGetters({
      current_market: 'markets/current_market',
      trades: 'trades/current_market_trades',
      buy_orders: 'orders/current_market_buy_orders',
      sell_orders: 'orders/current_market_sell_orders',
      current_wallet: 'users/current_wallet',
      ed_wallet: 'users/ed_wallet',
    })
  },
  methods: {
    ...mapActions({
      watchOrders: 'orders/watch_orders',
      watchTrades: 'trades/watch_trades',
      getMarkets: 'markets/get_markets',
      updateCurrentWallet: 'users/update_current_wallet',
      updateEdWallet: 'users/update_ed_wallet',
      updateCurrentMarket: "markets/update_current_market",
    }),
    ...mapMutations({
      updateCurrentMarketFilter: "markets/UPDATE_CURRENT_MARKET_FILTER",
      openModal: "modal/SET_CURRENT_MODAL",
    }),
    initMarket(current_market){
      this.updateCurrentMarket(current_market).then(market => {
        this.openModal(null)
      }, error => {
        this.initMarket(current_market)
      })
    }
  },
  watch: {
    trades: function(){
      if(this.trades.length && this.current_market){
        document.title = this.current_market.currency + " " + this.trades[0].price
      }
    }
  },
  created(){
    this.openModal("LoadingOverlay")
    let current_market = {
      tokenAddr: "0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6",
      currency: "RDN"
    }

    APIs.EtherDelta.initSocket().then(socket => {
      this.updateCurrentMarketFilter(current_market.currency)
      this.initMarket(current_market)
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
  
  .order-history-container
    flex-basis 35%
    
  .chart-container
    flex-basis 25%
  
  .trade-history-container
    margin-left auto
    flex-basis 25%
  
  
</style>
