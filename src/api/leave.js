import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/lv/mobile/leave/list',
    method: 'get',
    params: params
  })
}

export function handleStatus(params) {
  return request({
    url: '/lv/mobile/leave/handleStatus',
    method: 'post',
    data: params
  })
}
