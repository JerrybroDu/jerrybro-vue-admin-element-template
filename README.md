## jerrybro-vue-admin-element-template
基于vue-admin-template改造的控制台，在此基础上添加了权限管理(根据账号的roles判断能访问的路由权限)。其他复杂功能未添加，只是多了权限管理。作为模板为后面再次创建控制台项目，直接上手操作即可。

## 技术栈
vue2 + vue-router + vuex + axios + sass （vue-cli4搭建的）

## 启动
```bash
# 克隆项目
git clone https://github.com/JerrybroDu/jerrybro-vue-admin-element-template.git

# 进入项目目录
cd jerrybro-vue-admin-element-template

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev

# 打包
npm run build:prod
```

