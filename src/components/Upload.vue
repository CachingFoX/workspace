<script setup>
import { ref } from 'vue'
// import axios from 'axios'
import FileUpload from 'primevue/fileupload';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
})

// const selectedFiles = ref([])
const uploadedImages = ref([])



const uploadFiles = async (e) => {
  console.log(e);
  if (!selectedFiles.value.length) return

  const formData = new FormData()
  selectedFiles.value.forEach(file => formData.append('files', file))

  try {
    const response = await fetch(`http://localhost:8000/trackables/${props.name}/images`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`)
    }

    const data = await response.json()

    uploadedImages.value = data.map(img => ({
      ...img,
      url: `http://localhost:8000/images/${img.filename}`
    }))

  } catch (err) {
    console.error('Upload failed:', err)
  }
}
</script>

<template>
  <div class="image-uploader">
    <FileUpload name="files" :url="`http://localhost:8000/trackables/${props.name}/images`" @upload="uploadFiles"
    :multiple="true" accept="image/*" :maxFileSize="5000000"
    >
        <template #empty>
            <div class="flex flex-column align-items-center justify-content-center">
              <i class="pi pi-upload border-2 rounded-full p-5 text-6xl text-muted-color" />
              <p class="mt-4 mb-0 text-xl text-muted-color">Drag and drop files to here to upload.</p>
            </div>
        </template>
    </FileUpload>


    <div v-if="uploadedImages.length">
      <h3>Hochgeladene Bilder:</h3>
      <div v-for="img in uploadedImages" :key="img.uuid" class="image-preview">
        <img :src="img.url" :alt="img.filename" width="150" />
        <p>{{ img.filename }}</p>
      </div>
    </div>


  </div>
</template>

<style scoped>
.image-preview {
  display: inline-block;
  margin: 10px;
  text-align: center;
}


.text-muted-color {
  color: #64748b !important;
}
.text-4xl {
  font-size: 2.25rem !important;
  line-height: 2.5rem !important;
}
.\!text-2xl {
  font-size:1.5rem!important;
  line-height:2rem!important
}
.\!text-3xl {
  font-size:1.875rem!important;
  line-height:2.25rem!important
}
.\!text-4xl {
  font-size:2.25rem!important;
  line-height:2.5rem!important
}
.\!text-6xl {
  font-size:3.75rem!important;
  line-height:1!important
}
.\!text-lg {
  font-size:1.125rem!important;
  line-height:1.75rem!important
}
.\!text-sm {
  font-size:.875rem!important;
  line-height:1.25rem!important
}
.\!text-xl {
  font-size:1.25rem!important;
  line-height:1.75rem!important
}
.\!text-xs {
  font-size:.75rem!important;
  line-height:1rem!important
}
.text-2xl {
  font-size:1.5rem;
  line-height:2rem
}
.text-3xl {
  font-size:1.875rem;
  line-height:2.25rem
}
.text-4xl {
  font-size:2.25rem;
  line-height:2.5rem
}
.text-5xl {
  font-size:3rem;
  line-height:1
}
.text-9xl {
  font-size:8rem;
  line-height:1
}
.border-2 {
  border-width: 3px !important;
  border-color: #e5e7eb;
}
.rounded-full {
  border-radius: 9999px !important;
}
</style>
