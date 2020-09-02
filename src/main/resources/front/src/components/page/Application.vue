<<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <i class="fa fa-cog"></i> 项目及配置</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <i class="fa fa-paper-plane-o"></i> Application</el-breadcrumb-item>
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
                <el-button type="primary" icon="plus" @click="handleAdd">Add</el-button>
            </el-col>
        </el-row>

        <el-table :data="pager.dataList" border style="width: 100%">
            <el-table-column prop="id" label="ID" sortable>
            </el-table-column>
            <el-table-column prop="name" label="Name">
            </el-table-column>
            <el-table-column prop="description" label="Description">
            </el-table-column>
            <el-table-column label="Ops">
                <template scope="scope">
                    <div>
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
                        <el-button type="primary" @click="toConfig(scope.$index,scope.row)">
                            配置
                            <i class="fa fa-cog"></i>
                        </el-button>
                    </div>
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
        <el-dialog :title="application.id == 0 ? '添加Application' : '编辑Application' " :visible.sync="addEditShow" size="tiny">
            <el-form :model="application" :rules="checkApplication" ref="ApplicationForm">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="application.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input type="textarea" :maxlength="100" v-model="application.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目经理" :label-width="formLabelWidth">
                    <el-select filterable v-model="application.ownerId" placeholder="请选择项目经理">
                        <el-option 
                        v-for="manager in managers"
                        :key="manager.id"
                        :label="manager.name"
                        :value="manager.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addEditShow = false ; role = {id:0}">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdateApplication('ApplicationForm')">确 定</el-button>
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
            application: {
                id: 0,
                name: '',
                ownerId: null,
                description: '',
            },
            managers: [],
            addEditShow: false,
            checkApplication: {
                name: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入项目描述', trigger: 'blur' }
                ]
            },
            formLabelWidth: '120px'
        };
    },
    methods: {
        toConfig(index,row){
            this.$router.push(
                { name: 'application', params: { applicationId: row.id }}
            );
        },
        saveOrUpdateApplication(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let url = this.application.id ? '/application/edit' : '/application/add'
                    this.postBody(url, this.application, result => {
                        this.changePage();
                        this.addEditShow = false;
                    })
                } else {
                    return false;
                }
            })
        },
        handleAdd() {
            this.addEditShow = true;
            this.get('/application/' + this.application.id + '/manager', result => {
                this.managers = result.data.infos
            })
        },
        handleEdit(index, row) {
            let id = row.id;
            this.get('/application/' + id, result => {
                this.application = result.data.application;
                this.addEditShow = true;
            });
            this.get('/application/' + id + '/manager', result => {
                this.managers = result.data.infos
            })
        },
        handleDelete(index, row) {
            let id = row.id;
            this.$confirm('确认删除Applicaiton?', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.get('/application/delete/' + id, result => {
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
            this.get('/application/search?page=' + this.pager.pager.pageNumber + '&key=' + this.pager.paras.key, result => {
                this.pager = result.data.pager;
            })
        },
        loadData() {
            this.get('/application/list?page=' + this.pager.pager.pageNumber, result => {
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

.el-select {
    width: 100%
}
</style>