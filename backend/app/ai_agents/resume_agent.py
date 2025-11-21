from typing import List
from typing_extensions import TypedDict
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
import os

from langgraph.graph import StateGraph
from app.utils.document_uploader import generate_loader, convert_docs_to_text


from dotenv import load_dotenv
from typing import List, Optional
from pydantic import BaseModel, Field
from app.services.resume_agent.test_parsing import generate_resume_docx

load_dotenv()
UPLOAD_DIRECTORY = "uploaded_file"

os.environ["GOOGLE_API_KEY"]=os.getenv("GOOGLE_API_KEY")
llm=ChatGoogleGenerativeAI(model='gemini-2.0-flash')



    
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
    def generate_resume_data(self, state: ResumeState):
        user_input = state['user_input']
        print("user input     \n",user_input)
        job_description = state['user_input']
        llm_with_structure = llm.with_structured_output(ResumeData)
        try:
            prompt = ChatPromptTemplate([
                ("system","You are an expert resume generator you will be provided the user detail and job description, your job is to generate high ats score resume data against the job description"),
                ("human","""
                    You are an expert resume writer and HR automation assistant specialized in creating ATS-optimized resumes.
                    Your goal is to analyze the user's professional details and the target job description to generate a structured resume data object suitable for automatic document generation.

                    Make sure the output is:
                    - **Highly relevant to the job description** (use matching keywords naturally)
                    - **Tailored for high ATS compatibility**
                    - **Written in concise, professional English**
                    - **Compliant with the exact output schema below**

                    ---

                    ### Job Description
                    <job_description>
                    {job_description}
                    </job_description>

                    ### User Professional Details
                    <user_detail>
                    {user_input}
                    </user_detail>

                    ---

                    ### Output Format
                    Generate a valid JSON object matching this schema exactly:

                    ---
                      "name": "Full name of the candidate" if available,
                      "title": "Professional title or role",
                      "summary": "Brief professional summary highlighting relevant strengths and alignment with the job role",
                      "contact": ["Email", "Phone", "LinkedIn URL (if provided)"],
                      "skills": ["List of key technical and soft skills relevant to the job"],
                      "experience": [
                        -
                          "title": "Job Title",
                          "company": "Company Name",
                          "duration": "Start - End Date or Years",
                          "description": "Detailed but concise summary of key achievements and responsibilities using action verbs"
                        -
                      ],
                      "education": [
                        -
                          "degree": "Degree Name",
                          "institution": "University or College Name",
                          "year": "Graduation Year"
                        -
                      ],
                      "projects": [
                        -
                          "name": "Project Name",
                          "description": "Brief summary focusing on impact, technologies used, and achievements"
                        -
                      ],
                      "certifications": ["Relevant certifications or awards"]
                    ---

                    ---

                    ### Guidelines
                    - Prioritize skills, tools, and experiences that **match or complement the job description**.
                    - Rephrase user details into a **professional tone** with **quantifiable achievements** where possible.
                    - If some fields are missing, leave them empty (`null` or `[]`), do **not hallucinate**.
                    - Maintain consistent formatting and indentation for valid JSON.
                    - Use **action verbs** and **measurable results** to improve ATS ranking.
                    - Avoid repetition, filler words, and personal pronouns like “I” or “my”.

                    Output **only** the final JSON structure — no explanation, no markdown, no additional text.
                """)
            ])

            chain = prompt | llm_with_structure

            resume_data = chain.invoke({
                "job_description": job_description,
                "user_input": user_input
            })
            
            return {"resume_data": resume_data}

        
        except Exception as e:
            raise ValueError(f"Failed to generate while generating resume data error: {e}")
    
    #This node is used for generating the resume docx
    def generate_docs(self, state: ResumeState):
        resume_data= state["resume_data"] or "N/A"
        style= state["style"]
        resume_data = resume_data.model_dump()
        print("resume data", resume_data)
        output_path = generate_resume_docx(data=resume_data, template=style)
        return {"output_path": output_path}
    

    def run_graph(self):
        initial_input: ResumeState = {}
        initial_input["job_description"] = self.job_description

        initial_input["style"] = self.style

        if self.user_input is not None:
            initial_input["user_input"] = self.user_input

        if self.file_path is not None:
            initial_input["file_path"] = self.file_path
        print("initial input ",initial_input)
        result = self.graph.invoke(initial_input)
        return result["output_path"]