<template>
  <div>
    <nuxt :class="{ scrolled }" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      scroll: 0,
      scrolled: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.scrollWindow);
  },
  beforeDestroy() {
    window.addEventListener('scroll', this.scrollWindow);
  },
  methods: {
    scrollWindow() {
      this.scroll = window.scrollY;
      const scrolled = 50;
      if (scrolled <= this.scroll) {
        this.scrolled = true;
      } else {
        this.scrolled = false;
      }
    },
  },
};
</script>
<style>
body.header-active {
  overflow: hidden;
}
.inner {
  width: 1188px;
  margin-right: auto;
  margin-left: auto;
}
.content {
  padding-top: 170px;
}

@media screen and (max-width: 1180px) {
  .inner {
    width: 90%;
  }
}
@media screen and (max-width: 767px) {
  .inner {
    width: calc(100% - 30px);
  }
  .content {
    padding-top: 90px;
  }
}
</style>
