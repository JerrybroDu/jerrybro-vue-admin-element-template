<template>
  <div class="app-container">
    <add-book-form v-if="editable" :form="editBook" @cancel="editable=false" @submit="addBook" />
    <div v-else>
      <el-row type="flex" justify="center" class="add_search">
        <el-col :span="1" class="add_left">
          <el-button type="primary" plain @click="handleAdd">添加</el-button>
        </el-col>
        <el-col :span="6" class="search_right">
          <el-input
            v-model="search"
            clearable
            prefix-icon="el-icon-search"
            placeholder="输入关键字搜索"
            @change="handleSearch"
          />
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="拼命加载中"
        :border="true"
        :fit="true"
        :tooltip-effect="'light'"
      >
        <el-table-column label="ID" width="50" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="书名" width="150" align="center">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column :resizable="false" label="封面" width="150" align="center">
          <template slot-scope="scope">
            <el-image :src="imgBaseUrl + scope.row.url" :preview-src-list="[imgBaseUrl + scope.row.url]" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" :sortable="true" width="90" align="center" />
        <el-table-column prop="introduction" label="简介" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            {{ scope.row.introduction }}
          </template>
        </el-table-column>
        <el-table-column label="时间" width="200" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.create }}</span>
          </template>
        </el-table-column>

        <el-table-column width="300" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              disabled
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getList, getListByName, deleteById, getListById } from '@/api/table'
import addBookForm from '@/components/AddBookForm'

export default {
  components: {
    addBookForm
  },
  data() {
    return {
      list: null,
      listLoading: true,
      imgBaseUrl: 'http://www.jerrybro.cn/',
      search: '',
      editBook: {},
      editable: false // 是否显示，编辑(添加)框
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleSearch() {
      if (this.search) {
        this.listLoading = true
        getListByName(this.search).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      } else {
        this.fetchData()
      }
    },
    handleEdit(index, item) {
      this.editable = true
      getListById(item.id).then(response => {
        this.editBook = {
          'title': item.title,
          'desc': item.introduction,
          'imageUrl': item.url,
          'price': item.price,
          'type': item.type,
          'flag': true,
          'bookId': item.id
        }
      })
    },
    addBook() {
      this.editable = false
      this.fetchData()
    },
    handleDelete(index, item) {
      this.listLoading = true
      deleteById(item.id).then(response => {
        console.log('删除书名：' + item.title, '成功')
      })
      this.fetchData()
    },
    handleAdd() {
      this.editable = true
      this.editBook = {
        'title': '',
        'desc': '',
        'imageUrl': '',
        'price': '',
        'type': ''
      }
    }
  }
}
</script>

<style lang="scss">
.app-container{
  .add_left{
    margin-right: 15px;
    margin-bottom: 5px;
  }
  .search_right{
    width: 400px;
  }
}
</style>
