<template>
  <div>
    <Header :tags="tags" :categories="categories" />
    <div class="inner">
      <div class="content">
        <p v-if="!data.id" class="loading">Now Loading...</p>
        <main v-if="data.id" class="main">
          <article class="article">
            <div class="post">
              <ul v-if="data.category" class="taxonomy-list">
                <li class="taxonomy-list-item category">
                  <nuxt-link
                    :to="`/category/${data.category.id}/page/1`"
                    class="taxonomy-list-link"
                    >{{ data.category.category }}</nuxt-link
                  >
                </li>
                <template v-if="data.article_tags">
                  <li
                    v-for="tag in data.article_tags"
                    :key="tag.id"
                    class="taxonomy-list-item tag"
                  >
                    <nuxt-link
                      :to="`/tag/${tag.id}/page/1`"
                      class="taxonomy-list-link"
                      >{{ tag.tag }}</nuxt-link
                    >
                  </li>
                </template>
              </ul>
              <h1 class="title">{{ title }}</h1>
              <time
                class="timestamp"
                :class="{
                  updated: updatedAt !== publishedAt,
                  published: updatedAt === publishedAt,
                }"
                :datetime="
                  $dayjs(data.updatedAt || data.createdAt).format('YYYY-MM-DD')
                "
                >{{
                  $dayjs(data.updatedAt || data.createdAt).format("YYYY-MM-DD")
                }}</time
              >
              <div class="post-image">
                <picture v-if="data.image">
                  <source
                    media="(min-width: 1160px)"
                    type="image/webp"
                    :srcset="`${data.image.url}?fit=crop&w=700&h=400&fm=webp, ${
                      data.image.url
                    }?fit=crop&w=${700 * 2}&h=${400 * 2}&fm=webp 2x`"
                  />
                  <source
                    media="(min-width: 768px)"
                    type="image/webp"
                    :srcset="`${data.image.url}?fit=crop&w=658&h=376&fm=webp, ${
                      data.image.url
                    }?fit=crop&w=${658 * 2}&h=${376 * 2}&fm=webp 2x`"
                  />
                  <source
                    media="(max-width: 767px)"
                    type="image/webp"
                    :srcset="`${data.image.url}?fit=crop&w=330&h=188&fm=webp, ${
                      data.image.url
                    }?fit=crop&w=${330 * 2}&h=${188 * 2}&fm=webp 2x`"
                  />
                  <img
                    ref="image"
                    :src="data.image.url + '?fit=crop&w=700&h=400&q=100'"
                    class="post-image-image"
                    alt
                  />
                </picture>
              </div>
              <Toc :id="data.id" :toc="toc" :visible="data.index" />
              <Post :body="data.body" />
            </div>
            <Share :id="data.id" :title="data.title" />
          </article>
          <!-- Start Ad Area -->
          <div class="ad">Ad</div>
          <!-- End Ad Area -->
          <RelatedArticles
            v-if="data.related_articles.length > 0"
            :articles="data.related_articles"
          />
          <Breadcrumb :category="data.category" :title="data.title" />
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
import cheerio from "cheerio";
import hljs from "highlight.js";

export default {
  async asyncData({ $microcms }) {
    const limit = 5;

    const recentPostsData = await $microcms.get({
      endpoint: "articles",
      queries: { limit },
    });
    let recentPosts = [];
    if (recentPostsData.contents.length < 5) {
      recentPosts = null;
    } else {
      recentPosts = [...Array(5)].map((value, index) => {
        return recentPostsData.contents[index];
      });
    }
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

    return {
      recentPosts,
      categories: categories.contents,
      tags: tags.contents,
    };
  },
  data() {
    return {
      data: {
        id: "",
        image: {
          url: "",
        },
        body: "",
        title: "",
        createdAt: "",
        publishedAt: "",
        index: false,

        category: {
          name: "",
        },
        related_articles: [],
      },
      toc: [],
      contents: [],
      categories: [],
    };
  },
  async created() {
    const query = this.$route.query;
    if (query.id === undefined || query.draftKey === undefined) {
      return;
    }
    const { data, error } = await axios
      .get(
        `/.netlify/functions/draft?id=${query.id}&draftKey=${query.draftKey}`
      )
      .catch((error) => ({ error }));
    if (error) {
      return;
    }
    this.data = data;

    const $ = cheerio.load(JSON.stringify(data.body));
    const headings = $("h1, h2, h3").toArray();

    const toc = headings.map((d) => {
      const dId = d.attribs.id;
      const dIdSlice1 = dId.slice(2);
      const dIdSlice2 = dIdSlice1.slice(0, -2);
      return {
        text: d.children[0].data,
        id: dIdSlice2,
        name: d.name,
      };
    });
    this.toc = toc;
    $("pre code").each((_, elm) => {
      const res = hljs.highlightAuto($(elm).text());
      $(elm).html(res.value);
      $(elm).addClass("hljs");
    });
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.data && this.data.description,
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.data && this.data.title,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.data && this.data.description,
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `https://your-domain.com/${this.data && this.data.id}/`,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.data && this.data.image && this.data.image.url,
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css",
        },
      ],
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js",
          async: true,
        },
      ],
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
  width: 780px;
}
.aside {
  width: 354px;
}
.article {
  background-color: $color1;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 20px;
}
.taxonomy-list {
  display: flex;
  justify-content: center;
  align-items: baseline;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 16px;
  a {
    color: $black;
  }
}
.category .taxonomy-list-link {
  background: $category;
  padding: 4px 10px;
  border-radius: 20px;
  min-width: 68px;
  text-align: center;
  line-height: 1;
  display: block;
  color: $black;
  font-weight: $Bold;
}
.tag .taxonomy-list-link {
  padding: 4px 10px;
  border-radius: 20px;
  min-width: 68px;
  text-align: center;
  line-height: 1;
  border: 1px solid $border1;
  color: $black;
  display: block;
  font-weight: $Bold;
}
.taxonomy-list-item {
  margin-right: 4px;
  margin-left: 4px;
  margin-bottom: 8px;
}
.taxonomy-list-link {
  font-size: 11px;
}
.title {
  font-size: 32px;
  font-weight: $Bold;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 24px;
}
.timestamp {
  text-align: center;
  display: block;
  font-size: 12px;
  font-weight: $Bold;
  line-height: 1.4;
  margin-bottom: 20px;
}
.post-image {
  margin-bottom: 30px;
}
.post-image-image {
  width: 100%;
  max-height: 400px;
  height: auto;
  border-radius: 20px;
}
@media screen and (max-width: 1180px) {
  .main {
    width: 66%;
  }
  .aside {
    width: 30%;
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
</style>
