<template>
  <div>
    <Header :tags="tags" :categories="categories" />

    <div class="inner">
      <div class="content">
        <main class="main">
          <h1>404 Page Not Found</h1>
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
    return {
      recentPosts,
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
  head() {
    return {
      title: "404 Page Not Found - Nuxt Headless CMS",
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
  width: 780px;
}
.aside {
  width: 354px;
}
h1 {
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
    text-align: center;
    height: 200px;
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
}
</style>
