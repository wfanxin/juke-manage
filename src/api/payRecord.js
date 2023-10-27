import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lv/mobile/payRecord/list',
    method: 'get',
    params: params
  })
}

export function add(params) {
  return request({
    url: '/lv/mobile/payRecord/add',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/lv/mobile/payRecord/edit',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/lv/mobile/payRecord/del',
    method: 'post',
    data: params
  })
}
