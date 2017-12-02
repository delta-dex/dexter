import Vue from 'vue'
import Router from 'vue-router'
import Pages from '@/pages'
import store from '../store'

Vue.use(Router)

const router = new Router({
  base: '/',
  routes: [
    {path: '*', redirect: '/exchange/OMG-ETH'},
    {path: '/exchange/:pair', name: 'exchange', component: Pages.ExchangePage},
    // {path: '/currencies/:symbol', name: 'currency', component: Pages.CurrencyPage},
    // {path: '/arbitrage', name: 'arbitrage', component: Pages.ArbitragePage},
    // {path: '/exchanges/:id', name: 'exchange', component: Pages.ExchangePage},
    // {path: '/users', name: 'users', component: Pages.UsersPagePortfoliosPage},
    // {path: '/profile', name: 'profile', component: Pages.ProfilePage},
    // {path: '/portfolios', name: 'portfolios', component: Pages.PortfoliosPage},
    {path: '/portfolios/:id', name: 'portfolio', component: Pages.PortfolioPage},
    // {path: '/rumors', name: 'rumors', component: Pages.RumorsPage},
  ],
})


// router.beforeEach((to, from, next) => {
//   next()
// })


export default router
