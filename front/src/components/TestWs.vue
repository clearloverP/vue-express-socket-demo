<template>
  <div class="hello">
    <p>
      <el-button size="small" type="primary" @click="openDev">打开设备</el-button>
    </p>
    <p>
      <el-button size="small" type="primary" @click="getKeySn">读取KeySn</el-button>
    </p>
    <p>
      <el-row :gutter="10">
        <el-col :span="8" :offset="3">
          <el-input size="small" v-model="form.pwd" placeholder="请输入口令"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button size="small" type="primary" @click="verifyPass">验证口令</el-button>
        </el-col>
      </el-row>
    </p>
    <p>
      <el-row :gutter="10">
        <el-col :span="3" :offset="10">
          <el-button size="small" type="primary" @click="genRandom">生成随机数</el-button>
        </el-col>
        <el-col :span="8">
          <el-input size="small" v-model="form.random" placeholder="随机数" readonly></el-input>
        </el-col>
      </el-row>
    </p>
    <p>
      <el-button size="small" type="primary" @click="writeCert">写入证书</el-button>
    </p>
    <p>
      
      <el-row :gutter="10">
        <el-col :span="3" :offset="10">
          <el-button size="small" type="primary" @click="readCert">读取证书</el-button>
        </el-col>
        <el-col :span="8">
          <el-input size="small" v-model="form.certSn" placeholder="证书序列号" readonly></el-input>
        </el-col>
      </el-row>
    </p>
    <p>
      <el-row :gutter="10">
        <el-col :span="3" :offset="10">
          <el-button size="small" type="primary" @click="genSign">签名</el-button>
        </el-col>
        <el-col :span="8">
          <el-input size="small" v-model="form.sign" placeholder="签名" readonly></el-input>
        </el-col>
      </el-row>
    </p>
    <p>
      <el-button size="small" type="primary" @click="genVerify">验签</el-button>
    </p>
    <p>
      <el-button size="small" type="primary" @click="closeDev">关闭设备</el-button>
    </p>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: 'TestWs',
  data() {
    return {
      tcpUrl: 'ws://127.0.0.1:3000',
      tcpUrl: '',
      socket: '',
      form: {
        sign: '',
        random: '',
        pwd: '',
        certSn: ''
      }
    }
  },
  created() {
    this.getServerTcp(true);
  },
  methods: {
    // 检测连接推送服务器是否成功
    getServerTcp(show=false) {
      this.socket = io(this.tcpUrl);
      // debugger

      // 判断是否链接成功
      this.socket.on('conn_suc', data => {
        console.log('test tcp connection, res: ' + data);

        if (show) {
          this.$message.success('链接成功！');
        }
      });

      // 如果服务器断了-或者主动断了-关闭链接
      this.socket.on('disconnect', () => {
        // 关闭链接\
        this.socket.close();
      });
    },
    // 关闭连接
    closeServer(msg = '') {
      if (this.socket != "") {
        this.socket.close();

        if (msg.length == 0) {
          this.$message.success('链接已关闭');
        } else {
          this.$message.success(msg);
        }
      }
    },
    checkLink() {
      return this.socket != '' && this.socket.connected;
    },
    openDev() {
      if (!this.checkLink()) {
        this.getServerTcp();
      }

      this.socket.emit("openDev", {
        info: 'send openDev order to server'
      });

      this.socket.on('openDevRes', data => {
        console.log('openDev info from server');
        console.log(data, 'openDev info data');
        if (data.code == 0) {
          this.$message.success('打开设备成功！');
        } else {
          this.$message.error('打开设备失败！');
        }
      });
    },
    getKeySn() {
      if (!this.checkLink()) {
        return this.$message.info('暂无链接，请刷新页面或者重新打开设备');
      }

      this.socket.emit("getKeySn", {
        info: 'send getKeySn order to server'
      });

      this.socket.on('keySn', data => {
        console.log('KeySn info from server');
        console.log(data, 'KeySn info data');

        if (data.code == 0) {
          this.$message.success('获取KeySn信息成功');
        } else {
          this.$message.error('获取KeySn信息失败');
        }
      });
    },
    verifyPass() {
      if (!this.checkLink()) {
        return this.$message.info('暂无链接，请刷新页面或者重新打开设备');
      }

      if (this.form.pwd.length == 0) {
        return this.$message.info('口令不能为空');
      }
      this.socket.emit("verifyPass", {
        info: 'send verifyPass order to server',
        pass: this.form.pwd
      });

      this.socket.on('verifyPassRes', data => {
        console.log('verifyPassRes info from server');
        console.log(data, 'verifyPassRes info data');

        if (data.code == 0) {
          this.$message.success('口令验证通过');
        } else {
          this.$message.error('口令验证失败');
        }
      });
    },
    genRandom() {
      if (!this.checkLink()) {
        return this.$message.info('暂无链接，请刷新页面或者重新打开设备');
      }

      this.socket.emit("genRandom", {
        info: 'send genRandom order to server'
      });

      this.socket.on('genRandomRes', data => {
        console.log('genRandomRes info from server');
        console.log(data, 'genRandomRes info data');

        if (data.code == 0) {
          this.$message.success('生成随机数成功');
          this.form.random = data.random;
        } else {
          this.$message.error('生成随机数失败');
        }
      });
    },
    writeCert() {
      if (!this.checkLink()) {
        return this.$message.info('暂无链接，请刷新页面或者重新打开设备');
      }

      this.socket.emit("writeCert", {
        info: 'send writeCert order to server'
      });

      this.socket.on('writeCertRes', data => {
        console.log('writeCertRes info from server');
        console.log(data, 'writeCertRes info data');

        if (data.code == 0) {
          this.$message.success('写入证书成功');
        } else {
          this.$message.error('写入证书失败');
        }
      });
    },
    readCert() {
      if (!this.checkLink()) {
        return this.$message.info('暂无链接，请刷新页面或者重新打开设备');
      }

      this.socket.emit("readCert", {
        info: 'send readCert order to server'
      });

      this.socket.on('readCertRes', data => {
        console.log('readCertRes info from server');
        console.log(data, 'readCertRes info data');

        if (data.code == 0) {
          this.$message.success('读取证书成功');
          this.form.certSn = data.certSn;
        } else {
          this.$message.error('读取证书失败');
        }
      });
    },
    genSign() {
      if (!this.checkLink()) {
        return this.$message.info('暂无链接，请刷新页面或者重新打开设备');
      }

      this.socket.emit("genSign", {
        info: 'send genSign order to server'
      });

      this.socket.on('genSignRes', data => {
        console.log('genSignRes info from server');
        console.log(data, 'genSignRes info data');

        if (data.code == 0) {
          this.$message.success('签名成功');
          this.form.sign = data.sign;
        } else {
          this.$message.error('签名失败');
        }
      });
    },
    genVerify() {
      if (!this.checkLink()) {
        return this.$message.info('暂无链接，请刷新页面或者重新打开设备');
      }

      this.socket.emit("genVerify", {
        info: 'send genVerify order to server'
      });

      this.socket.on('genVerifyRes', data => {
        console.log('genVerifyRes info from server');
        console.log(data, 'genVerifyRes info data');

        if (data.code == 0) {
          this.$message.success('验签成功');
        } else {
          this.$message.error('验签失败');
        }
      });
    },
    closeDev() {
      if (!this.checkLink()) {
        return this.$message.info('暂无链接，请刷新页面或者重新打开设备');
      }

      this.socket.emit("closeDev", {
        info: 'send closeDev order to server'
      });

      this.socket.on('closeDevRes', data => {
        console.log('closeDev info from server');
        console.log(data, 'closeDev info data');

        if (data.code == 0) {
          this.closeServer('关闭设备成功');
        } else {
          this.$message.error('关闭设备失败');
        }
      });
    }
  }
}
</script>
