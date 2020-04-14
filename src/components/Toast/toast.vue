<template>
  <div class="toast" v-if="isShow && content" @click="_hide">
    <div class="container">
      <p v-if="title">{{title}}</p>
      <div class="loading" v-if="showLoading">
        <svg
          t="1586706638526"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="7211"
          width="200"
          height="200"
        >
          <path
            d="M980.752 313.697c-25.789-60.972-62.702-115.725-109.713-162.736-47.012-47.011-101.764-83.924-162.736-109.713C645.161 14.542 578.106 1 509 1c-2.242 0-4.48 0.015-6.715 0.043-16.567 0.211-29.826 13.812-29.615 30.38 0.209 16.438 13.599 29.618 29.99 29.618l0.39-0.002c1.98-0.026 3.963-0.039 5.95-0.039 61.033 0 120.224 11.947 175.93 35.508 53.82 22.764 102.162 55.359 143.683 96.879s74.115 89.862 96.88 143.683C949.054 392.776 961 451.967 961 513c0 16.568 13.432 30 30 30s30-13.432 30-30c0-69.106-13.541-136.162-40.248-199.303z"
            p-id="7212"
            fill="#515151"
          />
        </svg>
      </div>
      <p class="content">{{content}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    content: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 1500
    },
    showLoading: Boolean,
    autoHide: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      isShow: false,
      timer: null
    };
  },

  methods: {
    _show() {
      this.isShow = true;
      if (this.autoHide) {
        this.timer = setTimeout(() => {
          this._hide();
        }, this.duration);
      }
    },
    _hide() {
      if (this.autoHide || this.showLoading) {
        this.isShow = false;
        // this.autoHide = true
        // this.showLoading = false
        clearTimeout(this.timer);
        this.remove();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.toast {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
}
.container {
  color: #333;
  width: 300px;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  font-size: 28px;
}
.loading {
  margin-bottom: 20px;
  width: 50px;
  height: 50px;
  animation: loading 1.5s ease-out infinite;
  transform-origin: 50% 50%;
  display: inline-block;
  svg {
    width: 100%;
    height: 100%;
    color: #fff;
  }
}

@keyframes loading {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>