import axios from 'axios';
import baseUrl from './config.js'
// var baseUrl = process.env.BASE_API;
const urls = {
  publish: '/article/publish',
  getIndexArticle: '/article/getIndexArticle'
}
// 合并请求链接
const apis = Object.keys(urls)
  .reduce((acc, url) => {
    acc[url] = baseUrl + urls[url];
    return acc;
  }, {});

// 发布
export const publish = (query) => {
  return axios({
    url: apis.publish,
    method: 'post',
    data: query
  })
};

// 首页获取文章数据
export const getIndexArticle = () => {
  return axios({
    url: apis.getIndexArticle,
    method: 'get'
  })
};
