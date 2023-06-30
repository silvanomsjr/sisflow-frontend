<template>
  <QuillEditor ref='quillEditor' theme='snow' contentType='html' toolbar='essential'></QuillEditor>
</template>

<script>

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {

  name: 'QuillHtmlEditor',

  components: {
    QuillEditor
  },

  props: {
    initialHtmlString: {
      default: '',
      type: String
    }
  },

  data() {
    return {}
  },

  mounted(){
    this.setBodyHTML(this.initialHtmlString);
  },

  methods: {
    setBodyHTML(htmlString){
      this.$refs.quillEditor.setHTML(htmlString);
    }
  }
}
</script>