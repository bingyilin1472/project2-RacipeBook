import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import AddRecipe from "../components/AddRecipe";
import EditRecipe from "../components/EditRecipe";

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 只有一個'/' home page
      path: '/',
      // 這個name之後可以使router不用url location方式去呼叫
      name: 'Index',
      // 除了要route導航到的component要在上面import
      // 還要註冊到某route下的component之中
      component: Index
    },
    {
      path: '/add-recipe',
      name: 'AddRecipe',
      component: AddRecipe
    },
    {
      // colon加paraName帶參數近來使用
      path: '/edit-recipe/:recipe_slug',
      name: 'EditRecipe',
      component: EditRecipe
    }
  ]
})
