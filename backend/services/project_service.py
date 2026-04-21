from models.project import Project
from beanie import PydanticObjectId

async def create_project_service(
    title: str,
    description: str,
    rfp_data: dict,
    user_id: PydanticObjectId
):
    try:
        project = Project(
            title=title,
            description=description,
            rfp_data=rfp_data,
            user_id= user_id
        )
        await project.insert()
        return project
    except Exception as e:
        raise Exception(f"Failed to create project: {str(e)}")


async def get_project_service(
    project_id: PydanticObjectId
):
    try:
        project = await Project.get(project_id)
        return project
    except Exception as e:
        raise Exception(f"Failed to get project: {str(e)}")


async def get_all_projects_service(
    user_id: PydanticObjectId
):
    try:
        projects = await Project.find(Project.user_id == user_id).to_list(length=100)
        return projects
    except Exception as e:
        raise Exception(f"Failed to get all projects: {str(e)}")


