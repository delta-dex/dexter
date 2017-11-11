<template lang="pug">
#exchange-page
  .order-form-container
    order-form(:current_market="current_market")
    
  .order-history-container
    order-history(:buys="buy_orders", :sells="sell_orders")
  
  .trade-history-container
    trade-history(:trades="trades")

  
</template>

<script>
import Vue from 'vue'
import TradeHistory from "@/components/TradeHistory"
import OrderHistory from "@/components/OrderHistory"
import OrderForm from "@/components/OrderForm"
import { mapGetters, mapActions } from 'vuex'

import APIs from '../store/apis'

export default {
  name: 'ExchangePage',
  components: {
    TradeHistory,
    OrderHistory,
    OrderForm
  },
  computed: {
    ...mapGetters({
      current_market: 'markets/current_market',
      trades: 'trades/current_market_trades',
      buy_orders: 'orders/current_market_buy_orders',
      sell_orders: 'orders/current_market_sell_orders',
    })
  },
  methods: {
    ...mapActions({
      watchOrders: 'orders/watch_orders',
      watchTrades: 'trades/watch_trades',
      getMarkets: 'markets/get_markets',
    })
  },
  created(){
    this.ed = new APIs.EtherDelta()
    this.ed.initSocket().then(socket => {
      this.getMarkets(socket)      
      this.watchOrders(socket)
      this.watchTrades(socket)
    })
  },
  mounted(){

  }
}
</script>

<style lang="stylus">
#exchange-page
  display flex
  flex-basis 100%
  
  .order-form-container
    flex-basis 15%
  
  .order-history-container
    flex-basis 25%
  
  .trade-history-container
    margin-left auto
    flex-basis 25%
  
  
</style>
