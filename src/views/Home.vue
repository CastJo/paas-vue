<template>
  <div class="home">
    <public-mirror/>
  </div>
</template>

<script>
// @ is an alias to /src
import PublicMirror from "@/components/publicMirror";
export default {
  name: 'Home',
  components: {
    PublicMirror,
  }

}
</script>
