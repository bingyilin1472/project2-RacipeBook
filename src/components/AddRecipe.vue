<template>
  <div class="add-recipe container">
    <!-- 字indigo-text靛藍(css from Materialize)
         Materialize helpers也提供align靠齊屬性: left-align/right-align/center-align
    -->
    <h2 class="center-align indigo-text">Add New Recipe</h2>
    <!-- 改以AddRecipe取代原本refresh page的submit action   -->
    <form @submit.prevent="AddRecipe">
      <div class="field title">
        <!-- label標籤是用來為input標籤標註用   -->
        <!-- for只是單純告知是隨著誰，因此就單純取跟上面class一樣，表示為同一個group -->
        <label for="title">Recipe Title</label>
        <!--  name屬性是用來標記輸入內容的(是form裡面的input必備的一個attr，因為有很多輸入) -->
        <input type="text"  name="title" v-model="title">
      </div>
      <div v-for="(ingredient, index) in ingredients" :key="index" class='field'>
        <!-- <input type="text" v-model="ingredient">這綁定無法作用，因為ingredient只存於這個loop，因此綁定
              去修改她相當不合理，不過因為我們現在有index，ingredients也確實存在，用它來binding即可同步到input上
         -->
        <input type="text" name="ingredient" v-model="ingredients[index]">
        <!-- i行內inline但上面input是block element所以會在下行       -->
        <i class="material-icons delete"  @click="deleteIng(ingredient)">delete</i>
      </div>
      <div class="field add-ingredient">
        <!-- label標籤是用來為input標籤標註用   -->
        <label for="add-ingredient">Add an ingredient by typing content and then press "tab"</label>
        <!-- 要小心不要跟上面同樣v-model到同個data上，會變成都同步，v-model可以一對多
             tab有default效果，就是換行，但是不希望有這個現象(想要更新ingredient list同時清空)，可以用prevent做modifier
        -->
        <input type="text" name="add-ingredient" @keydown.tab="addIng" v-model="another">
      </div>
      <div class="button-field center-align">
        <!-- Materialize的btn可以於多種tag上使用譬如a、button ... pink是底色 -->
        <!-- form裡面的btn點擊會有一個default action，refresh page，這設定於他的submit動作之中
             透過vueJS的事件modifier可以避免預設事件，並且改以custom的function來反映該事件
        -->
        <!-- feedback有內容時候才show，v-if可以讓你決定什麼情況才要顯示該tag  -->
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Add Recipe</button>
      </div>
    </form>
  </div>


</template>

<script>
import db from '@/firebase/init'
//套件可以直接說from 套件名稱，因為有setting
import slugify from 'slugify'
export default {
  name: "AddRecipe",
  data(){
    return{
      // 初始設定為空，但是跟輸入做v-model雙向綁定，這樣一但輸入內容就會同步到title
      title: null,
      slug: null,
      another: null,
      feedback: null,
      ingredients: [] // 用來存放ingredients
    }
  },
  methods:{
    AddRecipe(){
      // 測試看submit default action是否確實被替換成此func
      // console.log("Add recipe")

      // 用title檢查是否有新的recipe可以送出，這邊等同允許ingredients沒東西
      if(this.title && this.ingredients.length > 0){
        this.feedback = null
        this.slug = slugify(this.title, {
          //告知遇到space要用啥取代
          replacement: '-',
          //告知要清掉那些字元characters，不希望他們出現在slug中
          //  /.../g表示全局匹配，...為regular expression，只要符合[...]中的字元集合的任何一個就都找出來移除
          remove:  /[$*_+~.()’”!\-:@]/g,
          // 下面這個表示轉小寫
          lower: true
        })

        console.log({
          title: this.title,
          ingredients: this.ingredients,
          slug: this.slug
        })

        db.collection('recipes').add({
          title: this.title,
          ingredients: this.ingredients,
          slug: this.slug
        }).then(() => {
          this.$router.push({ name: 'Index'})
        }).catch(err => {
          console.log(err)
        })

      }else if(!this.title){
        this.feedback = 'You must enter a recipe title first'
      }else{
        this.feedback =  'You should enter at least one ingredient and then press "tab"'
      }
    },
    addIng(){
      // 為了防止tab按下去，實際沒有輸入任何事物的情況，我們要檢查another是否為null
      // 因為有v-model綁定，因此只要有輸入，勢必不為空
      if(this.another){
        this.ingredients.push(this.another)
        console.log(this.ingredients)
        this.another=null
        // 有輸入內容就不需要feedback
        this.feedback=null
      }else{
        this.feedback = 'You must type some value to add an ingredient.'
      }
    },
    deleteIng(ing){
      this.ingredients = this.ingredients.filter(ingredient => {
        return ingredient != ing
      })
      console.log(this.ingredients)
    }

  }
}
</script>

<!-- scoped特性不建議使用，非原生的CSS效率差 -->
<style>
.add-recipe{
  /* 離navbar太近，往下 */
  margin-top: 60px;
  /* 內距 */
  padding: 20px;
  /* 輸入寬度給他縮小，不然太長，透過form直接控制裡面所有input width */
  max-width: 500px;
}
.add-recipe h2{
  /* 縮小字，不然他大到換行，em會依據父元素大小乘以倍數
     這種大小適合用於巢狀結構，一般網頁預設大小事16px(有些可能比較大譬如h)，這邊父元素可能是div對應的或許是一般的16px
   */
  font-size: 2em;
  /* 先上下、後左右，希望調節上下元素間距得用margin */
  margin: 20px auto;
}
.add-recipe .input-field{
  /* 對materialize內容再作修正，調整上下間距 */
  margin: 20px auto;
}
.button-field{
  margin: 20px auto;
}
.add-recipe .field{
  margin: 20px auto;
  position: relative;
}
.add-recipe .delete{
  color: #aaa;
  /* 若要配合parent空間，parent要設置position: relative */
  position: absolute;
  /* 置右*/
  right: 0;
  /* bottom會上推，由底 */
  bottom: 16px;
  font-size: 1.4em;
  cursor: pointer;
}
</style>
