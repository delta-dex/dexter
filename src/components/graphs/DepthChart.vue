<template lang="pug">
.depth-chart.component
  .header
    span DEPTH CHART
  .body
    .chart-container#chart-container(ref="chart_container")

      
</template>
n
<script>
import * as d3 from 'd3'
import moment from 'moment'
  
import { mapGetters, mapMutations } from 'vuex'  
export default {
  name: 'DepthChart',
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
          this.draw(this.formatData(this.buys, "buy"))
        }
      },
      immediate: true,
      deep: true
    },
    // sells: {
    //   handler: function(newData, oldData){
    //     if(this.sells.length && this.sell_svg){
    //       this.draw(this.formatData(this.buys, this.sells))
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  
  methods: {
    initChart(){
      this.margin = {top: 50, right: 45, bottom: 80, left: 5}
      this.width = this.$refs.chart_container.clientWidth - this.margin.left - this.margin.right
      this.height = this.$refs.chart_container.clientHeight - this.margin.top - this.margin.bottom

      this.svg = d3.select('#chart-container')
        .append("svg:svg")
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      
      this.g = this.svg.append("svg:g")
	      .attr("id","group")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    },
    draw(data){
      log("draw: ", data)
      d3.select("#group").selectAll("*").remove()

      // START
      var x = d3.scaleLinear()
          .rangeRound([0, this.width]);

      var y = d3.scalePow().exponent(2)
          .rangeRound([this.height, 0]);

      var buy_area = d3.area()
          .curve(d3.curveStep)
          .x(d => { return x(d.cum_worth) })
          .y1(d => { return y(d.price) })


      x.domain(d3.extent(data, d => { return d.cum_worth }))
      y.domain([d3.max(data, d => { return d.price }), d3.min(data, d => { return d.price })])
      buy_area.y0(y(0));

      this.g.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x)
              .ticks(10)
              .tickSize(-this.height)
              .tickFormat("")
             )
      
      this.g.append("g")			
        .attr("class", "grid")
        .call(d3.axisLeft(y)
              .ticks(10)
              .tickSize(-this.width)
              .tickFormat("")
             )

      this.g.append("path")
        .datum(data)
        .attr("class", "buy-area")
        .attr("d", buy_area);

      this.g.append("g")
         // .attr("transform", "translate(0," + this.height + ")")
        .attr("class", "axis")
        .call(d3.axisBottom(x)
              .ticks(10)
             )

      this.g.append("g")
        .attr("transform", "translate(" + this.width + ", 0)")
        .attr("class", "axis")
        .call(d3.axisRight(y)
              .ticks(10)
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
      let prices = orders.map(order => {return order.price})
      let max = prices.reduce(function(a, b) {
        return Math.max(a, b);
      });
      let min = prices.reduce(function(a, b) {
        return Math.min(a, b);
      });
      let sd = this.standardDeviation(prices)
      let avg = this.average(prices)
      let cum_worth = 0
      // log("STANDARD!: ", sd)
      // log("AVG!: ", avg)
      // log("MAX!: ", max)
      // log("MIN!: ", min)
      
      orders = orders
        .filter(order => {
          if(type == "buy"){
            if(order.price < (max - sd)){
              return false
            } else {
              return true
            }
          } else {
            if(order.price > (min + sd)){
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
          if(a.price > b.price){
            return -1
          }
          if(a.price < b.price){
            return 1
          }
          return 0
        })
        .map(order => {
          cum_worth += order.total
          order.cum_worth = cum_worth
          return order
        })
      

      return orders
    },
  },
  computed: {
    ...mapGetters([

    ]),
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
    
  .body
    height 100%
    overflow scroll

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
       stroke-width 2px
       stroke-dasharray 1500

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
