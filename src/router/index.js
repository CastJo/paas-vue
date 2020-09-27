import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function loadView(view) {
    return () => import(`@/views/${view}.vue`);
}

// function loadComponent(component) {
//   return () => import(`@/components/${component}.vue`);
// }

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};
const routes = [
    {
        path: '/',
        redirect: "/container",
    },
    {
        path: "/login",
        name: "Login",
        component: loadView("Login"),
    },
    {
        path: "/index",
        name: "Index",
        component: loadView("Index"),
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: "/container",
                name: "Container",
                component: loadView("Container"),
            },
            {
                path: "/image",
                name: "Image",
                component: loadView("Image"),
            },
            {
                path: "/public-image",
                name: "PublicImage",
                component: loadView("PublicImage"),
            },
            {
                path: "/monitor",
                name: "Monitor",
                component: loadView("Monitor"),
            },
        ]
    }
]

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
})

export default router
