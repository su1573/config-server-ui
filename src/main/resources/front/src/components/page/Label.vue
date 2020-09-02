<<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <i class="fa fa-cog"></i> 项目及配置</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <i class="fa fa-tags"></i> Label</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-row>
            <el-col :span="6">
                <el-input placeholder="请输入内容" v-model="pager.paras.key" icon="search">
                    <div slot="append">
                        <el-button type="primary" icon="search" @click="  pager.pager.pageNumber = 1;doSearch()">GO</el-button>
                    </div>
                </el-input>
            </el-col>
            <el-col :span="6" :offset="12">
                <el-button type="primary" icon="plus" @click="addEditShow = true">Add</el-button>
            </el-col>
        </el-row>

        <el-table :data="pager.dataList" border style="width: 100%">
            <el-table-column prop="id" label="ID" sortable>
            </el-table-column>
            <el-table-column prop="name" label="Name">
            </el-table-column>
            <el-table-column prop="description" label="Description">
            </el-table-column>
            <el-table-column prop="weight" label="Weight">
            </el-table-column>
            <el-table-column label="Ops">
                <template scope="scope">
    <el-dropdown>
        <el-button type="primary">
            操作
            <i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
                <div @click="handleEdit(scope.$index,scope.row)">
                    <i class="fa fa-edit"></i> Edit</div>
            </el-dropdown-item>
            <el-dropdown-item v-show="!scope.row.installed">
                <div @click="handleDelete(scope.$index,scope.row)">
                    <i class="fa fa-trash-o"></i> Delete</div>
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-col :span="6" :offset="18">
                 <el-pagination style="float:right" layout="prev, pager, next" :total="pager.pager.recordCount" :page-size="pager.pager.pageSize" :current-page.sync="pager.pager.pageNumber" v-show="pager.pager.pageCount != 0" @current-change="changePage">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 弹框区域-->
        <el-dialog :title="label.id == 0 ? '添加Label' : '编辑Label' " :visible.sync="addEditShow" size="tiny">
            <el-form :model="label" :rules="checkLabel" ref="LabelForm">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="label.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="label.description" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="权重" :label-width="formLabelWidth" prop="weight">
                    <el-input-number v-model="label.weight"  :min="1" :max="1000"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addEditShow = false ; role = {id:0}">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdateLabel('LabelForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style>

</style>
<script>
export default {
    data() {
        return {
            pager: {
                dataList: [],
                pager: {
                    pageCount: 0,
                    pageNumber: 1,
                    pageSize: 15,
                    recordCount: 0
                },
                paras: {
                    key: ''
                }
            },
            label: {
                id: 0,
                name: '',
                weight: 1,
                description: '',
            },
            addEditShow: false,
            checkLabel: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]
            },
            formLabelWidth: '120px'
        };
    },
    methods: {
        saveOrUpdateLabel(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let url = this.label.id ? '/label/edit' : '/label/add'
                    this.postBody(url, this.label, result => {
                        this.changePage();
                        this.addEditShow = false;
                    })
                } else {
                    return false;
                }
            })
        },
        handleEdit(index, row) {
            let id = row.id;
            this.get('/label/' + id, result => {
                this.label = result.data.label;
                this.addEditShow = true;
            })
        },
        handleDelete(index, row) {
            let id = row.id;
            this.$confirm('确认删除Label?', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.get('/label/delete/' + id, result => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    window.setTimeout(() => {
                        this.changePage();
                    }, 2000)
                })
            }).catch(() => {
            });
        },
        changePage() {
            if (this.pager.paras.key) {
                this.doSearch();
            } else {
                this.loadData();
            }
        },
        doSearch() {
            this.get('/label/search?page=' + this.pager.pager.pageNumber + '&key=' + this.pager.paras.key, result => {
                this.pager = result.data.pager;
            })
        },
        loadData() {
            this.get('/label/list?page=' + this.pager.pager.pageNumber, result => {
                this.pager = result.data.pager;
                this.pager.paras = { key: '' }
            })
        }
    },
    created() {
        this.loadData();
    }
};
</script>
<style>
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>