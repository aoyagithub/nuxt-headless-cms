<template>
  <div v-if="visible" class="toc">
    <h4 class="title">目次</h4>
    <ul class="list">
      <li v-for="item in toc" :key="item.id" :class="`item ${item.name}`">
        <n-link v-scroll-to="`#${item.id}`" to class="link">
          {{ item.text }}
        </n-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    toc: {
      type: Array,
      required: true,
      default: () => [],
    },
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.toc {
  background-color: $color1;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
}
.title {
  font-size: 24px;
  font-weight: $Bold;
  line-height: 1.16;
  margin-bottom: 1em;
}
.link {
  color: $black;
  font-size: 20px;
  line-height: 1.5;
}
.list {
  font-size: 20px;
  line-height: 1.5;
}
.item {
  margin-bottom: 0.75em;
  &.h2 {
    list-style: disc outside;
    margin-left: 1em;
  }
  &.h3 {
    list-style: circle outside;
    margin-left: 2em;
    .link {
      font-size: 90%;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
}
@media screen and (max-width: 767px) {
  .title {
    font-size: 20px;
  }
}
</style>
