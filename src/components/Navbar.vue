<template lang="pug">
#navbar
  .left
    router-link.brand(:to="{name: 'exchange'}" tag="span") {{brand}}
    .break
    .token-select
      // img(src="https://files.coinmarketcap.com/static/img/coins/32x32/bitcoin.png")
      input(:value="token_filter" @focus="tokenSelectActive = true" @blur="tokenSelectActive = false" @input="onFilterChange")
      i.material-icons arrow_drop_down
      .type-ahead(v-if="tokenSelectActive")
        .token(v-for="token in tokens" @mousedown="onTokenSelect(token)")
          span {{token.name}}
    .break          
    .price-container(v-if="trades && trades.length")
      span.price {{trades[0].price}}
  .center
  .right
    .current-address
      span.address {{address}}
    router-link(:to="{name: 'portfolio', params: {address: address}}")  
      i.material-icons pie_chart
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'  
import APIs from '../store/apis'

export default {
  name: 'Navbar',
  data(){
    return {
      token: "",
      tokenSelectActive: false
    }
  },
  methods: {
    ...mapMutations({
      updateTokenFilter: "tokens/UPDATE_TOKEN_FILTER",
      updateCurrentToken: "tokens/UPDATE_CURRENT_TOKEN",
      openModal: "modal/SET_CURRENT_MODAL",
    }),
    ...mapActions({
      updateCurrentMarket: "markets/update_current_market",      
    }),
    onFilterChange(e){
      this.updateTokenFilter(e.target.value)
    },
    onTokenSelect(token){
      this.openModal("LoadingOverlay")
      this.updateCurrentToken(token)
      this.updateCurrentMarket().then(market => {
        this.openModal(null)
      }, error => {
        this.onTokenSelect()
      })
    }
  },
  computed: {
    ...mapGetters({
      brand: 'brand',
      tokens: 'tokens/filtered_tokens',
      current_token: 'tokens/current_token',
      token_filter: 'tokens/token_filter',
      trades: 'trades/current_token_trades',
      address: 'users/address',
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
      
      
    .token-select
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
        .token
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
    display flex
    align-items center
    
    .current-address
      margin-right 1em
      
      span
        color $color-text-invert
        font-weight 400

    i
      color $color-text-invert
      font-size 28px
      cursor pointer

</style>
