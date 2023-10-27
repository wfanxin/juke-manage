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
      <el-table-column prop="created_at" label="提交时间">
      </el-table-column>
      <el-table-column prop="updated_at" label="审核时间">
      </el-table-column>
    </el-table>

	  <!--页码-->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page" :page-size="pageSize" :total="total" style="text-align:center;margin-top:10px">
    </el-pagination>
	</section>
</template>

<script>
import {
  list
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
        pay_name: ''
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
