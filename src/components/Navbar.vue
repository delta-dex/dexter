<template lang="pug">
#navbar
  .left
    p.brand {{brand}}
  .center
    .currency-select
      // span.current-currency(v-if="!currencySelectActive") {{current_market.currency}}
      input(:value="current_market_filter" @focus="currencySelectActive = true" @blur="currencySelectActive = false" @input="onFilterChange")
      .type-ahead(v-if="currencySelectActive && markets.length")
        .market( @mousedown="onMarketSelect('ALL TOKENS')")
          span ALL TOKENS

        .market(v-for="market in markets" @mousedown="onMarketSelect(market)")
          span {{market.currency}}
  .right
    span user
      
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'  

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
      updateCurrentMarket: "markets/UPDATE_CURRENT_MARKET",
      updateCurrentMarketFilter: "markets/UPDATE_CURRENT_MARKET_FILTER"
    }),
    onFilterChange(e){
      this.updateCurrentMarketFilter(e.target.value)
    },
    onMarketSelect(market){
      if(market === "ALL TOKENS"){
        this.updateCurrentMarket(null)
        this.updateCurrentMarketFilter("ALL TOKENS")
      } else {
        this.updateCurrentMarket(market)
        this.updateCurrentMarketFilter(market.currency)
      }
    }
  },
  computed: {
    ...mapGetters({
      brand: 'brand',
      current_market: 'markets/current_market',
      current_market_filter: 'markets/current_market_filter',
      markets: 'markets/filtered_markets'
    })
  },
  

  mounted(){

  }
}
</script>


<style lang="stylus">

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
    .brand
      font-family 'Cinzel', serif !important
      font-size 36px
      color  rgba(44,53,57, 1)


  .center
    flex-grow 1
    display flex
    margin-left auto
    margin-right auto
    justify-content center
    
    .currency-select
      position relative
      input
        font-size 22px
        width 150px
        text-transform uppercase
        border none
        cursor pointer
        
      .type-ahead
        background white
        position absolute
        width 200px
        max-height 300px
        overflow scroll
        border solid 1px rgba(0, 0, 0, .1)
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
            color rgba(0,0,0, .8)

          

  .right
    flex-basis 25%    
    margin-left auto
    margin-right 1em
        
    
</style>
