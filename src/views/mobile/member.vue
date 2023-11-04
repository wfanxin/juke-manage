<template>
	<section class="app-container">
		<!--工具条-->
    <el-row >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="filters.mobile" clearable placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.name" clearable placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-form-item>
          <el-form-item style="float: right;" v-if="system_num === 0">
            <el-button type="primary" @click="handleCreateSystem">生成系统会员</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <el-table v-loading="loading" :data="data" highlight-current-row style="width: 100%;">
      <el-table-column prop="mobile" label="手机号">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <el-image v-if="scope.row.avatar" style="width: 50px; height: 50px" :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]"></el-image>
          <div v-else style="width: 50px; height: 50px; border: 1px solid #eee; text-align: center; line-height: 50px; color: #999;">+</div>
        </template>
      </el-table-column>
      <el-table-column prop="level_name" label="等级">
      </el-table-column>
      <el-table-column prop="status_name" label="状态">
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间">
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

	  <!--页码-->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" :total="total" style="text-align:center;margin-top:10px">
    </el-pagination>

    <!--编辑界面-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false" width="600px">
      <el-form :model="editForm" label-width="100px" :rules="formRules" ref="form" style="width: 500px;">
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option
              v-for="item in status_list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="editForm.password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="editForm.cfpassword" placeholder="请输入确认新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="resetForm()">取消</el-button>
        <el-button type="primary" @click="updateData" :loading="editIsLoading">修改</el-button>
      </div>
    </el-dialog>

    <!--生成系统会员-->
    <el-dialog title="生成系统会员" :visible.sync="dialogFormSystemVisible" :close-on-click-modal="false" :show-close="false" width="700px">
      <el-form :model="systemForm" label-width="100px" ref="formsystem" style="width: 500px;">
        <el-form-item label="微信收款码" prop="image">
          <el-upload
            class="avatar-uploader"
            :action="upload_url"
            :headers="myHeaders"
            accept=".jpg, .png, .jpeg"
            :show-file-list="false"
            :on-success="uploadSuccess">
            <img v-if="systemForm.image" :src="systemForm.image" class="avatar" style="width: 100px; height: 100px;">
            <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 100px; height: 100px; line-height: 100px;"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="会员账号">
          <span style="color: red;">账号从上级到下级依次添加</span>
        </el-form-item>
        <el-form-item style="width: 900px; margin-bottom: 0px;" v-for="(item, index) in systemForm.memberList" :key="index">
          <el-input size="mini" v-model="item.mobile" auto-complete="off" style="display: inline-block; width: 200px; margin-right: 10px;" placeholder="手机号"></el-input>
          <el-input size="mini" v-model="item.name" auto-complete="off" style="display: inline-block; width: 200px; margin-right: 10px;" placeholder="姓名"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="resetSystemForm()">取消</el-button>
        <el-button type="primary" @click="createSystemMember" :loading="systemLoading">提交</el-button>
      </div>
    </el-dialog>
	</section>
</template>

<script>
import {
  list,
  edit,
  del,
  createSystemMember
} from '@/api/member'
import { getToken } from '@/utils/auth'
import {
  fun_getRole
} from '@/utils/common'

export default {
  data() {
    return {
      upload_url: process.env.BASE_API + '/lv/service/uploadFile',
      myHeaders: {
        'X-Token': getToken()
      },
      roleKey: '',
      filters: {
        mobile: '',
        name: ''
      },
      editIsLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogTitle: '',
      editForm: {},
      formRules: {
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      dialogFormSystemVisible: false,
      systemForm: {},
      systemLoading: false,
      loading: false,
      data: [],
      page: 1,
      pageSize: 20,
      total: 0,
      system_num: -1,
      status_list: []
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 搜索方法
    handleSearch() {
      this.page = 1
      this.getList()
    },
    updateData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.editForm)
          edit(params).then(res => {
            this.editIsLoading = false
            if (res.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.getList()
            }
          }).catch(() => { this.editIsLoading = false })
        }
      })
    },
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.dialogTitle = '修改'
      this.editForm = {
        id: row.id,
        status: row.status,
        password: '',
        cfpassword: ''
      }
      this.dialogFormVisible = true
    },
    handleDel(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ id: row.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          }
        }).catch(() => {})
      }).catch(() => {})
    },
    resetForm() {
      this.dialogFormVisible = false
      this.$refs['form'].resetFields()
    },
    uploadSuccess(res, file, fileList) {
      if (res.code === 0) {
        this.systemForm.image = res.file
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    handleCreateSystem() {
      this.dialogFormSystemVisible = true
      this.systemForm = {
        image: '',
        memberList: []
      }
      for (let index = 0; index < 20; index++) {
        this.systemForm.memberList.push({
          mobile: '',
          name: ''
        })
      }
    },
    createSystemMember() {
      const params = Object.assign({}, this.systemForm)
      createSystemMember(params).then(res => {
        this.systemLoading = false
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.dialogFormSystemVisible = false
          this.getList()
        }
      }).catch(() => { this.systemLoading = false })
    },
    resetSystemForm() {
      this.dialogFormSystemVisible = false
      this.$refs['formsystem'].resetFields()
    },
    getList() {
      const params = Object.assign({}, this.filters)
      params.page = this.page
      params.pageSize = this.pageSize
      this.loading = true
      list(params).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.total = res.total
          this.data = res.data
          this.system_num = res.system_num
          this.status_list = res.status_list
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
</style>
