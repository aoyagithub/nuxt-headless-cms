<template>
  <div class="wrapper">
    <ul class="pager">
      <li v-if="current > 1" class="page arrow">
        <nuxt-link :to="getPath(current - 1)" class="link">
          <img
            src="~/assets/images/pager-left.svg"
            width="24"
            height="24"
            alt="前のページへ"
            class="image"
          />
        </nuxt-link>
      </li>
      <li v-if="3 < current" class="page">
        <nuxt-link :to="getPath(1)" class="link"> 1 </nuxt-link>
      </li>
      <li v-if="4 < current" class="omission">...</li>
      <li
        v-for="p in pager"
        v-show="current - 3 <= p && p <= current + 1"
        :key="p"
        class="page"
        :class="{ active: current === p + 1 }"
      >
        <template v-if="p + 1 === current">
          <span class="link">{{ p + 1 }}</span>
        </template>
        <template v-else>
          <nuxt-link :to="getPath(p + 1)" class="link">
            {{ p + 1 }}
          </nuxt-link>
        </template>
      </li>
      <li v-if="current + 3 < pager.length" class="omission">...</li>
      <li v-if="current + 2 < pager.length" class="page">
        <nuxt-link :to="getPath(pager.length)" class="link">
          {{ pager.length }}
        </nuxt-link>
      </li>
      <li v-if="current < pager.length" class="page arrow">
        <nuxt-link :to="getPath(current + 1)" class="link">
          <img
            src="~/assets/images/pager-right.svg"
            width="24"
            height="24"
            alt="次のページへ"
            class="image"
          />
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    pager: {
      type: Array,
      required: false,
      default: () => [],
    },
    current: {
      type: Number,
      required: true,
    },
    category: {
      type: Object,
      required: false,
      default: undefined,
    },
    tag: {
      type: Object,
      required: false,
      default: undefined,
    },
  },
  methods: {
    getPath(p) {
      if (this.category !== undefined) {
        return `/category/${this.category.id}/page/${p}`;
      } else if (this.tag !== undefined) {
        return `/tag/${this.tag.id}/page/${p}`;
      } else {
        return `/page/${p}`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pager {
  display: flex;
  justify-content: center;
}
.page {
  margin-right: 3px;
  margin-left: 3px;
}
.omission {
  margin: 4px 3px;
  width: 24px;
  text-align: center;
}
.link {
  border-radius: 50%;
  display: block;
  width: 42px;
  height: 42px;
  text-align: center;
  line-height: 42px;
  font-size: 16px;
  color: $black;
  font-weight: $Bold;
  border-bottom: none;
  background-color: $color1;
}
.active .link {
  background-color: darken($color1, 25%);
}
.arrow .link {
  position: relative;
}
.image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
}
</style>
