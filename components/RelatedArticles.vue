<template>
  <section class="related-articles">
    <h2 class="section-heading">Related Articles</h2>
    <ul class="list">
      <li v-for="article in articles" :key="article.id" class="item">
        <nuxt-link
          :to="`/${article.id}`"
          class="link"
          itemprop="url"
          :title="article.title"
        >
          <picture
            v-if="article.image"
            itemscope
            itemtype="http://schema.org/ImageObject"
          >
            <source
              type="image/webp"
              :srcset="article.image.url + '?fit=crop&w=339&h=165&fm=webp'"
            />
            <img
              :src="article.image.url + '?fit=crop&w=339&h=165&fm=webp'"
              :width="article.image.width"
              :height="article.image.height"
              class="image lazyload"
            />
          </picture>
        </nuxt-link>
        <dl class="article">
          <dt class="title">
            <nuxt-link
              :to="`/${article.id}`"
              class="link"
              itemprop="url"
              :title="article.title"
              >{{ article.title }}</nuxt-link
            >
          </dt>
          <dd>
            <nuxt-link
              :to="`/category/${article.category.id}/page/1`"
              class="category link"
            >
              {{ article.category.category }}
            </nuxt-link>
          </dd>
        </dl>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    articles: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
};
</script>
<style lang="scss" scoped>
.related-articles {
  margin-top: 54px;
  margin-bottom: 30px;
}
.section-heading {
  font-size: 41px;
  font-weight: $Bold;
  line-height: 1.4;
  margin-bottom: 20px;
}
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.item {
  margin-bottom: 30px;
  width: 375px;
  height: 330px;
  border-radius: 20px;
  background-color: $color1;
  font-weight: $Bold;
  padding: 18px;
  &:nth-last-child(-n + 2) {
    margin-bottom: 0;
  }
}
.link {
  display: block;
  border-bottom: none;
  color: #1f2833;
  &:hover {
    border-bottom: none;
  }
}
.image {
  width: 100%;
  height: 165px;
  border-radius: 20px;
}
.article {
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: calc(100% - 165px);
}
.title {
  font-size: 15px;
  line-height: 1.6;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;
}
.category {
  font-size: 12px;
  background: $category;
  padding: 4px 10px;
  border-radius: 20px;
  min-width: 68px;
  text-align: center;
  line-height: 1;
  display: inline-block;
}
@media screen and (max-width: 1180px) {
  .item {
    width: 48%;
  }
}
@media screen and (max-width: 820px) {
  .item {
    width: 48%;
  }
}
@media screen and (max-width: 767px) {
  .item {
    width: 100%;
    height: auto;
    &:nth-last-child(2) {
      margin-bottom: 30px;
    }
  }
  .related-articles {
    margin-top: 30px;
  }
  .section-heading {
    font-size: 26px;
    margin-bottom: 10px;
  }
  .category {
    padding: 12px;
    font-size: 12px;
  }
  .title {
    font-size: 20px;
  }
  .article {
    height: 150px;
  }
  .image {
    height: 180px;
  }
}
</style>
