import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  /*
  * Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
  * Object.assign(target, ...sources)
  * target:目标对象; sources:源对象
  * */
  const data = Object.assign({},commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url,data,options);
}

export function getDiscList() {
  const url = '/api/getDiscList';
  const data = Object.assign({},commonParams,{
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })

}
