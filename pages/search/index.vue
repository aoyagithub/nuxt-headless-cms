<template>
  <div>
    <Header :tags="tags" :categories="categories" />
    <div class="inner">
      <div class="content">
        <main class="main">
          <div class="taxonomy-heading-area">
            <h1 class="taxonomy-heading">「{{ q }}」の検索結果</h1>
          </div>
          <div v-if="loading === true" class="loader">
            <div class="loading">
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
            </div>
          </div>
          <div v-else>
            <div v-show="contents.length === 0" class="list-message">
              記事がありません
            </div>
            <ul class="list">
              <li v-for="content in contents" :key="content.id" class="item">
                <nuxt-link
                  :to="`/${content.id}`"
                  class="link"
                  itemprop="url"
                  :title="content.title"
                >
                  <picture
                    v-if="content.image"
                    class="picture"
                    itemscope=""
                    itemtype="http://schema.org/ImageObject"
                  >
                    <source
                      media="(min-width: 768px)"
                      type="image/webp"
                      :srcset="`${
                        content.image.url
                      }?fit=crop&w=352&h=151&fm=webp, ${
                        content.image.url
                      }?fit=crop&w=${352 * 2}&h=${151 * 2}&fm=webp 2x`"
                    />
                    <source
                      media="(max-width: 767px)"
                      type="image/webp"
                      :srcset="`${
                        content.image.url
                      }?fit=crop&w=350&h=200&fm=webp, ${
                        content.image.url
                      }?fit=crop&w=${350 * 2}&h=${200 * 2}&fm=webp 2x`"
                    />
                    <img
                      :src="content.image.url + '?fit=crop&w=352&h=151&fm=webp'"
                      :width="content.image.width"
                      :height="content.image.height"
                      class="image lazyload"
                    />
                  </picture>
                </nuxt-link>
                <dl class="item-content">
                  <dt class="title">
                    <nuxt-link
                      :to="`/${content.id}`"
                      class="link"
                      itemprop="url"
                      :title="content.title"
                      >{{ content.title }}</nuxt-link
                    >
                  </dt>

                  <dd class="detail">
                    <nuxt-link
                      :to="`/category/${content.category.id}/page/1`"
                      class="category link"
                    >
                      {{ content.category.category }}</nuxt-link
                    >
                    <time
                      class="timestamp"
                      :class="{
                        updated: updatedAt !== publishedAt,
                        published: updatedAt === publishedAt,
                      }"
                      :datetime="
                        $dayjs(content.updatedAt || content.publishedAt).format(
                          'YYYY-MM-DD'
                        )
                      "
                      >{{
                        $dayjs(content.updatedAt || content.publishedAt).format(
                          "YYYY-MM-DD"
                        )
                      }}</time
                    >
                  </dd>
                </dl>
              </li>
            </ul>
            <div v-show="contents.length > 0" class="pager-wrapper">
              <ul class="pager">
                <li
                  v-for="p in pager"
                  :key="p"
                  class="page"
                  :class="{ active: page === p + 1 }"
                >
                  <nuxt-link
                    :to="`/${
                      selectedCategory !== undefined
                        ? `category/${selectedCategory.id}/`
                        : ''
                    }page/${p + 1}`"
                    class="pager-link"
                  >
                    {{ p + 1 }}
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </main>
        <aside
          class="aside"
          role="complementary"
          itemscope="itemscope"
          itemtype="http://schema.org/WPSideBar"
        >
          <Search />
          <Categories :categories="categories" />
          <RecentPosts v-if="recentPosts" :contents="recentPosts" />
          <Banner />
        </aside>
      </div>
    </div>
    <Footer :tags="tags" />
  </div>
</template>
<script>
import axios from "axios";

export default {
  async asyncData({ payload, $microcms }) {
    const categories = await $microcms.get({
      endpoint: "categories",
      queries: {
        limit: 100,
      },
    });
    const tags = await $microcms.get({
      endpoint: "tags",
      queries: {
        limit: 1000,
      },
    });
    const recentPostsData = await $microcms.get({
      endpoint: "articles",
      queries: { limit: 5 },
    });
    let recentPosts = [];
    if (recentPostsData.contents.length < 5) {
      recentPosts = null;
    } else {
      recentPosts = [...Array(5)].map((value, index) => {
        return recentPostsData.contents[index];
      });
    }
    return {
      categories: categories.contents,
      tags: tags.contents,
      recentPosts,
    };
  },
  data() {
    return {
      searchable: true,
      contents: this.contents || [],
      totalCount: this.totalCount || 0,
      categories: this.categories || [],
      pager: this.pager || [],
      loading: true,
      q: this.$route.query.q,
    };
  },
  watch: {
    $route(to, from) {
      const query = to.query;
      this.$router.go({ path: "/search", query: { q: query.q } });
    },
  },
  created() {
    const query = this.$route.query;
    this.search(query.q);
  },
  methods: {
    setSearchable() {
      this.searchable = true;
    },
    async search(q = "") {
      if (!q.trim() || !this.searchable) {
        return;
      }
      this.loadingStart();
      const { data, error } = await axios
        .get(`/.netlify/functions/search?q=${q}`)
        .catch((error) => ({ error }));
      this.loadingFinish();
      if (error) {
        return;
      }
      this.contents = data.contents;
      this.totalCount = data.totalCount;
      this.searchable = false;
    },
    loadingStart() {
      this.loading = true;
    },
    loadingFinish() {
      this.loading = false;
    },
  },
  head() {
    return {
      titleTemplate: null,
      title: "Search - Nuxt Headless CMS",
      meta: [{ name: "robots", content: "noindex, nofollow" }],
    };
  },
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: space-between;
  font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", Helvetica, Arial,
    Meiryo, sans-serif;
  margin-bottom: 90px;
}
.main {
  width: 734px;
}
.aside {
  width: 354px;
}
.list {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 50px;
}
.item {
  width: 352px;
  height: 279px;
  border-radius: 20px;
  margin-bottom: 30px;
  background-color: $color1;
  font-weight: $Bold;
  &:nth-last-child(-n + 2) {
    margin-bottom: 0;
  }
}
.link {
  display: block;

  color: #1f2833;
}
.image {
  height: 151px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}
.item-content {
  height: calc(279px - 151px);
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-content: space-between;
  flex-wrap: wrap;
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
.detail {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: baseline;
  width: 100%;
  font-size: 12px;
}
.category {
  background: $category;
  padding: 4px 10px;
  border-radius: 20px;
  min-width: 68px;
  text-align: center;
  line-height: 1;
}
.pager {
  display: flex;
  justify-content: center;
}
.page {
  margin-right: 3px;
  margin-left: 3px;
}
.pager-link {
  border-radius: 50%;
  display: block;
  width: 42px;
  height: 42px;
  text-align: center;
  line-height: 42px;
  font-size: 16px;
  color: $black;
  font-weight: $Bold;
  background-color: $color1;
}
.active .pager-link {
  background-color: $color1;
}
.taxonomy-heading {
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: $Bold;
  border-bottom: 2px solid rgba(186, 179, 161, 0.6);
}
.loader {
  position: relative;
  padding-top: 20px;
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loading-bar {
  display: inline-block;
  width: 4px;
  height: 18px;
  border-radius: 4px;
  animation: loading 1s ease-in-out infinite;
  background-color: $color2;
}
.loading-bar:nth-child(1) {
  animation-delay: 0;
}
.loading-bar:nth-child(2) {
  animation-delay: 0.09s;
}
.loading-bar:nth-child(3) {
  animation-delay: 0.18s;
}
.loading-bar:nth-child(4) {
  animation-delay: 0.27s;
}

@keyframes loading {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1, 2.2);
  }
  40% {
    transform: scale(1);
  }
}
@media screen and (max-width: 1180px) {
  .main {
    width: 63%;
  }
  .aside {
    width: 30%;
  }
  .item {
    width: 48%;
  }
}
@media screen and (max-width: 820px) {
  .content {
    flex-direction: column;
  }
  .main {
    width: 100%;
    margin-bottom: 50px;
  }
  .aside {
    width: 100%;
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
  .content {
    margin-bottom: 0;
  }
  .inner {
    width: calc(100% - 40px);
  }
  .image {
    height: 200px;
  }
  .item-content {
    height: 170px;
  }
  .title {
    font-size: 20px;
  }
  .category {
    padding: 12px;
  }
  .timestamp {
    font-size: 14px;
  }
  .item-content {
    padding: 20px 20px 14px;
  }
}
</style>
