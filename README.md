# MCN-H5（MCN H5注册页）

## 项目运行

### 1、安装依赖
```
npm install
```

### 2、开发阶段运行项目
```
npm run serve
```

### 3、打包项目

- 测试环境打包
```
npm run build:test
```

- 正式环境打包
```
npm run build
```

## 说明

繁体、英文双语言H5页面，根据url参数区分语言，默认为英文(en)

`url例如：http://localhost:8080/?inviteCode=F41QMJ&lang=zh-TW`

url 参数说明：
- inviteCode: 邀请码
- lang: 语言
  + zh-TW: 繁体
  + en: 英文

### 主要技术栈

- vue-cli3
- vue
- axios
- vue-i18n
