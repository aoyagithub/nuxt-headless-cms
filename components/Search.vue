<template>
  <section class="sidebar">
    <label class="label">
      <h2 class="sidebar-heading">Search</h2>
      <input
        class="input"
        type="text"
        placeholder="Search..."
        @keypress="setSearchable"
        @keypress.enter="search"
      />
    </label>
  </section>
</template>

<script>
export default {
  data() {
    return {
      searchable: false,
    };
  },
  methods: {
    multipleHandler(e) {
      this.setSearchable();
      this.search(e);
    },
    setSearchable() {
      this.searchable = true;
    },
    search(e) {
      if (!e.target.value.trim() || !this.searchable) {
        return;
      }
      this.$router.push({ path: '/search', query: { q: e.target.value } });
    },
  },
};
</script>
<style lang="scss" scoped>
.sidebar {
  border-radius: 20px;
  background-color: #f7f7f7;
  margin-bottom: 30px;
}
.label {
  position: relative;
  display: block;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    display: inline-block;
    width: 20px;
    height: 20px;
    left: 20px;
    bottom: 20px;
    background-image: url(~@/assets/images/search.svg);
    background-repeat: no-repeat;
    background-size: contain;
  }
}
.sidebar-heading {
  text-align: center;
  line-height: 1.27;
  font-size: 22px;
  font-weight: $Bold;
  padding: 14px 0;
  border-bottom: 1px solid lighten($border1, 4%);
}
.input {
  height: 56px;
  width: 100%;
  padding-right: 20px;
  padding-left: 60px;
  background-color: transparent;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border: none;
  font-size: 18px;
  color: $black;
}
</style>
