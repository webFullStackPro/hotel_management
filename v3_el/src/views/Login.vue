<script setup lang="ts">
import {reactive, ref} from 'vue';
import {useCaptcha} from '@/composables/useCaptcha'
import {useRouter} from 'vue-router'
import type {LoginForm} from '@/types/req/loginForm'
import userApi from '@/api/userApi'
import type {FormInstance} from 'element-plus';
import {ElMessage} from 'element-plus'
import type {LoginSession} from "@/types/resp/loginSession";
import type {Result} from '@/types/result'
import { ADMIN_USERNAME, PASSWORD } from '@/const'

const loading = ref<boolean>(false)
const loginFormRef = ref<FormInstance | null>(null);
const loginForm = reactive<LoginForm>({
  username: ADMIN_USERNAME,
  password: PASSWORD,
  verificationCode: ''
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
});

const refreshCaptcha = () => {
  loginForm.verificationCode = ''
  loginForm.username = ADMIN_USERNAME
  loginForm.password = PASSWORD
  drawCaptcha()
}

const { generatedVerificationCode, drawCaptcha } = useCaptcha()
const router = useRouter()
const onLogin = async () => {
  loading.value = true
  try {
    if (generatedVerificationCode.value.toLowerCase() !== loginForm.verificationCode.toLowerCase()) {
      ElMessage.error('验证码错误')
      refreshCaptcha()
      return
    }
    if (!loginFormRef.value) {
      ElMessage.error('表单引用未初始化')
      return
    }
    loginFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        const resp: Result<LoginSession> = await userApi.login(loginForm)
        if (!resp || resp.code !== 1) {
          ElMessage.error(resp && resp.msg ? resp.msg : '登录失败，用户名或密码不正确')
          refreshCaptcha()
          return
        }
        const loginSession: LoginSession | undefined = resp.data
        if (loginSession) {
          sessionStorage.setItem('loginToken', loginSession.token)
          sessionStorage.setItem('uid', String(loginSession.uid))
          sessionStorage.setItem('username', loginSession.username)
        }
        ElMessage({
          message: '登录成功',
          type: 'success',
          duration: 1000,
          onClose: () => {
            const lastPath = sessionStorage.getItem('lastPath')
            if (lastPath && lastPath.trim() !== '') {
              sessionStorage.removeItem('lastPath')
              router.replace({path: lastPath})
            } else {
              router.replace({path: "/Home"})
            }
          }
        })
      }
    })
  } catch (error) {
    console.error('登录失败', error);
    ElMessage.error('登录失败')
    generatedVerificationCode.value = ''
    drawCaptcha()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login">
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" @keyup.enter="onLogin">
        <el-row>
          <el-col :span="24"><div class="login__title">{{ $t('title') }}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="verificationCode">
              <el-input v-model="loginForm.verificationCode" placeholder="请输入验证码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <canvas id="captchaCanvas" width="150" height="50" @click="drawCaptcha"></canvas>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" @click="onLogin" class="login__btn" :loading="loading">登录</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <span>版权所有 &copy; 2024 - 2026 <a href="http://www.52ejn.com" target="_blank">源码学习网</a></span><a href="http://beian.miit.gov.cn" target="_blank">粤ICP备2024308896号-1</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  padding-top: 60px;
  background-color: $primary-color;

  .login {
    width: 400px;
    margin: 0 auto;
    padding: 20px;
    background: #f5f5f5;
    box-shadow: 0 0 8px 0 $box-shadow-base;
    border-radius: 6px;

    div {
      text-align: center;
    }

    @at-root #{&}__logo {
      img {
        width: 30%;
      }
    }

    @at-root #{&}__title {
      margin: 10px 0;
      font-size: 36px;
      text-transform: uppercase;
    }

    @at-root #{&}__subtitle {
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 10px;
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: transparent;
  color: #fff;
  text-align: center;
  a {
    color: #ffffff;
    padding-left: 5px;
  }
}
</style>
