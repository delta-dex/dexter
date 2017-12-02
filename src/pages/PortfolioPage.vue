<template lang="pug">
#protfolio-page

  
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import APIs from '../store/apis'

export default {
  name: 'PortfolioPage',
  components: {

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
    }),
  },
  created(){
    APIs.EtherDelta.initSocket().then(socket => {

    })
    this.updateCurrentWallet()
    this.updateEdWallet()
  },
  mounted(){

  }
}
</script>

<style lang="stylus" scoped>
#portfolio-page
  display flex
  flex-basis 100%
  height 100%
  
  
</style>
