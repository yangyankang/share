<template>
  <div>
    <textarea
      placeholder="按 Enter 发送"
      v-model="content"
      @paste="afterPaste"
      ref="messageContent"
    ></textarea>
    <paste-dialog
      :send-image-visible="sendImageVisible"
      @close="sendImageClose"
      :pre-file="preFile"
      @confirm="sendImageConfirm"
    ></paste-dialog>
  </div>
</template>
<script>
import PasteDialog from '@/components/PasteDialog'
export default {
  data () {
    return {
      sendImageVisible: false,
      file: null,
      content: '',
      preFile: {
        url: '',
        name: '',
        size: 0
      }
    }
  },
  computed: {},
  components: {
    PasteDialog
  },
  methods: {
    afterPaste (e) { // 剪切板粘贴事件
      console.log(11)
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        let item = e.clipboardData.items[i]
        if (/image/.test(item.type)) { // 包含图片
          this.sendImageVisible = true
          let file = item.getAsFile()
          this.file = file
          this.preFile.name = file.name
          this.preFile.size = file.size
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onloadend = () => {
            this.preFile.url = reader.result
          }
        }
      }
    },
    sendImageClose (data) {
      this.sendImageVisible = false
      this.file = null
    },
    sendImageConfirm () {
      if (this.file) {
        // let msgType = 'Image'
        // this.upLoadFile(this.file, msgType)
        this.sendImageVisible = false
      }
    }
  },
  created () { },
  mounted () { }
}
</script>
<style lang='scss' scoped>
</style>
