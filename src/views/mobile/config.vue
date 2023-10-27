<template>
	<section class="app-container">
    <el-row>
      <el-col :span="6">
        <div class="input-wrap">
          <div class="input-label">网站名称</div>
          <el-input size="mini" class="input-value" v-model="site" placeholder="网站名称"></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <div class="input-wrap">
          <div class="input-label">感恩奖配置</div>
          <el-input size="mini" class="input-value" v-model="award.value" placeholder="额度"></el-input>
          <el-input size="mini" class="input-value" v-model="award.scale" placeholder="比例"></el-input>
          <span style="color: gray; position: relative; left: -5px;">%</span>
        </div>
      </el-col>
    </el-row>
    <el-row v-for="item in grade" :key="item.label">
      <el-col :span="6">
        <div class="input-wrap">
          <div class="input-label">{{ item.label }}</div>
          <el-input size="mini" class="input-value" v-model="item.money" placeholder="升级金额"></el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="input-wrap">
          <el-upload
            class="avatar-uploader"
            :action="upload_url"
            :headers="myHeaders"
            accept="videoAccept"
            :show-file-list="false"
            :on-success="(res, file, fileList) => uploadSuccess(res, file, fileList, item)">
            <el-input size="mini" class="input-value" v-model="item.video" placeholder="点击上传国学视频"></el-input>
          </el-upload>
        </div>
      </el-col>
    </el-row>
    <el-button size="mini" type="primary" style="margin-left: 90px; margin-top: 10px;" @click="saveConfig">保存</el-button>
	</section>
</template>

<script>
import {
  list,
  saveConfig
} from '@/api/config'
import {
  fun_getRole
} from '@/utils/common'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      upload_url: process.env.BASE_API + '/lv/service/uploadFile',
      myHeaders: {
        'X-Token': getToken()
      },
      roleKey: '',
      filters: {},
      loading: false,
      site: '',
      award: [],
      grade: []
    }
  },
  methods: {
    saveConfig() {
      const params = {
        site: this.site,
        award: this.award,
        grade: this.grade
      }
      saveConfig(params).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      }).catch(() => {})
    },
    uploadSuccess(res, file, fileList, item) {
      if (res.code === 0) {
        item.video = res.file
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    getList() {
      const params = Object.assign({}, this.filters)
      params.page = this.page
      params.pageSize = this.pageSize
      this.loading = true
      list(params).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.site = res.site
          this.award = res.award
          this.grade = res.grade
        }
      }).catch(() => { this.loading = false })
    }
  },
  mounted() {
    this.roleKey = fun_getRole()
    this.getList()
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .input-wrap {
    display: flex !important;
    margin-right: 20px;
    line-height: 40px;
    height: 40px;
  }
  .input-label {
    width: 80px;
    margin-right: 10px;
    text-align: right;
  }
  .input-value {
    flex: 1;
    margin-right: 10px;
  }
</style>
