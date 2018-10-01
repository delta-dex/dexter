// https://tokenjar.io/api

import Vue from 'vue'
const base_url = "https://tokenjar.io/api"


export default {
  fetch_all_tickers: () => {
    return new Promise((resolve, reject) => {
      Vue.http.get(base_url + "/cmc/ticker/").then(response => {
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  },
  fetch_ticker: (ticker) => {
    return new Promise((resolve, reject) => {
      Vue.http.get(base_url + "/cmc/ticker/" + ticker).then(response => {
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  },
  fetch_depth: (ticker) => {
    return new Promise((resolve, reject) => {
      Vue.http.get(base_url + "/depth/" + ticker).then(response => {
        resolve(response.body)
      }, error => {
        reject(error)
      })
    })
  },
  
}
