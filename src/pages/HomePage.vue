<template lang="pug">
#home-page
  .background


  .intro.section
    .left
      h1.brand(:to="{name: 'home'}" tag="span")
        span.delta Delta
        span.dax DAX
    //-   .box
    //-     //- img(src="/DeltaDax/static/deltadax.png")
    //-     img(src="/static/deltadax.png")

    //- .right
    //-   .box
    //-     br
    //-     span A new GDAX inspired UI for EtherDelta, decenteralized ERC20 exchange
    //-     br
    //-     br
    //-     span An attempt to Provide the Ethereum community with a more intuitive way to interact with the EtherDelta exchange
    //-     br
    //-     br
    //-     span Currently only MetaMask compatible
    //-     br
    //-     br
    //-     span Working on re-writting contract and backend to make exchange feeless (only gas)
    //-     br
    //-     br
    //-     span Report an Issue - https://github.com/yintothayang/DeltaDax/issues
    //-     br
    //-     br
    //-     span Contact - yintothayang@gmail.com


  //- .visit.section
  //-       router-link.visit-button(:to="{name: 'exchange'}" tag="span") View Exchange
</template>

<script>
import * as d3 from 'd3'
import moment from 'moment'

export default {
  name: 'HomePage',
  components: {

  },
  mounted(){
    // let t = window.innerWidth * window.innerHeight
    // let n = t / 100

    // let whitegreen = d3.interpolateRgb("#ccc", "#4da53c"),
    //     greenred = d3.interpolateRgb("4da53c", "#ff6939"),
    //     redwhite = d3.interpolateRgb("#ff6939", "#ccc");

    // d3.select(".background").selectAll("div")
    //   .data(d3.range(n))
    //   .enter().append("div").attr("class","square")
    //   .transition()
    //   .delay(function(d, i) { return i + Math.random() * n / 2; })
    //   .ease(d3.easeLinear)
    //   .on("start", function repeat() {
    //     d3.active(this)
    //       .styleTween("background-color", function() { return whitegreen; })
    //       .transition()
    //       .delay(1000)
    //       .styleTween("background-color", function() { return greenred; })
    //       .transition()
    //       .delay(1000)
    //       .styleTween("background-color", function() { return redwhite; })
    //       .transition()
    //       .delay(n)
    //       .on("start", repeat);
    //   });
  },
}
</script>

<style lang="stylus">

#home-page
  display flex
  flex-basis 100%
  flex-wrap wrap
  height 100%
  justify-content center
  // background-image: radial-gradient(#0067CD 0%, #342B34 100%)
  // background-image: radial-gradient(#f7931e, #f15a24 750px)

  background #fff
  height calc(100vh + 50px)
  padding 2em 6em
  position relative
  z-index 2

  .background
    z-index 1
    opacity .2
    position absolute
    top 0
    left 0
    height 100vh
    width 100vw

    div
      width: 10px
      height: 10px
      margin: 1px 0 0 1px
      float: left;
      background: #eee;
      display: inline-block;




  .brand
    font-weight bold
    display flex
    align-items center
    cursor pointer
    padding-bottom .1em
    // border-bottom 5px solid #1E2B34
    margin-bottom 2em

    .delta
      color #0067CD
      font-size 2.1em
      font-family 'Open Sans', sans-serif
      font-weight 600

    .hyph
      color $color-text-invert
      margin-right .1em
      margin-left .1em
      font-size 2em

    .dax
      color rgba(30, 43, 52, 0.83)
      font-size 2em
      font-family 'Russo One', sans-serif
      height 1.0em

  .section
    display flex
    flex-basis 100%
    font-size 18px
    z-index 2

    .box
      border-radius: 12px;
      background-color: #fff;
      box-shadow: 0 2px 4px 0 rgba(60,72,88,.4);
      border: 1px solid #eceff9;
      padding 1em 1em .8em 1em

  .intro
    display flex

    .left
      flex-basis 60%
      margin-right 10em
      font-weight 400

      img
        width 100%

    .right
      flex-basis 40%

      span
        color rgba(0, 0, 0, .9)

      .box
        height 100%
        margin-top 2em
        padding 1em 2em

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
