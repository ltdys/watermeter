<template>
  <div
    class="my-page"
    :class="[position == 'left' ? 'my-page-left' : '', position == 'center' ? 'my-page-center' : '', position == 'right' ? 'my-page-right' : '']"
  >
    <el-pagination
      class="my-pagination"
      background
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    allTotal: {
      type: Number,
      default: function () {
        return 10
      }
    },
    currentPage: {
      type: Number,
      default: function () {
        return 1
      }
    },
    pageSizes: {
      type: Array,
      default: function () {
        return [10, 20, 50, 100, 500]
      }
    },
    pageSize: {
      type: Number,
      default: function () {
        return 20
      }
    },
    position: {
      type: String,
      default: () => { return 'right' }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('pageChange', val)
    },
    handleCurrentChange (val) {
      this.$emit('currentChange', val)
    }
  }

}
</script>

<style lang="scss">
  .my-page{
    width: 100%;
    // margin: 20px auto;
    height: 52px;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .my-page-left{
    justify-content: flex-start;
  }
  .my-page-center{
    justify-content: center;
  }
  .my-page-right{
    justify-content: flex-end;
  }
</style>
