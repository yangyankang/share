
<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'div'
    }
  },
  render (h) {
    return h(this.tag, null, this.$slots.default)
  },
  computed () {
    document.body.appendChild(this.$el)
  }
}
</script>

<style>

</style>
