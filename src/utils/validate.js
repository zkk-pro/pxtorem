 import context from '@/main'

 // 验证对象
export default {
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