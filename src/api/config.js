import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lv/mobile/config/list',
    method: 'get',
    params: params
  })
}

export function add(params) {
  return request({
    url: '/lv/mobile/config/add',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/lv/mobile/config/edit',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/lv/mobile/config/del',
    method: 'post',
    data: params
  })
}
