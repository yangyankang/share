
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'visible',
    event: 'change'
  },
  computed: {
    model: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },
  data () {
    return {
      btnLoading: false,
      editMiddle: null
    }
  },
  methods: {
  }
}
