<template>
  <div>
    <Header :tags="tags" :categories="categories" />
    <div class="inner">
      <div class="content">
        <main class="main">
          <div v-if="selectedCategory" class="taxonomy-heading-area">
            <h1 class="taxonomy-heading">
              {{ selectedCategory.category }}の記事一覧
            </h1>
          </div>
          <div v-if="selectedTag" class="taxonomy-heading-area">
            <h1 class="taxonomy-heading">{{ selectedTag.tag }}の記事一覧</h1>
          </div>
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
                      updated: content.updatedAt !== content.publishedAt,
                      published: content.updatedAt === content.publishedAt,
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
          <Pager
            v-if="contents.length > 0"
            :pager="pager"
            :current="Number(page)"
            :category="selectedCategory"
            :tag="selectedTag"
          />
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
export default {
  async asyncData({ params, payload, $microcms }) {
    const page = params.id || "1";
    const categoryId = params.categoryId;
    const tagId = params.tagId;
    const limit = 10;
    const articleFilter =
      categoryId !== undefined
        ? `category[equals]${categoryId}`
        : tagId !== undefined
        ? `article_tags[contains]${tagId}`
        : undefined;
    const data = await $microcms.get({
      endpoint: "articles",
      queries: {
        limit,
        offset: (page - 1) * limit,
        filters: articleFilter,
      },
    });
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
    const selectedCategory =
      categoryId !== undefined
        ? categories.contents.find((content) => content.id === categoryId)
        : undefined;
    const selectedTag =
      tagId !== undefined
        ? tags.contents.find((content) => content.id === tagId)
        : undefined;
    return {
      ...data,
      categories: categories.contents,
      tags: tags.contents,
      page,
      selectedCategory,
      selectedTag,
      pager: [...Array(Math.ceil(data.totalCount / limit)).keys()],
      recentPosts,
    };
  },
  data() {
    return {
      pager: this.pager || [],
    };
  },
  jsonld() {
    if (!this.contents[0]) {
      return {};
    } else {
      return {
        "@context": "http://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://your-domain.com/",
        },
        headline: "Nuxt Headless CMS",
        image: "https://your-domain.com/images/your-domain.com",
        datePublished: "2022-02-01T00:00:00+09:00",
        dateModified:
          this.contents[0].updatedAt || this.contents[0].publishedAt,
        author: {
          "@type": "Person",
          name: "Nuxt Headless CMS",
          url: "https://your-domain.com/about/",
        },
        publisher: {
          "@type": "Organization",
          name: "Nuxt Headless CMS",
          logo: {
            "@type": "ImageObject",
            url: "https://your-domain.com/images/your-domain.com",
          },
        },
        description: "",
      };
    }
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
  color: $black;
  border-bottom: none;
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
.taxonomy-heading {
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: $Bold;
  padding-bottom: 0.25em;
  border-bottom: 2px solid rgba(186, 179, 161, 0.6);
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
