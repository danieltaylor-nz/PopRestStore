/* This software is in the public domain under CC0 1.0 Universal plus a Grant of Patent License. */
var preLoginRoute = {};
var appObjects = {
    // see https://router.vuejs.org/en/essentials/history-mode.html
    // for route path expressions see https://router.vuejs.org/en/essentials/dynamic-matching.html AND https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js
    router: new VueRouter({
        // TODO sooner or later: base: storeConfig.basePath, mode: 'history',
        routes: [
            { path: "/", name: "landing", component: storeComps.LandingPageTemplate },
            { path: "/login", name: "login", component: storeComps.LoginPageTemplate, 
               beforeEnter: (to, from, next) => {
                    preLoginRoute = from;
                    next();
               } },
            { path: "/search/:searchText", name: "search", component: storeComps.SearchTemplate },
            { path: "/category/:categoryId/:extra?", name: "category", component: storeComps.CategoryPageTemplate },
            { path: "/product/:productId/:extra?", name: "product", component: storeComps.ProductPageTemplate },
            { path: "/checkout", name: "checkout", component: storeComps.CheckOutPageTemplate },
            { path: "/checkout/:orderId", name: "successcheckout", component: storeComps.SuccessCheckOutTemplate },
            { path: "/orders/:orderId", name: "order", component: storeComps.CustomerOrderPageTemplate },
            { path: "/orders", name: "orders", component: storeComps.CustomerOrdersPageTemplate },
            { path: "/account", name: "account", component: storeComps.AccountPageTemplate },
            { path: "/account/create", name: "createaccount", component: storeComps.CreateAccountPageTemplate },
            { path: "/resetPassword", name: "resetPassword", component: storeComps.ResetPasswordTemplate }
        ]
    }),
    App: {
        name: "app",
        template: '<div id="app"><router-view></router-view></div>',
        data() { return {}; }, components: {}
    }
};

// TODO: leave this, reminder to use vue.min.js for production: Vue.config.productionTip = false;

var sotreApp = new Vue({
    el: "#app",
    router: appObjects.router,
    // state: { categories: [], user: null },
    data: {
        storeComps: storeComps, storeConfig: storeConfig,
        storeInfo: storeInfo, categoryList: storeInfo.categoryList, categoryByType: storeInfo.categoryByType,
        preLoginRoute: null,
        // apiKey null unless user is logged in
        apiKey: null,
        // session token for all non-get requests when no user is logged in (no api_key is passed)
        moquiSessionToken: null,
        // userInfo null unless user is logged in, then has response from /customer/info
        customerInfo: storeInfo.customerInfo,
        cartInfo: null
    },
    template: "<App/>",
    components: { App:appObjects.App },
    mounted: function () {
        if (this.storeConfig.storeName && this.storeConfig.storeName.length) document.title = this.storeConfig.storeName;
        var storeInfo = this.storeInfo;
        if (storeInfo.apiKey && storeInfo.apiKey.length) { this.apiKey = storeInfo.apiKey; storeInfo.apiKey = null; }
        if (storeInfo.moquiSessionToken && storeInfo.moquiSessionToken.length) {
            this.moquiSessionToken = storeInfo.moquiSessionToken; storeInfo.moquiSessionToken = null; }
        if (storeInfo.customerInfo && storeInfo.customerInfo.partyId) {
            this.customerInfo = storeInfo.customerInfo; storeInfo.customerInfo = null; }
    }
});
