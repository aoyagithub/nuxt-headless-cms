<template>
  <section class="sidebar">
    <h2 class="sidebar-heading">Recent Posts</h2>
    <ul class="sidebar-list">
      <li
        v-for="content in contents"
        :key="content.id"
        class="sidebar-list-item"
      >
        <nuxt-link
          :to="`/${content.id}`"
          class="sidebar-list-link"
          itemprop="url"
          :title="content.title"
        >
          <img
            :src="content.image.url + '?fit=crop&w=100&h=100&fm=webp'"
            :alt="content.title"
            class="sidebar-list-image"
            itemscope
            itemtype="http://schema.org/ImageObject"
          />
          <p class="sidebar-list-text">{{ content.title }}</p>
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>
<script>
export default {
  props: {
    contents: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
};
</script>
<style lang="scss" scoped>
.sidebar {
  border-radius: 20px;
  background-color: #f7f7f7;
  margin-bottom: 30px;
}
.sidebar-heading {
  text-align: center;
  line-height: 1.27;
  font-size: 22px;
  font-weight: $Bold;
  padding: 14px 0;
  border-bottom: 1px solid lighten($border1, 4%);
}

.sidebar-list-item {
  & + .sidebar-list-item {
    border-top: 1px solid lighten($border1, 4%);
  }
}
.sidebar-list-link {
  color: $black;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: $Bold;
  line-height: 1.6;
  border-bottom: none;
  &:hover {
    border-bottom: none;
  }
}
.sidebar-list-image {
  width: 100px;
  height: 100px;
  border-radius: 20px;
}
.sidebar-list-text {
  width: calc(100% - calc(100px + 20px));
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>
