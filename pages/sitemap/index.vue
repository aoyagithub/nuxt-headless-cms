<template>
  <div>
    <Header :tags="tags" :categories="categories" />

    <div class="inner">
      <div class="content">
        <main class="main">
          <h1>Sitemap</h1>
          <ul class="list">
            <li
              v-for="content in articles.contents"
              :key="content.id"
              class="item"
            >
              <nuxt-link
                :to="`/${content.id}`"
                class="link"
                :title="content.title"
                >{{ content.title }}
              </nuxt-link>
            </li>
          </ul>
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
        </aside>
      </div>
    </div>
    <Footer :tags="tags" />
  </div>
</template>

<script>
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

    const articles = await $microcms.get({
      endpoint: "articles",
      queries: {
        limit: 9999,
      },
    });
    return {
      recentPosts,
      categories: categories.contents,
      tags: tags.contents,
      contents,
      articles,
    };
  },
  data() {
    return {
      publishedAt: "",
      image: null,
    };
  },
  head() {
    return {
      title: "Sitemap - Nuxt Headless CMS",
      meta: [
        {
          hid: "description",
          name: "description",
          content: " Nuxt Headless CMSサイトマップ",
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
h1 {
  font-size: 32px;
  margin-bottom: 1em;
  font-weight: $Bold;
}
h2 {
  font-weight: $Bold;
  margin-top: 60px;
  font-size: 28px;
}
p {
  font-size: 16px;
  line-height: 1.8;
  margin-top: 1em;
}
.list {
  padding-left: 15px;
  list-style: disc outside;
  margin-right: 0;
  margin-left: 15px;
  margin-bottom: 40px;
}
.item {
  margin-bottom: 10px;
}
.link {
  color: $black;
  font-weight: $Bold;
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
  .content {
    margin-bottom: 0;
  }
  .list {
    margin-bottom: 20px;
  }
}
</style>
