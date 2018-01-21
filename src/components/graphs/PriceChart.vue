<template lang="pug">
.price-chart.component
  .header
    span PRICE CHART
  .body
    .chart-container#price-chart-container(ref="price_chart_container")

  overlay(:visible="priceChart.loading")
</template>

<script>
import * as d3 from 'd3'
import moment from 'moment'
import Overlay from '@/components/Overlay'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'PriceChart',
  components: {
    Overlay
  },
  data(){
    return {

    }
  },
  props: {
    trades: {
      type: Array,
      default: () => []
    },
  },
  watch: {
    trades: {
      handler: function(newData, oldData){
        if(this.trades.length && this.svg){
          this.draw(this.formatData(this.trades))
        }
      },
      immediate: true,
      deep: true
    },
  },

  methods: {
    initChart(){
      this.margin = {top: 10, right: 5, bottom: 70, left: 50}
      this.width = this.$refs.price_chart_container.clientWidth - this.margin.left - this.margin.right
      this.height = this.$refs.price_chart_container.clientHeight - this.margin.top - this.margin.bottom

      this.svg = d3.select('#price-chart-container')
        .append("svg:svg")
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)

      this.g = this.svg.append("svg:g")
	      .attr("id","price-chart-group")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    },

    draw(trade_data){
      log("trade_data: ", trade_data)
      d3.select("#price-chart-group").selectAll("*").remove()

      // START
      // set the ranges
      this.x = d3.scaleTime().range([0, this.width]);
      this.y = d3.scaleLinear().range([this.height, 0]);

      // define the line
      this.priceLine = d3.line()
          .x(trade => { return this.x(trade.date) })
          .y(trade => { return this.y(trade.price) })

      this.x.domain(d3.extent(trade_data, trade => { return trade.date }))
      this.y.domain([0, d3.max(trade_data, trade => { return trade.price })])

      // Add the valueline path.
      this.g.append("path")
        .data([trade_data])
        .attr("class", "line")
        .attr("d", this.priceLine);

      // Add the X Axis
      this.g.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.x))

      // Add the Y Axis
      this.g.append("g")
        .call(d3.axisLeft(this.y))


      this.g.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.x)
              .ticks(5)
              .tickSize(-this.height)
              .tickFormat("")
             )

      this.g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(this.y)
              .ticks(15)
              .tickSize(-this.width)
              .tickFormat("")
             )

      // Buy Area
      // this.g.append("path")
      //   .datum(buy_data)
      //   .attr("class", "buy-area")
      //   .attr("d", buy_area);

      // Sell Area
      // this.g.append("path")
      //   .datum(sell_data)
      //   .attr("class", "sell-area")
      //   .attr("d", sell_area);

      // this.g.append("g")
      //    // .attr("transform", "translate(0," + this.height + ")")
      //   .attr("class", "axis")
      //   .call(d3.axisBottom(x)
      //         .ticks(5)
      //        )

      // this.g.append("g")
      //   .attr("transform", "translate(" + this.width + ", 0)")
      //   .attr("class", "axis")
      //   .call(d3.axisRight(y)
      //         .ticks(15)
      //        )

    },

    formatData(trades){
      log("trades: " ,trades)
      return trades.map(trade => {
        return {
          volume: trade.amount,
          price: trade.price,
          date:  trade.date,
          total: trade.amount * trade.price
        }
      })
    },
  },

  computed: {
    ...mapGetters({
      priceChart: "components/price_chart",
    }),
  },
  mounted(){
    this.initChart()
  }
}
</script>


<style lang="stylus">
@import "../../styles/main.styl"

.price-chart
  flex-basis 100%
  height 100%
  position relative
  .body
    height 100%
    overflow hidden

    .chart-container
      height 100%
      width 100%

      svg
        shape-rendering crispedges
        height 100%
        width 100%

        text
          dy 10px
          fill transparentify($color-text, 45%)


     .domain
       stroke none
     .tick
       line
         stroke none
     // .axis
     //   stroke $color-text

  .grid line {
    stroke $color-text
    stroke-opacity 0.1
    shape-rendering crispEdges
  }

  path {
    stroke: steelblue
    stroke-width: 2;
    fill: none;
  }

  .grid path {
    stroke-width: 0;
  }

</style>
