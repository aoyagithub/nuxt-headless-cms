<template>
  <div class="share">
    <ul class="share-list">
      <li class="share-list-item">
        <a
          :href="twitterLink"
          target="_blank"
          rel="noopener noreferrer"
          class="share-list-link twitter"
        >
          <img
            src="~/assets/images/twitter.svg"
            alt="Twitter"
            class="share-list-img share-list-img-twitter"
          />
        </a>
      </li>
      <li class="share-list-item">
        <a
          :href="facebookLink"
          target="_blank"
          rel="noopener noreferrer"
          class="share-list-link facebook"
        >
          <img
            src="~/assets/images/facebook.svg"
            alt="Facebook"
            class="share-list-img share-list-img-facebook"
          />
        </a>
      </li>
      <li class="share-list-item">
        <span class="share-list-link clipboard" @click="copyToClipboard">
          <img
            src="~/assets/images/clipboard.svg"
            alt="Copy to clipboard"
            class="share-list-img share-list-img-clipboard"
          />
        </span>
      </li>
    </ul>
    <p v-show="clipboard" class="clipboard-text">記事のURLをコピーしました！</p>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      clipboard: false,
    };
  },
  computed: {
    twitterLink() {
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        this.title
      )}&url=https://your-domain.com/${this.id}`;
    },
    facebookLink() {
      return `https://www.facebook.com/sharer.php?u=https://your-domain.com/${this.id}`;
    },
  },
  methods: {
    copyToClipboard() {
      this.clipboard = true;
      navigator.clipboard
        .writeText(`https://your-domain.com/${this.id}`)
        .then(() => {})
        .catch((e) => {
          console.error(e);
        });
      setTimeout(() => {
        this.clipboard = false;
      }, 5000);
    },
  },
};
</script>
<style lang="scss" scoped>
.share {
  margin-top: 80px;
  margin-bottom: 40px;
}
.share-list {
  display: flex;
  justify-content: center;
}
.share-list-item {
  margin-right: 10px;
  margin-left: 10px;
}
.share-list-link {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transition: all 0.5s;
  background-color: lighten(#c4c4c4, 8%);
  display: block;
  position: relative;
  cursor: pointer;
  &:hover {
    background-color: darken(#c4c4c4, 8%);
  }
}
.clipboard-text {
  text-align: center;
  font-size: 14px;
  margin-top: 1em;
}
.share-list-img {
  position: absolute;
  left: 50%;
  &-twitter {
    width: 28px;
    top: 54%;
    transform: translate(-50%, -54%);
  }
  &-facebook {
    width: 34px;
    top: 52%;
    transform: translate(-50%, -52%);
  }
  &-clipboard {
    width: 24px;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
@media screen and (max-width: 767px) {
  .share {
    margin-top: 40px;
  }
  .share-list-link {
    width: 54px;
    height: 54px;
  }
}
</style>
