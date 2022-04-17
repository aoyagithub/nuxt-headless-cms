<template>
  <div>
    <Header :tags="tags" :categories="categories" />

    <div class="inner">
      <div class="content">
        <main class="main">
          <h1>Contact</h1>
          <form @submit.prevent="onSubmit">
            <div class="item">
              <input
                v-model="name"
                name="name"
                type="text"
                class="input"
                placeholder="Name *"
                required
              />
            </div>
            <div class="item">
              <input
                v-model="email"
                name="email"
                type="email"
                class="input"
                placeholder="Email *"
                required
              />
            </div>
            <div class="item">
              <textarea
                v-model="message"
                name="message"
                rows="6"
                class="message"
                placeholder="Message"
              ></textarea>
            </div>
            <div v-if="isSubmit" class="item">
              <p class="form-thanks">Thanks!</p>
            </div>
            <div class="item">
              <button class="button" type="submit">
                {{ send }}
              </button>
            </div>
          </form>

          <form
            hidden
            name="contact_form"
            data-netlify="true"
            netlify-honeypot="bot-field"
          >
            <input type="hidden" name="bot-field" />

            <input name="name" type="text" required />

            <input name="email" type="email" required />

            <textarea name="message"></textarea>
          </form>
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
import axios from "axios";

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
      name: "",
      email: "",
      message: "",
      isSubmit: false,
      send: "Send",
    };
  },
  methods: {
    onSubmit() {
      this.send = "Sending...";
      const params = new URLSearchParams();

      params.append("form-name", "contact_form");

      params.append("name", this.name);
      params.append("email", this.email);
      params.append("message", this.message);

      axios.post("/", params).then(() => {
        this.name = "";
        this.email = "";
        this.message = "";
        this.isSubmit = true;
        this.send = "Send";
        setTimeout(() => {
          this.isSubmit = false;
        }, 5000);
      });
    },
  },
  head() {
    return {
      title: "Contact - Nuxt Headless CMS",
      meta: [
        { name: "robots", content: "noindex, nofollow" },
        {
          hid: "description",
          name: "description",
          content:
            " Nuxt Headless CMSへのお問い合わせはこちらよりお願いいたします。",
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
  font-weight: $Bold;
  margin-bottom: 1em;
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
input,
button,
select,
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
  border: none;
  border-radius: 0;
  font: inherit;
  outline: none;
}

textarea {
  resize: vertical;
}

input[type="checkbox"],
input[type="radio"] {
  display: none;
}

input[type="submit"],
input[type="button"],
label,
button,
select {
  cursor: pointer;
}

select::-ms-expand {
  display: none;
}
.item {
  width: 80%;
  & + .item {
    margin-top: 1em;
  }
}
.input {
  background-color: $color1;
  font-size: 20px;
  width: 100%;
  border-radius: 100px;
  padding: 0.5em 1em;
  &::placeholder {
    color: #c4c4c4;
  }
}
.message {
  border: 4px solid $color1;
  font-size: 20px;
  width: 100%;
  border-radius: 20px;
  padding: 0.5em 1em;
  &::placeholder {
    color: #c4c4c4;
  }
}
.button {
  font-weight: $Bold;
  font-size: 20px;
  color: #fff;
  background-color: #c4c4c4;
  border-radius: 100px;
  padding: 0.5em 1.5em;
  transition: all 0.5s;
  &:hover {
    background-color: #4e473f;
  }
}
.form-thanks {
  font-size: 20px;
  font-weight: $Bold;
  border-radius: 100px;
  color: #fff;
  background-color: #c4c4c4;
  text-align: center;
  padding: 0.5em 1em;
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
  h1 {
    text-align: center;
  }
  .item {
    margin-right: auto;
    margin-left: auto;
  }
}
@media screen and (max-width: 767px) {
  .inner {
    width: calc(100% - 30px);
  }
  .content {
    margin-bottom: 0;
  }
  h1 {
    font-size: 30px;
    margin-bottom: 40px;
  }
  h2 {
    font-size: 20px;
    margin-bottom: 12px;
  }
  p {
    font-size: 18px;
    margin-bottom: 28px;
  }
  .item {
    width: 100%;
  }
  .button {
    width: 100%;
  }
}
</style>
