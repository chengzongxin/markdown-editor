<template>
  <div class="markdown-editor">
    <div class="toolbar">
      <button @click="surroundText('**')"><strong>B</strong></button>
      <button @click="surroundText('_')"><em>I</em></button>
      <button @click="insertText('# ')">H1</button>
      <button @click="insertText('## ')">H2</button>
      <button @click="insertText('### ')">H3</button>
      <button @click="insertText('1. ')">OL</button>
      <button @click="insertText('- ')">UL</button>
      <button @click="insertText('[Link text](url)')">Link</button>
      <button @click="insertText('![Alt text](url)')">Image</button>
      <button @click="insertText('\n```\n\n```\n')">Code</button>
      <button @click="togglePreview">
        {{ previewVisible ? "Hide" : "Show" }} Preview
      </button>
    </div>
    <div class="editor-container">
      <textarea
        class="editor"
        v-model="markdownText"
        ref="textarea"
        placeholder="Enter Markdown here..."
        v-on:paste="handlePaste"
      ></textarea>
      <div v-if="previewVisible" class="preview markdown-body">
        <div class="preview-content" v-html="compiledMarkdown"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from "marked";
import hljs from "highlight.js";
console.log("hljs", hljs);

export default {
  data() {
    return {
      markdownText: "",
      previewVisible: true,
    };
  },
  computed: {
    compiledMarkdown() {
      return marked(this.markdownText, {
        highlight: function (code, lang) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          console.log("language", language);
          return hljs.highlight(code, { language }).value;
        },
        breaks: true,
      });
    },
  },
  methods: {
    handlePaste(event) {
      console.log(event);
      const items = (event.clipboardData || event.originalEvent.clipboardData)
        .items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file" && item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          this.insertImage(file);
        }
      }
    },
    insertImage(file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        console.log("imageUrl", imageUrl);
        this.markdownText += `![Pasted Image](${imageUrl})`;
      };
      reader.readAsDataURL(file);
    },
    surroundText(tag) {
      const textarea = this.$refs.textarea;
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const selectedText = this.markdownText.substring(startPos, endPos);
      const replacement = `${tag}${selectedText}${tag}`;
      this.markdownText =
        this.markdownText.substring(0, startPos) +
        replacement +
        this.markdownText.substring(endPos);
      this.$nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(startPos + tag.length, endPos + tag.length);
      });
    },
    insertText(text) {
      const textarea = this.$refs.textarea;
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      this.markdownText =
        this.markdownText.substring(0, startPos) +
        text +
        this.markdownText.substring(endPos);
      this.$nextTick(() => {
        textarea.focus();
        textarea.setSelectionRange(
          startPos + text.length,
          startPos + text.length
        );
      });
    },
    togglePreview() {
      this.previewVisible = !this.previewVisible;
    },
  },
};
</script>

<style scoped>
.markdown-editor {
  display: flex;
  flex-direction: column;
  font-family: "Arial", sans-serif;
  height: 100vh;
  background-color: #f0f0f0;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  background-color: #3b3b3b;
  color: #fff;
  border-bottom: 2px solid #2b2b2b;
}

.toolbar button {
  margin: 5px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  background-color: #4b4b4b;
  color: #fff;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.toolbar button:hover {
  background-color: #6b6b6b;
}

.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor {
  flex: 1;
  border: none;
  padding: 15px;
  font-size: 16px;
  resize: none;
  outline: none;
  height: 100%;
  background-color: #fff;
  color: #333;
  border-right: 2px solid #e0e0e0;
  box-sizing: border-box;
}

.preview {
  flex: 1;
  padding: 15px;
  font-size: 16px;
  background-color: #fff;
  overflow-y: auto;
  box-sizing: border-box;
}

.preview {
  flex: 1;
  padding: 15px;
  font-size: 16px;
  background-color: #fff;
  overflow-y: auto;
  box-sizing: border-box;
  text-align: left; /* 添加左对齐样式 */
}

.preview-content {
  text-align: left; /* 文字左对齐 */
}

/* 代码高亮样式 */
.preview-content pre code {
  display: block;
  white-space: pre-wrap;
}

/* 自定义高亮样式 */
.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #f0f0f0;
}
</style>
