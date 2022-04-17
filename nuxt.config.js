import { client } from "./utils/microcms";
const { API_KEY, SERVICE_ID, GTM_ID } = process.env;

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Nuxt Headless CMS",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "og:title", property: "og:title", content: "Nuxt Headless CMS" },
      {
        hid: "description",
        name: "description",
        content: "description text",
      },
      {
        hid: "og:description",
        property: "og:description",
        content: "description text",
      },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://your-domain.com/",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "https://your-domain.com/images/your-domain.com",
      },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/styles/reset.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/vue-scrollto", "~/plugins/jsonld"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxtjs/eslint-module"],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    GTM_ID ? ["@nuxtjs/gtm"] : undefined,
    ["@nuxtjs/sitemap"],
    "nuxt-microcms-module",
    "@nuxtjs/style-resources",
    ["@nuxtjs/dayjs"],
    ["@nuxtjs/proxy"],
    "@nuxtjs/robots",
    [
      "nuxt-lazy-load",
      {
        // Your options
      },
    ],
  ],
  robots: {
    UserAgent: "*",
    Disallow: "/",
  },
  dayjs: {
    locales: ["ja"],
    defaultLocale: "ja",
  },
  gtm: {
    id: GTM_ID || undefined,
  },
  proxy: {
    "/.netlify": "http://localhost:9000",
  },
  microcms: {
    options: {
      serviceDomain: SERVICE_ID,
      apiKey: API_KEY,
    },
    mode: process.env.NODE_ENV === "production" ? "server" : "all",
  },
  styleResources: {
    scss: ["~/assets/styles/variable.scss"],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: "/page/:id",
        component: resolve(__dirname, "pages/index.vue"),
        name: "pages",
      });
      routes.push({
        path: "/category/:categoryId/page/:id",
        component: resolve(__dirname, "pages/index.vue"),
        name: "categories",
      });
      routes.push({
        path: "/tag/:tagId/page/:id",
        component: resolve(__dirname, "pages/index.vue"),
        name: "tags",
      });
      routes.push({
        path: "*",
        component: resolve(__dirname, "pages/404/index.vue"),
        name: "custom",
      });
    },
  },
  generate: {
    interval: 100,
    async routes() {
      const range = (start, end) =>
        [...Array(end - start + 1)].map((_, i) => start + i);
      const limit = 50;

      const getArticles = (offset = 0) => {
        return client
          .get({
            endpoint: "articles",
            queries: {
              offset,
              limit,
              depth: 2,
            },
          })
          .then(async (res) => {
            let articles = [];
            if (res.totalCount > offset + limit) {
              articles = await getArticles(offset + limit);
            }
            return [
              ...res.contents.map((content) => ({
                route: `/${content.id}`,
                payload: {
                  content,
                },
              })),
              ...articles,
            ];
          });
      };
      const articles = await getArticles();

      const index = {
        route: "/",
      };

      const pages = await client
        .get({
          endpoint: "articles",
          queries: {
            limit: 0,
          },
        })
        .then((res) =>
          range(1, Math.ceil(res.totalCount / 10)).map((p) => ({
            route: `/page/${p}`,
          }))
        );

      const search = {
        route: "/search",
      };

      const categories = await client
        .get({
          endpoint: "categories",
          queries: {
            fields: "id",
          },
        })
        .then(({ contents }) => {
          return contents.map((content) => content.id);
        });

      const categoryPages = await Promise.all(
        categories.map((category) =>
          client
            .get({
              endpoint: "articles",
              queries: {
                limit: 0,
                filters: `category[equals]${category}`,
              },
            })
            .then((res) => {
              return range(1, Math.ceil(res.totalCount / 10)).map((p) => ({
                route: `/category/${category}/page/${p}`,
              }));
            })
        )
      );
      const flattenCategoryPages = [].concat.apply([], categoryPages);

      const tags = await client
        .get({
          endpoint: "tags",
          queries: {
            fields: "id",
            limit: 1000,
          },
        })
        .then(({ contents }) => {
          return contents.map((content) => content.id);
        });

      const tagPages = await Promise.all(
        tags.map((tag) =>
          client
            .get({
              endpoint: "articles",
              queries: {
                limit: 0,
                filters: `article_tags[contains]${tag}`,
              },
            })
            .then((res) => {
              return range(1, Math.ceil(res.totalCount / 10)).map((p) => ({
                route: `/tag/${tag}/page/${p}`,
              }));
            })
        )
      );
      const flattenTagPages = [].concat.apply([], tagPages);

      return [
        index,
        search,
        ...articles,
        ...pages,
        ...flattenCategoryPages,
        ...flattenTagPages,
      ];
    },
    dir: "dist",
  },
  sitemap: {
    path: "/sitemap.xml",
    hostname: "https://your-domain.com",
    exclude: ["/draft", "/404"],
    gzip: true,
    trailingSlash: true,
  },
};
