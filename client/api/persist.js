import Cookies from 'universal-cookie'

const cookie = process.browser && new Cookies()

export const getCookie = key => process.browser && cookie.get(key)
export const setCookie = (key, value) => process.browser && cookie.set(key, value, { path: '/' })

export const getLocal = key => process.browser && window.localStorage.getItem(key) || undefined
export const setLocal = (key, value) => process.browser && window.localStorage.setItem(key, value)
