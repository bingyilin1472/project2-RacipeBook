<template>
  <div class="edit-recipe container">
    <h2>Edit {{ recipe.title }}</h2>
    <!-- 改以AddRecipe取代原本refresh page的submit action   -->
    <form @submit.prevent="EditRecipe">
      <div class="field title">
        <label for="title">Recipe Title</label>
        <!--  name屬性是用來標記輸入內容的(是form裡面的input必備的一個attr，因為有很多輸入) -->
        <input type="text"  name="title" v-model="recipe.title">
      </div>
      <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class='field'>
        <label for="ingredient">Ingredient</label>
        <input type="text" name="ingredient" v-model="recipe.ingredients[index]">
        <!-- i行內inline但上面input是block element所以會在下行       -->
        <i class="material-icons delete"  @click="deleteIng(ingredient)">delete</i>
      </div>
      <div class="field add-ingredient">
        <label for="add-ingredient">Add an ingredient by typing content and then press "tab"</label>
        <input type="text" name="add-ingredient" @keydown.tab.prevent="addIng" v-model="another">
      </div>
      <div class="button-field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Edit Recipe</button>
      </div>
    </form>
  </div>



</template>

<script>
import db from '@/firebase/init'
//套件可以直接說from 套件名稱，因為有setting
import slugify from 'slugify'
export default {
  name: "EditRecipe",
  data(){
    return{
      // 初始設定為空，但是跟輸入做v-model雙向綁定，這樣一但輸入內容就會同步到title
      recipe: null,
      another: null,
      feedback: null
    }
  },methods: {
    EditRecipe(){
      console.log(this.recipe.title, this.recipe.ingredients)
      // 用title檢查是否有新的recipe可以送出，這邊等同允許ingredients沒東西
      if(this.recipe.title && this.recipe.ingredients.length > 0){
        this.feedback = null
        this.recipe.slug = slugify(this.recipe.title, {
          //告知遇到space要用啥取代
          replacement: '-',
          //告知要清掉那些字元characters，不希望他們出現在slug中
          //  /.../g表示全局匹配，...為regular expression，只要符合[...]中的字元集合的任何一個就都找出來移除
          remove:  /[$*_+~.()’”!\-:@]/g,
          // 下面這個表示轉小寫
          lower: true
        })
        // doc()方法可以grab single doc抓取某筆資料
        db.collection('recipes').doc(this.recipe.id).update({
          title: this.recipe.title,
          ingredients: this.recipe.ingredients,
          slug: this.recipe.slug
        }).then(() => {
          this.$router.push({ name: 'Index'})
        }).catch(err => {
          console.log(err)
        })
      }else if(!this.recipe.title){
        this.feedback = 'You must enter a recipe title first'
      }else{
        this.feedback =  'You should enter at least one ingredient and then press "tab"'
      }
    },
    addIng(){
      if(this.another){
        this.recipe.ingredients.push(this.another)
        this.another = null
        this.feedback = null
      }else{
        this.feedback = "You must enter a value to add an ingredient"
      }
    },
    deleteIng(ing){
      this.recipe.ingredients = this.recipe.ingredients.filter(ingredient => {
        return ingredient != ing
      })
    }
  },
  // 讀入資料
  created(){
    // 尚未rendered to the DOM
    // let為local variable
    let ref = db.collection('recipes').where('slug', '==', this.$route.params.recipe_slug)
    ref.get().then(records=>{
      records.forEach(doc => {
        // firestore的data()與id是分開的
        this.recipe=doc.data()
        this.recipe.id = doc.id
        console.log(doc.data(), doc.id)
      })
    })
  }
}
</script>

<!-- scoped特性不建議使用，非原生的CSS效率差 -->
<style>
.edit-recipe{
  /* 離navbar太近，往下 */
  margin-top: 60px;
  /* 內距 */
  padding: 20px;
  /* 輸入寬度給他縮小，不然太長，透過form直接控制裡面所有input width */
  max-width: 500px;
}
.edit-recipe h2{
  /* 縮小字，不然他大到換行，em會依據父元素大小乘以倍數
     這種大小適合用於巢狀結構，一般網頁預設大小事16px(有些可能比較大譬如h)，這邊父元素可能是div對應的或許是一般的16px
   */
  font-size: 2em;
  /* 先上下、後左右，希望調節上下元素間距得用margin */
  margin: 20px auto;
}
.edit-recipe .input-field{
  /* 對materialize內容再作修正，調整上下間距 */
  margin: 20px auto;
}
.button-field{
  margin: 20px auto;
}
.edit-recipe .field{
  margin: 20px auto;
  position: relative;
}
.edit-recipe .delete{
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
