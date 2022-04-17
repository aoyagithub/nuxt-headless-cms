<template>
  <header
    class="header"
    :class="{ active: open }"
    itemscope="itemscope"
    itemtype="http://schema.org/WPHeader"
  >
    <div class="inner header-top">
      <nuxt-link :to="`/`" class="header-link">
        <span class="header-title"> Nuxt Headless CMS </span>
      </nuxt-link>
      <div class="header-nav" @click="openMenu" :class="{ open: menu }">
        <span class="header-nav-line" />
        <span class="header-nav-line" />
        <span class="header-nav-line" />
      </div>
      <div class="header-search" @click="openSearch">
        <svg
          v-show="!open"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10.5" cy="10.5" r="9" stroke="#c4c4c4" stroke-width="3" />
          <path
            d="M17.001 17L22.2868 22.1198"
            stroke="#c4c4c4"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <svg
          v-show="open"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10.5" cy="10.5" r="9" stroke="#fff" stroke-width="3" />
          <path
            d="M17.001 17L22.2868 22.1198"
            stroke="#fff"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>
    <div class="inner header-bottom">
      <ul class="header-submenu">
        <li
          v-for="category in categories"
          :key="category.id"
          class="header-submenu-item"
        >
          <nuxt-link
            :to="`/category/${category.id}/page/1`"
            class="header-submenu-link"
          >
            <span class="header-submenu-en">{{ category.english }}</span>
            <span class="header-submenu-ja">{{ category.category }}</span>
          </nuxt-link>
        </li>
      </ul>
    </div>
    <div v-show="open" class="header-overlay" :class="{ active: open }">
      <div class="inner">
        <div
          v-show="menu"
          class="header-overlay-content header-overlay-content-menu"
        >
          <div class="header-overlay-item category">
            <h2 class="header-overlay-item-title">Categories</h2>
            <ul class="header-overlay-item-list">
              <li
                v-for="category in categories"
                :key="category.id"
                class="header-overlay-item-list-item"
              >
                <nuxt-link
                  :to="`/category/${category.id}/page/1`"
                  class="header-overlay-item-list-link"
                  >{{ category.category }}</nuxt-link
                >
              </li>
            </ul>
          </div>
          <div class="header-overlay-item tag">
            <h2 class="header-overlay-item-title">Topics</h2>
            <ul class="header-overlay-item-list">
              <li
                v-for="tag in tags"
                :key="tag.id"
                class="header-overlay-item-list-item"
              >
                <nuxt-link
                  :to="`/tag/${tag.id}/page/1`"
                  class="header-overlay-item-list-link"
                  >{{ tag.tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>
          <div class="header-overlay-item links">
            <ul class="header-overlay-item-list">
              <li class="header-overlay-item-list-item">
                <nuxt-link :to="`/about`" class="header-overlay-item-list-link"
                  >About</nuxt-link
                >
              </li>
              <li class="header-overlay-item-list-item">
                <nuxt-link
                  :to="`/contact`"
                  class="header-overlay-item-list-link"
                  >Contact</nuxt-link
                >
              </li>
              <li class="header-overlay-item-list-item">
                <nuxt-link
                  :to="`/sitemap`"
                  class="header-overlay-item-list-link"
                  >Sitemap</nuxt-link
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          v-show="search"
          class="header-overlay-content header-overlay-content-search"
        >
          <input
            ref="input"
            class="header-overlay-content-input"
            type="text"
            placeholder="Search..."
            @keypress="setSearchable"
            @keypress.enter="enterSearch"
          />
        </div>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  props: {
    categories: {
      type: Array,
      required: false,
      default: () => [],
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      open: false,
      menu: false,
      search: false,
    };
  },
  methods: {
    openMenu() {
      if (this.open) {
        if (this.menu) {
          this.menu = false;
          this.open = false;
        }
        if (this.search) {
          this.menu = true;
          this.search = false;
        }
      } else {
        this.open = true;
        this.menu = true;
      }
    },
    openSearch() {
      if (this.open) {
        if (this.search) {
          this.open = false;
          this.search = false;
        }
        if (this.menu) {
          this.menu = false;
          this.search = true;
          this.$nextTick(() => this.$refs.input.focus());
        }
      } else {
        this.open = true;
        this.search = true;
        this.$nextTick(() => this.$refs.input.focus());
      }
    },
    multipleHandler(e) {
      this.setSearchable();
      this.enterSearch(e);
    },
    setSearchable() {
      this.searchable = true;
    },
    enterSearch(e) {
      if (!e.target.value.trim() || !this.searchable) {
        return;
      }
      this.$router.push({ path: "/search", query: { q: e.target.value } });
    },
  },
  head() {
    return {
      bodyAttrs: {
        class: this.open ? "header-active" : "",
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.header {
  font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", Helvetica, Arial,
    Meiryo, sans-serif;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;

  z-index: 5;
  &.active {
    .header-nav-line {
      background-color: #fff;
    }
    path {
      fill: #fff;
    }
    .inner.header-bottom {
      display: none;
    }
  }

  .inner {
    height: 60px;
    border-bottom: 1px solid $border1;
    position: relative;
    z-index: 20;
    &.header-top {
      height: 85px;
    }
  }
}

.header-link {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 20;
  transform: translateX(-50%) translateY(-50%);
  border-bottom: none;
  &:hover {
    border-bottom: none;
  }
}
.header-title {
  font-size: 34px;
  font-weight: $ExtraBold;
  display: flex;
  align-items: center;
  color: #2b3a4f;
  &-img {
    transition: all 0.5s;
    width: 80%;
    margin: auto;
  }
}
.header-active .header-title {
  color: #fff;
}
.header-nav {
  position: absolute;
  left: 20px;
  overflow: hidden;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  width: 24px;
  height: 20px;
  cursor: pointer;
  z-index: 20;
  &.open {
    .header-nav-line {
      &:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }
      &:nth-child(2) {
        transform: rotate(45deg);
      }
      &:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }
    }
  }
}
.header-nav-line {
  display: block;
  position: absolute;
  width: 18px;
  height: 3px;
  background-color: #c4c4c4;
  left: 0;
  border-radius: 2px;
  transition: transform 0.2s ease-in;
  &:nth-child(1) {
    top: 0;
  }
  &:nth-child(2) {
    top: 7px;
  }
  &:nth-child(3) {
    top: 14px;
  }
}
.header-search {
  position: absolute;
  right: 20px;
  width: 24px;
  height: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: block;
  cursor: pointer;
  z-index: 20;
}
.header-overlay.active {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(darken($color2, 70%), 0.8);
  backdrop-filter: blur(4px);
  z-index: 10;
  overflow: hidden;
  color: #fff;
  a {
    color: #fff;
  }
  .inner {
    top: 85px;
    position: absolute;
    left: 50%;
    height: 100%;
    transform: translateX(-50%);
    border: none;
    overflow-y: auto;
  }
}
.header-overlay-content {
  display: flex;
  padding-top: 20px;
}
.header-overlay-content-search {
  height: calc(100% - 240px);
  position: relative;
}
.header-overlay-content-input {
  font-size: 20px;
  padding: 12px 40px 12px 2%;
  margin-right: auto;
  margin-left: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  border: none;
  background-color: transparent;
  border-bottom: 1px solid $border1;
  color: #fff;
  outline: none;
  border-radius: 0;
  &::placeholder {
    color: rgba(255, 255, 255, 0.85);
  }
}
.header-overlay-item {
  width: 33.33%;
  &.links {
    padding-left: 50px;
    font-weight: $Bold;
    .header-overlay-item-list-item {
      margin-bottom: 20px;
    }
  }
}
.header-overlay-item-title {
  line-height: 1.6;
  font-size: 24px;
  font-weight: $Bold;
  margin-bottom: 0.5em;
}
.header-overlay-item-list-item {
  line-height: 1.8;
  font-size: 18px;
  margin-bottom: 0.25em;
}
.tag .header-overlay-item-list-item {
  display: inline-block;
  margin-right: 6px;
  margin-left: 6px;
  margin-bottom: 10px;
}
.tag .header-overlay-item-list-link {
  padding: 6px 18px;
  border-radius: 20px;
  border: 1px solid #fff;
  color: #fff;
  display: block;
  text-align: center;
  min-width: 68px;
  line-height: 1;
  font-size: 18px;
  &:hover {
    border: 1px solid #fff;
  }
}
.scrolled {
  .inner.header-bottom {
    display: none;
  }
}
.header-submenu {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  &-link {
    padding-right: 10px;
    padding-left: 10px;

    color: $black;
    font-weight: $Bold;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: none;
    &:hover {
      border-bottom: none;
    }
  }
  &-en {
    font-size: 17px;
    font-weight: $ExtraBold;
  }
  &-ja {
    font-size: 12px;
  }
}
@media screen and (max-width: 768px) {
  .header-title {
    font-size: 18px;
    justify-content: center;
  }
}

@media screen and (max-width: 767px) {
  .header {
    border-bottom: 1px solid $border1;
  }
  .header .inner {
    &.header-top {
      height: 60px;
    }
    &.header-bottom {
      display: none;
    }
    border-bottom: none;
  }
  .header-nav {
    bottom: auto;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }
  .header-search {
    bottom: auto;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 20px;
    height: 20px;
  }
  .header-link {
    width: 210px;
  }
  .header-overlay.active .inner.header-top {
    height: calc(100% - 60px);
  }
  .header-overlay-content {
    flex-direction: column;
  }
  .header-overlay-item {
    width: 100%;
    & + .header-overlay-item {
      margin-top: 1em;
    }
  }
  .header-overlay-item-title {
    font-size: 18px;
    line-height: 1.4;
    margin-bottom: 20px;
  }
  .header-overlay-item-list-item {
    font-size: 16px;
  }
  .header-overlay.active .inner {
    top: 70px;
  }
  .category .header-overlay-item-list {
    display: flex;
    flex-wrap: wrap;
    .header-overlay-item-list-item {
      min-width: 50%;
    }
  }
  .tag .header-overlay-item-list-item {
    margin-right: 8px;
    margin-left: 8px;
  }

  .tag .header-overlay-item-list-link {
    font-size: 12px;
    padding: 12px;
    min-width: 78px;
  }
  .header-overlay-content-input {
    width: 100%;
  }
  .header-overlay-item + .header-overlay-item {
    padding-left: 0;
  }
}
</style>
