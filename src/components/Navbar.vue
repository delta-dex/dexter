<template lang="pug">
#navbar
  .left
    p.brand {{brand}}
    .break
    .currency-select
      // img(src="https://files.coinmarketcap.com/static/img/coins/32x32/bitcoin.png")
      input(:value="current_market_filter" @focus="currencySelectActive = true" @blur="currencySelectActive = false" @input="onFilterChange")
      i.material-icons arrow_drop_down
      .type-ahead(v-if="currencySelectActive && markets.length")
        .market(v-for="market in markets" @mousedown="onMarketSelect(market)")
          span {{market.currency}}
    .break          
    .price-container(v-if="trades.length")
      span.price {{trades[0].price}}
  .center
  .right
    span user
      
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'  
import APIs from '../store/apis'

export default {
  name: 'Navbar',
  data(){
    return {
      currency: "",
      currencySelectActive: false
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentMarketFilter: "markets/UPDATE_CURRENT_MARKET_FILTER",
      openModal: "modal/SET_CURRENT_MODAL",
    }),
    ...mapActions({
      updateCurrentMarket: "markets/update_current_market",      
    }),
    onFilterChange(e){
      this.updateCurrentMarketFilter(e.target.value)
    },
    onMarketSelect(market){
      this.openModal("LoadingOverlay")
      if(market === "ALL TOKENS"){
        this.updateCurrentMarket(null)
        this.updateCurrentMarketFilter("ALL TOKENS")
      } else {
        this.updateCurrentMarket(market).then(()=>{
          this.openModal(null)
        })
        this.updateCurrentMarketFilter(market.currency)
      }
    }
  },
  computed: {
    ...mapGetters({
      brand: 'brand',
      current_market: 'markets/current_market',
      current_market_filter: 'markets/current_market_filter',
      markets: 'markets/filtered_markets',
      trades: 'trades/current_market_trades',
    }),
  },
  

  mounted(){

  }
}
</script>


<style lang="stylus">
@import "../styles/main.styl"

#navbar
  height 100%
  display flex
  flex-basis 100%
  align-items center
  box-shadow 0px 1px 1px 1px rgba(0, 0, 0, .1)
  background-color white

  .left
    flex-basis 25%
    margin-left 1em
    display flex
    align-items center
    
    .brand
      font-family 'Cinzel', serif !important
      font-size 36px
      color  rgba(44,53,57, 1)
      font-weight bold
      margin-right 20px

    .break
      border-radius 3px
      width 1px
      height 35px
      background rgba(44,53,57, .8)
      margin-right 20px
      
      
    .currency-select
      position relative
      img
        position absolute
        left -20px
      
      input
        font-size 22px
        width 100px
        text-transform uppercase
        border none
        cursor pointer
        color $color-text-invert
        font-size 24px
        background white
        font-weight 400
        // border 1px solid rgba(0, 0, 0, .1)

      i
        color rgba(0, 0, 0, .6)
        font-size 24px
        position absolute
        top 5px
        right 20px
        
      .type-ahead
        background white
        position absolute
        width 100px
        top 40px
        left 0px
        max-height 300px
        overflow scroll
        border solid 1px rgba(0, 0, 0, .1)
        border-top none
        box-shadow 3px 4px 2px 0px rgba(0, 0, 0, .4);
        display flex
        z-index 3
        display block
        .market
          cursor pointer
          flex-basis 100%
          padding 3px 0px
          
          &:hover
            background rgba(0,0,0, .1)
            
          span
            margin-left 10px
            font-size 20px
            color rgba(0,0,0, .8)

    .price-container
      .price
        color $color-text-invert
        font-weight 400
        
  .center
    flex-grow 1

  .right
    flex-basis 25%    
    margin-left auto
    margin-right 1em
        
    
</style>
