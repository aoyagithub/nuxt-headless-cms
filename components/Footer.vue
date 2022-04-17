<template>
  <footer
    class="footer"
    role="contentinfo"
    itemscope="itemscope"
    itemtype="http://schema.org/WPFooter"
  >
    <div class="inner">
      <div class="footer-content">
        <div class="footer-item">
          <div class="footer-item-item">
            <h1 class="footer-title">Nuxt Headless CMS</h1>
            <p class="footer-text">Nuxt Headless CMS</p>
          </div>
          <p class="footer-copyright footer-item-item pc">
            © {{ year }} Nuxt Headless CMS
          </p>
        </div>
        <div class="footer-item">
          <h2 class="footer-heading">Topics</h2>
          <ul class="tags-list">
            <li v-for="tag in tags" :key="tag.id" class="tags-list-item">
              <nuxt-link :to="`/tag/${tag.id}/page/1`" class="tags-list-link">{{
                tag.tag
              }}</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="footer-item">
          <ul class="footer-link-list">
            <li class="footer-link-item">
              <nuxt-link :to="`/about`" class="footer-link-link"
                >About</nuxt-link
              >
            </li>
            <li class="footer-link-item">
              <nuxt-link :to="`/contact`" class="footer-link-link"
                >Contact</nuxt-link
              >
            </li>
            <li class="footer-link-item">
              <nuxt-link :to="`/sitemap`" class="footer-link-link"
                >Sitemap</nuxt-link
              >
            </li>
          </ul>
          <p class="footer-copyright footer-item-item sp">
            © {{ year }} Nuxt Headless CMS
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: true,
    },
  },
  data: () => {
    return {
      year: "",
    };
  },
  created() {
    const d = new Date();
    this.year = d.getFullYear();
  },
};
</script>

<style lang="scss" scoped>
a {
  color: $black;
  font-weight: $Bold;
}
.footer {
  background-color: lighten($color2, 10%);
  padding-top: 40px;
  padding-bottom: 60px;
  font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", Helvetica, Arial,
    Meiryo, sans-serif;
}
.footer-content {
  display: flex;
  justify-content: space-between;
}
.footer-item {
  width: 33.33%;
  &:nth-child(1) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &:nth-child(2) {
    padding-top: 20px;
    margin-right: 50px;
    margin-left: 50px;
  }
  &:nth-child(3) {
    padding-left: 50px;
    padding-top: 20px;
  }
}
.footer-title {
  font-weight: $ExtraBold;
  font-size: 30px;
  line-height: 1.36;
  margin-bottom: 20px;
}
.footer-text {
  font-size: 14px;
  line-height: 1.5;
}
.footer-heading {
  font-size: 18px;
  font-weight: $Bold;
  line-height: 1.4;
  margin-bottom: 20px;
}
.tags-list {
  display: flex;
  flex-wrap: wrap;
}
.tags-list-item {
  margin-right: 8px;
  margin-bottom: 8px;
}
.tags-list-link {
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid $border1;
  color: $black;
  display: block;
  text-align: center;
  min-width: 68px;
  line-height: 1;
  font-size: 11px;
  &:hover {
    border: 1px solid $border1;
  }
}
.footer-link-item {
  font-size: 16px;
  margin-bottom: 18px;
  line-height: 1.376;
}
.footer-copyright {
  font-size: 12px;
  line-height: 1.3;
}
@media screen and (min-width: 768px) {
  .sp {
    display: none;
  }
  .footer-item:nth-child(1) {
    min-height: 180px;
  }
}
@media screen and (max-width: 767px) {
  .pc {
    display: none;
  }
  .footer {
    padding: 0;
  }
  .footer-content {
    flex-direction: column;
  }
  .footer-item {
    width: 100%;
    &:nth-child(1) {
      order: 2;
      padding-top: 20px;
    }
    &:nth-child(2) {
      order: 1;
      margin-left: 0;
      padding-top: 20px;
    }
    &:nth-child(3) {
      order: 3;
      padding-left: 0;
      padding-top: 30px;
    }
  }
  .tags-list-link {
    font-size: 12px;
    padding: 12px;
    min-width: 78px;
  }
  .footer-link-item {
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
  .footer-title {
    text-align: center;
  }
  .footer-link-list {
    display: flex;
    justify-content: center;
  }
  .footer-copyright {
    text-align: center;
    font-size: 13px;
    margin-bottom: 14px;
  }
}
</style>
