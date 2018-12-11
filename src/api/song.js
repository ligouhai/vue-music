import axios from 'axios'
import { commonParams } from './config'

export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    g_tk: 5381,
    format: 'json'
  })
  return axios.get(url, {
    header: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
