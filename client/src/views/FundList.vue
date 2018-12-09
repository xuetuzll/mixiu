<template>
    <div class="fillcontain">
        <div>
            <el-form
                :inline="true"
                ref="search_data" 
                :model='search_data' >
                <el-form-item label="投标时间筛选:">
                    <el-date-picker
                        v-model="search_data.startTime"
                        type="datetime"
                        placeholder="选择开始时间">
                    </el-date-picker> --
                    <el-date-picker
                        v-model="search_data.endTime"
                        type="datetime"
                        placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="small" icon="search" @click='onScreeoutMoney()'>筛选</el-button>
                </el-form-item>
                 <el-form-item class="btnRight">
                    <el-button type="primary" size ="small" icon="view" @click='onAddMoney()'>添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                v-if="tableData.length > 0"
                :data='tableData'
                max-height="450"
                border
                :default-sort = "{prop: 'date', order: 'descending'}"
                style="width: 100%">
                 <el-table-column
                    type="index"
                    label="序号"
                    align='center'
                    width="70">
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="创建时间"
                    align='center'
                    width="250"
                    sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="收支类型"
                    align='center'
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="describe"
                    label="收支描述"
                    align='center'
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="income"
                    label="收入"
                    align='center'
                    width="170"> 
                    <template slot-scope="scope">  
                        <span style="color:#00d053">+ {{ scope.row.income }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="expend"
                    label="支出"
                    align='center'
                    width="170">
                    <template slot-scope="scope">  
                        <span style="color:#f56767">- {{ scope.row.expend }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cash"
                    label="账户现金"
                    align='center'
                    width="170">
                    <template slot-scope="scope">  
                        <span style="color:#4db3ff">{{ scope.row.cash }}</span>
                    </template>
                </el-table-column>
                 <el-table-column
                    prop="remark"
                    label="备注"
                    align='center'
                    width="220">
                </el-table-column>
                <el-table-column
                    prop="operation"
                    align='center'
                    label="操作"
                    fixed="right"
                    width="180">
                    <template slot-scope='scope'>
                        <el-button 
                            type="warning" 
                            icon='edit' 
                            size="small"
                            @click='onEditMoney(scope.row)'
                        >编辑</el-button>
                        <el-button 
                            type="danger" 
                            icon='delete' 
                            size="small"
                            @click='onDeleteMoney(scope.row,scope.$index)'
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
             <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                            v-if='paginations.total > 0'
                            :page-sizes="paginations.page_sizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total"
                            :current-page.sync='paginations.page_index'
                            @current-change='handleCurrentChange'
                            @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 弹框页面 -->
        <DialogFound :dialog='dialog' :form='form' @update="getProfile"></DialogFound>
    </div>
</template>

<script>
import DialogFound from "../components/DialogFound";

export default {
  name: "fundlist",
  data() {
    return {
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      form: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      search_data: {
        startTime: "",
        endTime: ""
      }
    };
  },
  components: {
    DialogFound
  },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      // 获取表格数据
      this.$axios("/api/profiles").then(res => {
        // this.tableData = res.data;
        this.allTableData = res.data;
        this.filterTableData = res.data;
        // 设置分页数据
        this.setPaginations();
      });
    },
    onEditMoney(row) {
      // 编辑
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      };
      this.form = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
    },
    onDeleteMoney(row, index) {
      // 删除
      this.$axios.delete(`/api/profiles/delete/${row._id}`).then(res => {
        this.$message("删除成功");
        this.getProfile();
      });
    },
    onAddMoney() {
      // 添加
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add"
      };
      this.form = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      };
    },
    handleCurrentChange(page) {
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
      // 总页数
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    onScreeoutMoney() {
      // 筛选
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "warning",
          message: "请选择时间区间"
        });
        this.getProfile();
        return;
      }
      const stime = this.search_data.startTime.getTime();
      const etime = this.search_data.endTime.getTime();
      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= stime && time <= etime;
      });
      // 分页数据
      this.setPaginations();
    }
  }
};

//这么一个页面要出来，数据工作：get所有数据，按时间搜索数据，每一个列表项
//操作按钮：删除，编辑,添加
//表单呈现使用el-tabel,每一项都写出来
//根据后台接口获取表格数据
//添加使用dialog对话框，select遍历每一项，props给父组件传递参数
//提交数据分两种：编辑或新增，通过ref拿到整个表单实例，最后结构赋值拿到对应的值
//渲染，发送事件触发更新（或者监听值的改变，更新数据）
//时间选择器，把数据banding到data里面，点筛选对数据判断，返回指定值
//设置分页：拿到总条数，设置当前页第一页，第一页显示几个，filter过滤
//current-change和size-change来处理页码变动。
//要注意当前页，根据显示页码来控制显示一个几个，当前页代表大于初始页数量的页码

</script>
<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>