import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useSuccessStore = defineStore('success', () => {
    const isVisible = ref(false);
    const message = ref('');
    const title = ref('완료');
    const routerPath = ref('');
    
		function showSuccess(message, routerPath = '') {
      this.message = message
      this.routerPath = routerPath
      this.isVisible = true
		}

    function hideSuccess() {
      this.isVisible = false
      this.message = ''
    }

		return { 
			isVisible, message, title, routerPath,
			showSuccess, hideSuccess
		}
  }
)