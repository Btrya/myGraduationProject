import axios from 'axios';
import baseUrl from './config.js'
// var baseUrl = process.env.BASE_API;
const urls = {
  register: '/register',
  login: '/login'
}
// 合并请求链接
const apis = Object.keys(urls)
  .reduce((acc, url) => {
    acc[url] = baseUrl + urls[url];
    return acc;
  }, {});
// 快速登录
// export const getCartList = () => {
//   return axios({
//     url: apis.list,
//     method: 'get'
//   });
// };

// 注册
export const register = (query) => {
  return axios({
    url: apis.register,
    method: 'post',
    data: query
  })
};

// 登录
export const login = (query) => {
  return axios({
    url: apis.login,
    method: 'post',
    data: query
  })
};
