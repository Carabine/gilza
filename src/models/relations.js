module.exports = async (models) => {
    const {
        User: UserModel,
        Project: ProjectModel,
        Container: ContainerModel,
        Form: FormModel,
        Request: RequestModel,
        Option: OptionModel,
        FormItem: FormItemModel,
        Video: VideoModel,
        Category: CategoryModel,
        ProjectCategory: ProjectCategoryModel,
        Estimate: EstimateModel
    } = models
    
    UserModel.hasMany(ProjectModel, {
        foreignKey: 'userId',
        as: 'projects'
    })
    
    UserModel.hasMany(RequestModel, {
        foreignKey: 'userId',
        as: 'requests'
    })
    
    ProjectModel.hasMany(ContainerModel, {
        foreignKey: 'projectId',
        as: 'containers'
    })
    
    ProjectModel.hasOne(ContainerModel, {
        foreignKey: 'projectId',
        as: 'container'
    })
    
    ContainerModel.hasMany(OptionModel, {
        foreignKey: 'containerId',
        as: 'options'
    })
    
    ContainerModel.hasOne(FormModel, {
        foreignKey: 'containerId',
        as: 'form'
    })
    
    FormModel.hasMany(FormItemModel, {
        foreignKey: 'formId',
        as: 'formItems'
    })

    ContainerModel.belongsTo(VideoModel, {
        foreignKey: 'videoId',
        as: 'video'
    })

    ProjectModel.belongsToMany(CategoryModel, {
        through: ProjectCategoryModel,
        foreignKey: 'projectId',
        as: 'categories'       
    })

    CategoryModel.belongsToMany(ProjectModel, {
        through: ProjectCategoryModel,
        foreignKey: 'categoryName',
        as: 'projects'     
    })

    ProjectModel.belongsTo(UserModel, {
        foreignKey: 'userId',
        as: 'user'
    })

    UserModel.belongsToMany(ProjectModel, {
        through: EstimateModel,
        foreignKey: 'userId',
        as: 'projectEstimates'
    })

    ProjectModel.belongsToMany(UserModel, {
        through: EstimateModel,
        foreignKey: 'projectId',
        as: 'userEstimates'
    })

    ProjectModel.hasMany(EstimateModel, {
        foreignKey: 'projectId',
        as: 'estimates'
    })
}