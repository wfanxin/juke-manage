<template>
	<section class="app-container">
		<!--工具条-->
    <el-row >
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="filters.user_name" clearable placeholder="打款人姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.pay_name" clearable placeholder="收款人姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.status" clearable placeholder="请选择状态">
              <el-option label="待审核" :value="0"></el-option>
              <el-option label="审核通过" :value="1"></el-option>
              <el-option label="审核失败" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.level" clearable placeholder="请选择打款类型">
              <el-option label="感恩奖" :value="0"></el-option>
              <el-option label="升级" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <el-table v-loading="loading" :data="data" highlight-current-row style="width: 100%;">
      <el-table-column prop="user_name" label="打款人姓名">
      </el-table-column>
      <el-table-column prop="pay_name" label="收款人姓名">
      </el-table-column>
      <el-table-column prop="pay_method_name" label="打款方式">
      </el-table-column>
      <el-table-column prop="pay_url" label="打款凭证">
        <template slot-scope="scope">
          <el-image style="width: 50px; height: 50px" :src="scope.row.pay_url" :preview-src-list="[scope.row.pay_url]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="打款金额">
      </el-table-column>
      <el-table-column prop="up_level" label="打款类型">
        <template slot-scope="scope">
          <span v-if="scope.row.up_level === 0">感恩奖</span>
          <span v-else>升级</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="提交时间" width="200">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0" style="color: gray;">待审核</span>
          <span v-else-if="scope.row.status === 1" style="color: #21BAA9;">审核通过</span>
          <span v-else-if="scope.row.status === 2" style="color: #f78989;">审核失败</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleStatus(scope.row, 1)" v-if="scope.row.status === 0">通过</el-button>
          <el-button size="small" type="danger" @click="handleStatus(scope.row, 2)" v-if="scope.row.status === 0">失败</el-button>
        </template>
      </el-table-column>
    </el-table>

	  <!--页码-->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" :total="total" style="text-align:center;margin-top:10px">
    </el-pagination>
	</section>
</template>

<script>
import {
  list,
  handleStatus
} from '@/api/payRecord'
import {
  fun_getRole
} from '@/utils/common'

export default {
  data() {
    return {
      roleKey: '',
      filters: {
        user_name: '',
        pay_name: '',
        status: 0,
        level: ''
      },
      loading: false,
      data: [],
      page: 1,
      pageSize: 20,
      total: 0
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
    handleStatus(row, status) {
      let message = '审核通过'
      if (status === 2) {
        message = '审核失败'
      }
      this.$confirm('确认' + message + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleStatus({ id: row.id, status: status }).then(res => {
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
