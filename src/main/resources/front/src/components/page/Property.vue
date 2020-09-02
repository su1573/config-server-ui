<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <i class="fa fa-file-text"></i> 配置</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <i class="fa fa-file"></i> Property</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs type="border-card" v-model="profile" @tab-click="handleClick">
            <el-tab-pane v-for="(item, index) in profiles" :key="item.id + ''" :label="item.description" :name="item.id + ''">
                <el-row>
                    <el-col :span="6" :offset="8">
                        <el-select v-model="label" placeholder="请选择分支" @change="loadProperties">
                            <el-option v-for="item in labels" :key="item.id" :label="item.description" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10">
                        <div>
                            <el-button @click="addConfigShow = true" type="primary">添加配置</el-button>
                            <el-button type="primary" @click="importConfigShow = true">导入配置</el-button>
                            <el-button type="primary" @click="preview">预览配置</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-table :data="properties" stripe style="width: 100%">
                    <el-table-column prop="key" label="Key">
                    </el-table-column>
                    <el-table-column prop="value" label="Value">
                    </el-table-column>
                    <el-table-column prop="id" label="Ops">
                        <template scope="scope">
                            <el-dropdown>
                                <el-button type="primary">
                                    操作
                                    <i class="el-icon-caret-bottom el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>
                                        <div @click="handleEdit(scope.$index,scope.row)">
                                            <i class="fa fa-edit"></i> 编辑配置</div>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <div @click="deleteConfig(scope.$index,scope.row)">
                                            <i class="fa fa-trash-o"></i> 删除配置</div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    
        <el-dialog :title=" this.property.id == 0 ? '添加配置':'编辑配置'" :visible.sync="addConfigShow" size="tiny">
            <el-form :model="property" :rules="checkProperty" ref="propertyForm">
                <el-form-item label="Key" :label-width="formLabelWidth" prop="key" v-show="!property.key">
                    <el-input v-model="property.key" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Value" :label-width="formLabelWidth" prop="value">
                    <el-input v-model="property.value" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addConfigShow = false">取 消</el-button>
                <el-button type="primary" @click="addOrEditConfig">确 定</el-button>
            </div>
        </el-dialog>

         <el-dialog title="导入配置" :visible.sync="importConfigShow" size="tiny">
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importConfigShow = false">取 消</el-button>
            </div>
        </el-dialog>

         <el-dialog title="配置预览" :visible.sync="previewShow" size="full">
            <pre>
{{previewProperties}}
            </pre>
            <div slot="footer" class="dialog-footer">
                <el-button @click="previewShow = false">关 闭</el-button>
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
            profiles: [],
            labels: [],
            properties: [],
            previewProperties:"",
            previewShow:false,
            profile: 0,
            label: 0,
            addConfigShow: false,
            property: {},
            checkProperty: {
                key: [
                    { required: true, message: '请输入配置key', trigger: 'blur' }
                ],
                value: [
                    { required: true, message: '请输入配置值', trigger: 'blur' },
                ]
            },
            importConfigShow: false,
            formLabelWidth: '120px'
        }
    },
    computed: {
        uploadUrl: function () {
            return baseUrl + '/property/0/' + this.profile + '/' + this.label + '/import';
        }
    },
    watch: {
        profiles: function () {
            this.profile = this.profiles[0].id + '';
        },
        labels: function () {
            this.label = this.labels[0].id;
        },
        profile: function () {
            this.property.profileId = this.profile;
        },
        label: function () {
            this.property.labelId = this.label;
        }
    },
    methods: {
        preview() {
            this.get('/property/0/' + this.profile + '/' + this.label + '/preview', result => {
                this.previewProperties = result.data.properties;
                this.previewShow = true;
            })
        },
        handleAvatarSuccess(res, file) {
            this.importConfigShow = false;
            this.loadProperties();
        },
        beforeAvatarUpload(file) {
            const isConfigFile = /([^\s]+(?=\.(properties|yml|yaml))\.\2)/gi.test(file.name);
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isConfigFile) {
                this.$message.error('导入配置只支持properties文件和yml文件!');
            }
            if (!isLt2M) {
                this.$message.error('导入文件大小不能超过 2MB!');
            }
            return isConfigFile && isLt2M;
        },
        addOrEditConfig() {
            let url = this.property.id ? '/property/edit' : '/property/add'
            this.postBody(url, this.property, result => {
                this.property.key = null;
                this.property.value = null;
                this.addConfigShow = false;
                this.loadProperties();
            });
        },
        handleEdit(index, row) {
            this.property = row;
            this.addConfigShow = true;
        },
        deleteConfig(index, row) {
            this.$confirm('确认删除配置?', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.get('/property/delete/' + row.id, result => {
                    this.loadProperties();
                })
            }).catch(() => {
            });
        },
        handleClick(tab, event) {
            this.loadProperties();
        },
        loadProperties() {
            this.get('/property/0/' + this.profile + '/' + this.label, result => {
                this.properties = result.data.properties;
            })
        }
    },
    created() {
        this.get('/property/info/0', result => {
            this.profiles = result.data.profiles;
            this.labels = result.data.labels;
            var self = this;
            setTimeout(function () {
                self.loadProperties();
            }, 300);
        })
    }
}
</script>
<style>
.el-col {
    margin-bottom: 10px;
    word-wrap: break-word;
}
.avatar-uploader {
    margin: 0 auto;
}
</style>