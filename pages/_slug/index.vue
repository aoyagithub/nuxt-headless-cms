<template>
  <div>
    <Header :tags="tags" :categories="categories" />
    <div class="inner">
      <div class="content">
        <main class="main" role="main" itemprop="articleBody">
          <article class="article">
            <div class="post">
              <ul class="taxonomy-list" itemprop="keywords">
                <li class="taxonomy-list-item category">
                  <nuxt-link
                    :to="`/category/${category.id}/page/1`"
                    class="taxonomy-list-link"
                    >{{ category.category }}</nuxt-link
                  >
                </li>
                <template v-if="article_tags">
                  <li
                    v-for="tag in article_tags"
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
              <h1 class="title" itemprop="headline">{{ title }}</h1>
              <time
                class="timestamp"
                :class="{
                  updated: updatedAt !== publishedAt,
                  published: updatedAt === publishedAt,
                }"
                :datetime="
                  $dayjs(updatedAt || publishedAt).format('YYYY-MM-DD')
                "
                >{{
                  $dayjs(updatedAt || publishedAt).format("YYYY-MM-DD")
                }}</time
              >
              <div class="post-image" itemprop="image">
                <picture v-if="image">
                  <source
                    media="(min-width: 1160px)"
                    type="image/webp"
                    :srcset="`${image.url}?fit=crop&w=780&h=500&fm=webp, ${
                      image.url
                    }?fit=crop&w=${780 * 2}&h=${500 * 2}&fm=webp 2x`"
                  />
                  <source
                    media="(min-width: 768px)"
                    type="image/webp"
                    :srcset="`${image.url}?fit=crop&w=691&h=460&fm=webp, ${
                      image.url
                    }?fit=crop&w=${691 * 2}&h=${460 * 2}&fm=webp 2x`"
                  />
                  <source
                    media="(max-width: 767px)"
                    type="image/webp"
                    :srcset="`${image.url}?fit=crop&w=330&h=240&fm=webp, ${
                      image.url
                    }?fit=crop&w=${330 * 2}&h=${240 * 2}&fm=webp 2x`"
                  />
                  <img
                    ref="image"
                    :src="image.url + '?fit=crop&w=780&h=500&q=100'"
                    class="post-image-image"
                    itemprop="image"
                    alt
                  />
                </picture>
              </div>
              <Toc :id="id" :toc="toc" :visible="index" />
              <Post :body="body" />
            </div>
            <Share :id="id" :title="title" />
          </article>
          <!-- Start Ad Area -->
          <div class="ad"></div>
          <!-- End Ad Area -->
          <RelatedArticles
            v-if="related_articles.length > 0"
            :articles="related_articles"
          />
          <Breadcrumb :category="category" :title="title" />
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
import cheerio from "cheerio";
import hljs from "highlight.js";

export default {
  async asyncData({ params, payload, $microcms }) {
    const limit = 5;
    const data =
      payload !== undefined
        ? payload.content
        : await $microcms.get({
            endpoint: "articles",
            contentId: params.slug,
            queries: {
              depth: 2,
            },
          });
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
    const { contents } = await $microcms.get({
      endpoint: "articles",
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
    $("pre code").each((_, elm) => {
      const res = hljs.highlightAuto($(elm).text());
      $(elm).html(res.value);
      $(elm).addClass("hljs");
    });
    $("img").each((_, elm) => {
      $(elm).attr("class", "lazyload");
      $(elm).attr("data-src", elm.attribs.src);
      $(elm).removeAttr("src");
    });
    return {
      ...data,
      recentPosts,
      toc,
      categories: categories.contents,
      tags: tags.contents,
      contents,
    };
  },
  data() {
    return {
      publishedAt: "",
      image: null,
    };
  },
  jsonld() {
    return {
      "@context": "http://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://your-domain.com/${this.id}/`,
      },
      headline: this.title,
      image: [this.image.url],
      datePublished: this.publishedAt,
      dateModified: this.updatedAt || this.publishedAt,
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
      description: this.excerpt,
    };
  },
  head() {
    if (this.contents[0].noindex) {
      return {
        title: this.title + " - Nuxt Headless CMS",
        meta: [
          { name: "robots", content: "noindex, nofollow" },
          {
            hid: "description",
            name: "description",
            content: this.description,
          },
          { hid: "og:title", property: "og:title", content: this.title },
          {
            hid: "og:description",
            property: "og:description",
            content: this.description,
          },
          {
            hid: "og:url",
            property: "og:url",
            content: `https://your-domain.com/${this.id}/`,
          },
          {
            hid: "og:image",
            property: "og:image",
            content: this.image && this.image.url,
          },
        ],
      };
    } else {
      return {
        title: this.title + " - Nuxt Headless CMS",
        meta: [
          {
            hid: "description",
            name: "description",
            content: this.description,
          },
          { hid: "og:title", property: "og:title", content: this.title },
          {
            hid: "og:description",
            property: "og:description",
            content: this.description,
          },
          {
            hid: "og:url",
            property: "og:url",
            content: `https://your-domain.com/${this.id}/`,
          },
          {
            hid: "og:image",
            property: "og:image",
            content: this.image && this.image.url,
          },
        ],
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
  width: 780px;
}
.aside {
  width: 354px;
}
.article {
  border-radius: 20px;
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
  border-bottom: none;
  &:hover {
    border-bottom: none;
  }
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
  &:hover {
    border: 1px solid $border1;
  }
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
  max-height: 500px;
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
@media screen and (max-width: 767px) {
  .inner {
    width: calc(100% - 30px);
  }
  .article {
    padding: 20px 15px;
    margin-bottom: 30px;
  }
  .content {
    margin-bottom: 0;
  }
  .category .taxonomy-list-link,
  .tag .taxonomy-list-link {
    padding: 12px;
    font-size: 12px;
  }
  .title {
    font-size: 29px;
    margin-bottom: 18px;
  }
}
</style>
