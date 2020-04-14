<template>
  <div id="app">
    <div class="logo">
      <img class="logo-img" src="./assets/images/logo.png" alt="logo" />
    </div>
    <div class="title">
      <img class="title-img" :src="img_title" alt="logo" />
    </div>
    <!-- 注册 -->
    <form class="input-container" @submit.prevent="formSubmit" v-if="!showSuccess">
      <div class="input-box">
        <div class="prefix" @click="showSheet=true">
          <span>{{defaultCountry.areaCode | repleaseCode}}</span>
          <img :src="arrow_icon" alt />
        </div>
        <input
          type="number"
          v-model.trim="formData.account"
          maxlength="11"
          :placeholder="$t('lang.placeholder_phone')"
          name="account"
          onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          @input="inputHandle($event, 11)"
        />
      </div>
      <div class="input-box code">
        <input
          type="number"
          v-model="formData.code"
          maxlength="6"
          :placeholder="$t('lang.placeholder_code')"
          name="code"
          onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          @input="inputHandle($event, 6)"
        />
        <button
          type="button"
          class="get-code"
          :class="disableCodeBtn ? 'disable-style': ''"
          :disabled="disableCodeBtn"
          @click="getCode"
        >{{countdown_computed}}</button>
      </div>
      <div class="input-box code">
        <input type="password" v-model.trim="formData.password" :placeholder="$t('lang.placeholder_pwd')" />
      </div>
      <div class="btn-group">
        <div class="btn-box">
          <button class="btn submit-btn">{{ $t('lang.btn_submit') }}</button>
        </div>
        <div class="btn-box btn-box-margin">
          <button class="btn download-btn" @click.prevent="downloadApp">
            <img :src="img_download_text" alt />
          </button>
        </div>
      </div>
    </form>
    <!-- 注册成功 -->
    <div class="register-success" v-else>
      <div class="suc-text">{{$t('lang.text_tips')}}</div>
      <div class="btn-box suc-download-btn">
        <button class="btn submit-btn" @click.prevent="downloadApp">{{$t('lang.btn_download')}}</button>
      </div>
    </div>
    <!-- 底部弹框 -->
    <div class="sheets" v-show="showSheet" @click="showSheet=false">
      <div class="sheets-content" @click.stop="(()=> false)">
        <div class="sheets-title"></div>
        <ul class="sheets-body">
          <li
            class="sheets-item"
            v-for="(item, index) in countryList"
            :key="index"
            @click="select(item)"
          >{{item.name}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import MD5 from "crypto-js/md5";
import request from "./utils/request";
import validate from './utils/validate'

// 域名
const host = process.env.VUE_APP_REQUEST_URL;
// api
const api = {
  getCode: host + "h5/verify/code/send", // 获取验证码接口
  country: host + "h5/config/country", // 获取国家和区号
  register: host + "h5/user/register/commit", // 注册接口
  downloadInfo: host + "h5/config/download" // 下载地址信息
};

export default {
  name: "App",
  data() {
    return {
      countryList: [], // 国家列表
      defaultCountry: {}, // 选择的国家
      downloadInfo: null, // app 下载信息
      formData: {
        account: "",
        code: "",
        password: ""
      },
      showSheet: false, // 显示国家选择
      disableCodeBtn: false, // 禁用获取验证码按钮
      countdown: '获取验证码',
      showSuccess: false // 显示注册成功
    };
  },
  computed: {
    img_title() {
      return require('./assets/images/' + this.$t('lang.img_title') + '.png')
    },
    img_download_text() {
      return require('./assets/images/' + this.$t('lang.img_download_text') + '.png')
    },
    arrow_icon() {
      return require(`./assets/images/arrow-${this.showSheet? 'up': 'down'}.png`)
    },
    countdown_computed() {
      if (this.countdown === '获取验证码')
        return this.$t('lang.btn_code_1')
      else if (this.countdown === '重新获取')
        return this.$t('lang.btn_code_2')
      else
        return this.countdown
    }
  },
  filters: {
    repleaseCode(code) {
      return code && code.replace(/^00/g, "+");
    }
  },
  methods: {
    // 获取手机类型
    getPhoneType() {
      let u = window.navigator.userAgent;
      if (u.includes("Android") || u.includes("Linux")) {
        return "android";
      }
      if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) !== null) {
        return "ios";
      }
    },
    // 输入处理：长度限制
    inputHandle(ev, num) {
      let { value, name } = ev.target;
      this.formData[name] = value.slice(0, num);
    },
    // 获取国家地区
    async getCountryList() {
      try {
        this.countryList = await request.get(api.country, {params: {lang: this.$url_query.lang}});
        this.defaultCountry = this.countryList.find( item => item.id === 45);
      } catch (error) {}
    },
    // 获取下载信息
    async getDownloadInfo() {
      try {
        let res = await request.get(api.downloadInfo);
        let phoneType = this.getPhoneType();
        this.downloadInfo = res.version[phoneType];
      } catch (error) {}
    },
    // 获取验证码
    async getCode() {
      const params = {
        target: this.formData.account,
        countryId: this.defaultCountry.id
      };
      if (!validate.phone(params.target, this.defaultCountry.areaCode)) return;

      this.$showToast({ content: this.$t('lang.text_loading'), autoHide: false, showLoading: true });

      try {
        let res = await request.get(api.getCode, {
          params: { data: params }
        });
        this.disableCodeBtn = true;
        this.$hideToast()
        let time = 60;
        this.countdown = time + "s";
        let timer = setInterval(() => {
          time--;
          this.countdown = time + "s";
          if (time === 0) {
            this.disableCodeBtn = false;
            this.countdown = "重新获取";
            clearInterval(timer);
          }
        }, 1000);
      } catch (error) {
        this.$showToast({content: this.$t('lang.validate_phone_2')});
      }
    },
    // 选择国家
    select(item) {
      this.defaultCountry = item;
      this.showSheet = false;
    },
    // 提交注册
    async formSubmit() {
      const { formData } = this;

      if (!validate.phone(formData.account, this.defaultCountry.areaCode)) return;
      if (!validate.code(formData.code)) return;
      if (!validate.password(formData.password)) return;

      this.$showToast({ content: this.$t('lang.text_loading'), autoHide: false, showLoading: true });

      formData.password = MD5(formData.password).toString();
      formData.countryId = this.defaultCountry.id;
      try {
        let res = await request.get(api.register, {
          params: { data: formData }
        });
        this.$hideToast()
        this.showSuccess = true;
      } catch (error) {
        this.$showToast({content: error.message});
      }
    },
    // 下载APP
    async downloadApp() {
      this.$showToast({ content: this.$t('lang.text_loading'), autoHide: false, showLoading: true });
      try {
        await this.getDownloadInfo()
        let link = document.createElement("a");
        link.setAttribute("href", this.downloadInfo.url);
        link.setAttribute("dowload", "");
        link.click();
        this.$hideToast();
      } catch (error) {
        this.$showToast({ content: error.toString() });
      }
    }
  },
  created() {
    this.getCountryList();
    Object.assign(this.formData, this.$url_query)
  }
};
</script>

<style lang="less">
@import '~@/assets/css/reset.css';

input {
  border: none;
  outline: none;
  background: inherit;
  color: #fff;
  font-size: 32px;
  padding: 0 10px 32px;
  width: 100%;
  flex: 1;
}
input::placeholder {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.2);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // background: #020002;
  width: 100%;
  // height: 100vh;
  height: 100%;
  color: #fff;
  .logo {
    padding: 153px 0 0 106px;
    display: inline-block;
    .logo-img {
      width: 450px;
      height: 150px;
    }
  }
  .title {
    margin-top: 52px;
    .title-img {
      width: 560px;
      // height: 33px;
      margin: 0 auto;
    }
  }
  .input-container {
    margin-top: 177px;
    padding: 0 60px;
    text-align: center;
    .input-box {
      border-bottom: 1px solid #333333;
      display: flex;
      align-items: center;
      &.code {
        margin-top: 50px;
      }
      .prefix {
        font-size: 32px;
        color: #fff;
        margin-top: -32px;
        // width: 100px;
        height: 32px;
        line-height: 32px;
        position: relative;
        text-align: left;
        display: flex;
        align-items: center;
        img {
          width: 18px;
          height: 9px;
          display: block;
          margin: 0 24px 0 18px;
        }
      }
      .get-code {
        border: 1px solid rgba(255, 255, 95, 1);
        min-width: 160px;
        padding: 0 10px;
        height: 64px;
        line-height: 64px;
        margin-top: -32px;
        display: inline-block;
        color: #ffff5f;
        font-size: 28px;
        border-radius: 8px;
        background: inherit;
        outline: none;
      }
      .disable-style {
        color: #ccc;
        border-color: #ccc;
      }
    }
  }
  .btn-group {
    margin-top: 156px;
  }
  .btn-box {
    width: 640px;
    height: 80px;
    border-radius: 8px;
    background-image: linear-gradient(
      90deg,
      rgba(252, 0, 255, 1),
      rgba(0, 219, 222, 1)
    );
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      width: 636px;
      height: 76px;
      line-height: 76px;
      border-radius: 8px;
      text-align: center;
      color: #fff;
      font-size: 32px;
      font-weight: 500;
      padding: 0;
      border: none;
      outline: none;
    }
    .submit-btn {
      background: inherit;
    }
    .download-btn {
      background: #020002;
      img {
        // width: 350px;
        height: 30px;
        margin: 0 auto;
      }
    }
  }
  .btn-box-margin {
    margin-top: 40px;
  }
  .register-success {
    // text-align: center;
    margin-top: 209px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .suc-text {
      font-size: 60px;
      font-weight: 500;
      line-height: 60px;
    }
    .suc-download-btn {
      margin-top: 243px;
    }
  }
  .sheets {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    &::before {
      content: "";
      display: inline-block;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.2);
    }
    .sheets-content {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      .sheets-title {
        width: 100%;
        height: 80px;
        background: linear-gradient(
          90deg,
          rgba(249, 83, 198, 1),
          rgba(248, 7, 89, 1)
        );
      }
      .sheets-body {
        padding: 30px 0;
        width: 100%;
        height: 500px;
        background: #111111;
        overflow-y: scroll;
        .sheets-item {
          color: #fff;
          text-align: center;
          height: 38px;
          padding: 10px 0;
        }
      }
    }
  }
}
</style>
