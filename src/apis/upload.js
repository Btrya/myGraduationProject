import axios from 'axios';
import baseUrl from './config.js'
// var baseUrl = process.env.BASE_API;
const urls = {
  getToken: '/getToken',
  uploadQiNiu: 'https://upload-z2.qiniup.com'
}
// 合并请求链接
const apis = Object.keys(urls)
  .reduce((acc, url) => {
    acc[url] = baseUrl + urls[url];
    return acc;
  }, {});

export const getToken = (query) => {
  return axios({
    url: apis.getToken,
    method: 'get',
    params: query
  })
};

export const uploadQiNiu = (query) => {
  return axios({
    url: urls.uploadQiNiu,
    method: 'post',
    data: query
  })
};

