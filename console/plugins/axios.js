import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'

export default (ctx) => {
  const customAxios = axios.create({
    baseURL: process.env.clientBaseURL
  })

  Vue.use(VueAxios, customAxios)

  customAxios.interceptors.request.use((config) => {
    if (config.method === 'get') {
      console.log(config, 111)
      config.url += `?${(new Date()).getTime()}`
    }
    return config
  })

  customAxios.interceptors.response.use((response) => {
    console.log(response)
    if (response.config.method === 'get') {
      // get use snack tip
      if (response.data.code === 0) {
        return response.data.data
      } else {
        ctx.store.commit('setSnackBar', {
          snackBar: true,
          snackMsg: response.data.msg
        })
      }
    } else {
      // other, deal with yourself
      return response.data
    }
  }, (error) => {
    ctx.store.commit('setSnackBar', {
      snackBar: true,
      snackMsg: ctx.app.i18n.t('requestError', ctx.app.store.state.locale)
    })
    return Promise.reject(error)
  })

  return customAxios
}