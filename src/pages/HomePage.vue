<template lang="pug">
#home-page
  .intro.section
    .left
      h1 DeltaDax
      br
      span A new GDAX inspired UI for EtherDelta, decenteralized ERC20 exchange
      br
      br
      span An attempt to Provide the Ethereum community with a more intuitive way to interact with the EtherDelta exchange
      br
      br
      span Currently only MetaMask compatible
      br
      br
      span Working on re-writting contract and backend to make exchange feeless (only gas)
      br
      br
      span Report an Issue - https://github.com/yintothayang/DeltaDax/issues
      br
      br
      span Contact - yintothayang@gmail.com

    .right
      img(src="/static/deltadax.png")
  .visit.section
        router-link.visit-button(:to="{name: 'exchange'}" tag="span") View Exchange
</template>

<script>

export default {
  name: 'HomePage',
  components: {

  },
  created(){
  },
}
</script>

<style lang="stylus" scoped>
#home-page
  display flex
  flex-basis 100%
  flex-wrap wrap
  height 100%
  justify-content center
  background rgba(0, 0, 0, .1)

  .section
    display flex
    flex-basis 100%
    padding-left 10%
    padding-right 10%
    font-size 18px

  .intro
    display flex
    padding-top 6em

    .left
      flex-basis 40%
      margin-right 2em
      font-weight 400

    .right
      flex-basis 60%
      img
        width 100%


  .visit
    align-items baseline
    justify-content center

    .visit-button
      cursor pointer
      border-radius 4px
      border 2px solid white
      color white
      padding 1em 2em
      transition all .3s
      font-size 22px
      &:hover
        background rgba(255, 255, 255, .3)

</style>
