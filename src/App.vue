<template lang="pug">
#app
  .navbar-container
    navbar
    
  .router-view-container
    // transition(:name="fade" mode='out-in')      
    router-view

</template>

<script>
import Navbar from '@/components/navbar'  
export default {
  components: {
    Navbar
  },
  name: 'app',
  created(){
    console.log("Welcome to the Dexter Exchange")
  },
}
</script>

<style lang="stylus">
@import "./styles/main.styl"

$navbar-height = 50px

#app
  .navbar-container
    flex-basis 100%
    height $navbar-height
    
  .router-view-container
    flex-basis 100%
    height 100vh
    
      
</style>
