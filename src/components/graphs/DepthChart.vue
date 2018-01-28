<template lang="pug">
.depth-chart.component
  .header
    span DEPTH CHART
  .body
    .chart-container#depth-chart-container(ref="depth_chart_container")

  overlay(:visible="depthChart.loading")
</template>

<script>
import * as d3 from 'd3'
import moment from 'moment'
import Overlay from '@/components/Overlay'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'DepthChart',
  components: {
    Overlay
  },
  data(){
    return {

    }
  },
  props: {
    buys: {
      type: Array,
      default: () => []
    },
    sells: {
      type: Array,
      default: () => []
    },
  },
  watch: {
    buys: {
      handler: function(newData, oldData){
        if(this.buys.length && this.svg){
          this.draw(this.formatData(this.buys, "buy"), this.formatData(this.sells, "sell"))
        }
      },
      immediate: true,
      deep: true
    },
    sells: {
      handler: function(newData, oldData){
        if(this.sells.length && this.svg){
          this.draw(this.formatData(this.buys, "buy"), this.formatData(this.sells, "sell"))
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    initChart(){
      this.margin = {top: 5, right: 50, bottom: 5, left: 0}
      this.width = this.$refs.depth_chart_container.clientWidth - this.margin.left - this.margin.right
      this.height = this.$refs.depth_chart_container.clientHeight - this.margin.top - this.margin.bottom

      this.svg = d3.select('#depth-chart-container')
        .append("svg:svg")
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)

      this.g = this.svg.append("svg:g")
	      .attr("id","depth-chart-group")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    },
    draw(buy_data, sell_data){
      let all_data = buy_data.concat(sell_data)
      // log("buy_data: ", buy_data)
      // log("sell_data: ", sell_data)
      // log("all_data: ", all_data)

      d3.select("#depth-chart-group").selectAll("*").remove()

      // START
      var x = d3.scaleLinear()
          .rangeRound([0, this.width]);

      var y = d3.scalePow().exponent(2)
          .rangeRound([this.height, 0]);

      var buy_area = d3.area()
          .curve(d3.curveStep)
          .x(d => { return x(d.cum_worth) })
          .y1(d => { return y(d.price) })

      var sell_area = d3.area()
          .curve(d3.curveStep)
          .x(d => { return x(d.cum_worth) })
          .y1(d => { return y(d.price) })


      x.domain(d3.extent(all_data, d => { return d.cum_worth }))
      y.domain([d3.min(all_data, d => { return d.price }), d3.max(all_data, d => { return d.price })])

      buy_area.y0(y(0))
      sell_area.y0(y(1))

      this.g.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x)
              .ticks(5)
              .tickSize(-this.height)
              .tickFormat("")
             )

      this.g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
              .ticks(15)
              .tickSize(-this.width)
              .tickFormat("")
             )

      // Buy Area
      this.g.append("path")
        .datum(buy_data)
        .attr("class", "buy-area")
        .attr("d", buy_area);

      // Sell Area
      this.g.append("path")
        .datum(sell_data)
        .attr("class", "sell-area")
        .attr("d", sell_area);

      this.g.append("g")
         // .attr("transform", "translate(0," + this.height + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(x)
              .ticks(5)
             )

      this.g.append("g")
        .attr("transform", "translate(" + this.width + ", 0)")
        .attr("class", "axis")
        .call(d3.axisRight(y)
              .ticks(15)
             )

    },
    standardDeviation(values){
      var avg = this.average(values);

      var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });

      var avgSquareDiff = this.average(squareDiffs);

      var stdDev = Math.sqrt(avgSquareDiff);
      return stdDev;
    },
    average(data){
      var sum = data.reduce(function(sum, value){
        return sum + value;
      }, 0);

      var avg = sum / data.length;
      return avg;
    },
    formatData(orders, type){
      // log("orders: ", orders)
      let prices = orders.map(order => {return (order.price)})
      let max = prices.reduce(function(a, b) {
        return Math.max(a, b);
      });
      let min = prices.reduce(function(a, b) {
        return Math.min(a, b);
      });
      let sd = this.standardDeviation(prices)
      let avg = this.average(prices)
      let cum_worth = 0

      let min_sell =  this.sells.map(order => {return (order.price)}).reduce((a,b) => {
        return Math.min(a,b)
      })
      let max_buy =  this.buys.map(order => {return (order.price)}).reduce((a,b) => {
        return Math.max(a,b)
      })

      // log("STANDARD!: ", sd)
      // log("AVG!: ", avg)
      // log("MAX!: ", max)
      // log("MIN!: ", min)

      orders = orders
        .filter(order => {
          if(type == "buy"){
            if(order.price < (max * .7) || order.price > min_sell){
              return false
            } else {
              return true
            }
          } else {
            if(order.price > (min * 1.3) || order.price < max_buy){
              return false
            } else {
              return true
            }
          }
        })
        .map(order => {
          return {
            type: type,
            volume: order.amount,
            price: order.price,
            total: order.amount * order.price
          }
        })
        .sort((a, b) => {
          if(a.type == "buy"){
            if(a.price > b.price){
              return -1
            }
            if(a.price < b.price){
              return 1
            }
            return 0
          } else {
            if(a.price > b.price){
              return 1
            }
            if(a.price < b.price){
              return -1
            }
            return 0
          }
        })
        .map(order => {
          cum_worth += order.total
          order.cum_worth = cum_worth
          return order
        })

      // log("formatted orders: ", orders)
      return orders
    },
  },
  computed: {
    ...mapGetters({
      depthChart: "components/depth_chart",
    }),
  },
  mounted(){
    this.initChart()
  }
}
</script>


<style lang="stylus">
@import "../../styles/main.styl"

.depth-chart
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

     .buy-area
       fill transparentify($color-green, 25%)
       stroke $color-green
       stroke-width 1px
       // stroke-dasharray 500

     .sell-area
       fill transparentify($color-red, 25%)
       stroke $color-red
       stroke-width 1px
       // stroke-dasharray 500

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

  .grid path {
    stroke-width: 0;
  }

</style>
