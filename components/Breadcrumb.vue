<template>
  <ul
    class="breadcrumb"
    itemscope=""
    itemtype="http://schema.org/BreadcrumbList"
  >
    <li
      class="breadcrumb-item breadcrumb-item-hasLink"
      itemprop="itemListElement"
      itemscope=""
      itemtype="http://schema.org/ListItem"
    >
      <nuxt-link itemprop="item" class="breadcrumb-link" to="/">
        <span itemprop="name">Home</span>
      </nuxt-link>
      <meta itemprop="position" content="1" />
    </li>
    <li
      v-if="hasCategory(category)"
      class="breadcrumb-item breadcrumb-item-hasLink"
      itemprop="itemListElement"
      itemscope=""
      itemtype="http://schema.org/ListItem"
    >
      <nuxt-link
        itemprop="item"
        class="breadcrumb-link"
        :to="`/category/${category.id}/page/1`"
      >
        <span itemprop="name">{{ category.category }}</span>
      </nuxt-link>
      <meta itemprop="position" content="2" />
    </li>
    <li
      v-else-if="hasCategory(tag)"
      class="breadcrumb-item breadcrumb-item-hasLink"
      itemprop="itemListElement"
      itemscope=""
      itemtype="http://schema.org/ListItem"
    >
      <nuxt-link
        itemprop="item"
        class="breadcrumb-link"
        :to="`/tag/${tag.id}/page/1`"
      >
        <span itemprop="name">{{ tag.tag }}</span></nuxt-link
      >
      <meta itemprop="position" content="2" />
    </li>
    <li class="breadcrumb-item">
      <span>{{ title }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    tag: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    hasCategory(arg) {
      return Object.keys(arg).length > 0;
    },
  },
  jsonld() {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://your-domain.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: this.category.category,
          item: `https://your-domain.com/category/${this.category.id}/page/1/`,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  font-weight: $Bold;
  font-size: 15px;
  color: $black;
  flex-wrap: wrap;
}
.breadcrumb-link {
  color: $black;
}
.breadcrumb-item-hasLink {
  margin-right: 16px;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    background-image: url("~@/assets/images/breadcrumb.svg");
    background-repeat: no-repeat;
    width: 4px;
    height: 7px;
    display: inline-block;
    top: 50%;
    transform: translateY(-50%);
    right: -10px;
  }
}
</style>
