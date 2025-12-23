from typing import List
from typing_extensions import TypedDict
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from langchain_groq import ChatGroq
from langchain_core.output_parsers import PydanticOutputParser
from langgraph.graph import StateGraph
from app.utils.document_uploader import generate_loader, convert_docs_to_text


from dotenv import load_dotenv
from typing import List, Optional
from pydantic import BaseModel, Field
from app.services.resume_agent.test_parsing import generate_resume_docx

load_dotenv()
UPLOAD_DIRECTORY = "uploaded_file"

os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model="openai/gpt-oss-20b"
)



    
#All the necessary states are defined here

#State for experience section
class Experience(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None

#State for education section
class Education(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None

#State for project section
class Project(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

#State for resume section
class ResumeData(BaseModel):
    name: Optional[str] = Field(None, description="Full name of the candidate")
    title: Optional[str] = Field(None, description="Professional title or role")
    summary: Optional[str] = Field(None, description="Brief professional summary or objective")
    contact: Optional[List[str]] = Field(default_factory=list, description="List of contact details")
    skills: Optional[List[str]] = Field(default_factory=list, description="List of professional skills")
    experience: Optional[List[Experience]] = Field(default_factory=list)
    education: Optional[List[Education]] = Field(default_factory=list)
    projects: Optional[List[Project]] = Field(default_factory=list)
    certifications: Optional[List[str]] = Field(default_factory=list)

#Main state to be passed to ai agent
class ResumeState(TypedDict):
    file_path: str
    job_description: str
    user_input: str
    resume_data:ResumeData
    style: str
    output_path: str



class ResumeAgent:
    def __init__(self, job_description, file_path = None, user_input = None, style = "classic"):
        self.job_description = job_description
        self.file_path = file_path
        self.style = style
        self.user_input = user_input
        self.workflow = StateGraph(ResumeState)
        self.workflow.add_node("start_node", self.start_node)
        self.workflow.add_node("file_parser", self.file_parser)
        self.workflow.add_node("generate_resume_data", self.generate_resume_data)
        self.workflow.add_node("generate_docs", self.generate_docs)
        self.workflow.add_conditional_edges(
            "start_node",
            self.check_parsing,
            {
                "parse": "file_parser",
                "no_parse":"generate_resume_data"
            }
        )
        self.workflow.add_edge("file_parser", "generate_resume_data")
        self.workflow.add_edge("generate_resume_data", "generate_docs")
        self.workflow.set_entry_point("start_node")
        self.workflow.set_finish_point("generate_docs")
        self.graph = self.workflow.compile()



    def start_node(self, state: ResumeState):
        print("state \n",state)
        return state
    
    #Checks if the parsing is needed to extract the content from previous resume file
    def check_parsing(self, state: ResumeState):
        file_path = state.get("file_path")
        print("file path", file_path)
        if file_path is not None:
            return "parse"    
        else:
            return "no_parse"


    #Actual node which will extract the resume data
    def file_parser(self, state: ResumeState):
        file_path = state['file_path']
        loader = generate_loader(file_path)
        user_detail = convert_docs_to_text(loader)
        
        return {"user_input": user_detail}
    

    #This node will generate the resume data from jd and user_input
    async def generate_resume_data(self, state: ResumeState):
        user_input = state.get('user_input', "")
        job_description = state.get('job_description', "")
        
        print("Processing Resume Data Generation...")
        parser  = PydanticOutputParser(pydantic_object=ResumeData)
        # Specify method="json_mode" or "function_calling" for better reliability with Groq/Specialized models
        llm_with_structure = llm.with_structured_output(ResumeData)
        
        try:
            prompt = ChatPromptTemplate([
                ("system", "You are an expert resume generator. Your job is to generate a high-ATS score resume data object tailored to the job description provided."),
                ("human", """
                    Analyze the user's professional details and the target job description to generate a structured resume.

                    ### Job Description
                    {job_description}

                    ### User Professional Details
                    {user_input}

                    ### Guidelines
                    - Prioritize keywords and experiences that match the job description naturally.
                    - Use professional action verbs and quantifiable achievements.
                    - If data for a field is missing, leave it as null or an empty list; do not hallucinate.
                    - Maintain a professional tone and avoid personal pronouns.
                """)
            ])

            chain = prompt | llm | parser
            
            resume_data = await chain.ainvoke({
                "job_description": job_description,
                "user_input": user_input
            })
            
            return {"resume_data": resume_data}

        except Exception as e:
            raise ValueError(f"Failed to generate resume data: {e}")
    
    #This node is used for generating the resume docx
    def generate_docs(self, state: ResumeState):
        resume_data= state["resume_data"] or "N/A"
        style= state["style"]
        resume_data = resume_data.model_dump()
        print("resume data", resume_data)
        output_path = generate_resume_docx(data=resume_data, template=style)
        return {"output_path": output_path}
    

    async def run_graph(self):
        initial_input: ResumeState = {}
        initial_input["job_description"] = self.job_description

        initial_input["style"] = self.style

        if self.user_input is not None:
            initial_input["user_input"] = self.user_input

        if self.file_path is not None:
            initial_input["file_path"] = self.file_path
        print("initial input ",initial_input)
        result = await self.graph.ainvoke(initial_input)
        return result["output_path"]