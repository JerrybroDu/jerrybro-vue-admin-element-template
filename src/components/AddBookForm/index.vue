<template>
  <div class="add-book-form-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="书名">
        <el-input v-model="form.title" placeholder="请输入书名" />
      </el-form-item>
      <el-form-item label="封面">
        <el-upload
          class="avatar-uploader"
          action=""
          :auto-upload="false"
          :on-change="imgBroadcastChange"
          accept="image/jpg,image/png,image/jpeg"
          :show-file-list="false"
        >
          <img v-if="form.imageUrl" :src="form.imageUrl.length<50 ? srcUrl + form.imageUrl : form.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model.number="form.price" type="number" placeholder="请输入书的价格" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="form.type" placeholder="请选择书的类型">
          <el-option label="魔幻" value="MAGIC" />
          <el-option label="恐怖" value="HORROR" />
          <el-option label="青春" value="YOUTH" />
          <el-option label="历史" value="HISTORY" />
          <el-option label="科学" value="SCIENCE" />
          <el-option label="都市" value="CITY" />
        </el-select>
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          v-model="form.desc"
          type="textarea"
          placeholder="请输入关于该书的简介"
          maxlength="300"
          show-word-limit
          rows="5"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ form.flag ? '修改' : '创建' }}</el-button>
        <el-button @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addBook, updateBookById } from '@/api/table'
export default {
  props: {
    form: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      srcUrl: 'http://www.jerrybro.cn/'
    }
  },
  // mounted() {
  // },
  methods: {
    onSubmit() {
      const params = {
        'title': this.form.title,
        'introduction': this.form.desc,
        'url': this.form.imageUrl,
        'price': this.form.price,
        'type': this.form.type
      }
      if (!this.form.flag) {
        addBook(params).then(response => {
          console.log('添加成功')
        })
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '<strong>添加成功</strong>',
          type: 'success',
          center: true
        })
      } else {
        updateBookById(this.form.bookId).then(response => {
          console.log('修改成功')
        })
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '<strong>修改成功</strong>',
          type: 'success',
          center: true
        })
      }
      this.$emit('submit')
    },
    imgBroadcastChange(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (isLt2M) {
        // uploadImgToBase64()返回一个Promise对象，通过.then()获取其数据。其中data.result是图片转成的base64值
        this.uploadImgToBase64(file.raw).then(data => { this.form.imageUrl = data.result })
      } else {
        this.$message.error('上传封面图片大小不能超过 2MB!')
      }
    },
    uploadImgToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function() { // 图片转base64完成后返回reader对象
          resolve(reader)
        }
        reader.onerror = reject
      })
    }
  }
}
</script>

<style lang="scss">
.add-book-form-container{
   width: 700px;
   margin: 0 auto;
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    img {
      object-fit: contain;  //（保持纵横比缩放图片，使图片的长边能完全显示出来）
    }
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
}
</style>

