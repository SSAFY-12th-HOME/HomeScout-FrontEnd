import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
    const isVisible = ref(false);
    const message = ref('');
    const title = ref('오류');
    
		function showError(message, title = '오류') {
      this.message = message
      this.title = title
      this.isVisible = true
		}

    function hideError() {
      this.isVisible = false
      this.message = ''
    }

		return { 
			isVisible, message, title,
			showError, hideError
		}
  }
)