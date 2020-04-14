 import context from '@/main'

 // 验证对象
export default {
  // 手机号校验（非严格）
  phone(p) {
    if (!p) {
      context.$showToast({ content: context.$t('lang.validate_phone_1') });
      return false;
    }
    if (!/^1[3456789]\d{9}$/.test(p)) {
      context.$showToast({ content: context.$t('lang.validate_phone_2') });
      return false;
    }
    return true;
  },
  // 验证码校验
  code(c) {
    if (!c) {
      context.$showToast({ content: context.$t('lang.validate_code_1') });
      return false;
    }
    if (c.length < 6) {
      context.$showToast({ content: context.$t('lang.validate_code_2') });
      return false;
    }
    return true;
  },
  // 密码校验（非严格）
  password(p) {
    if (!p) {
      context.$showToast({ content: context.$t('lang.validate_pwd_1') });
      return false;
    }
    if (p.length < 6) {
      context.$showToast({ content: context.$t('lang.validate_pwd_2') });
      return false;
    }
    return true;
  }
};