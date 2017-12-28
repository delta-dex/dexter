<template lang="pug">
#app
  .navbar-container
    navbar

  .router-view-container
    // transition(name="fade" mode='out-in')
    router-view


  modal-loader

</template>

<script>
import Navbar from '@/components/Navbar'
import ModalLoader from '@/components/ModalLoader'

export default {
  components: {
    Navbar,
    ModalLoader,
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
  height 100%

  .navbar-container
    flex-basis 100%
    height $navbar-height

  .router-view-container
    flex-basis 100%
    height calc(100vh - 50px)


</style>
