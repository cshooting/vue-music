import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

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
