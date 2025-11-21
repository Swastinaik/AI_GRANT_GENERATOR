from typing import List, Dict, Any, Annotated
from typing_extensions import TypedDict
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langgraph.graph import StateGraph, START, END
import os
import asyncio
import operator
from dotenv import load_dotenv
load_dotenv()

def merge_dicts(d1, d2):
    result = d1.copy()
    result.update(d2)
    return result

def rearrange_dict(obj, key_order):
    return {key: obj[key] for key in key_order if key in obj}
#state
class GraphState(TypedDict):
    user_input: Dict[str, Any]
    organizations_detail: Dict[str, Any]
    grants: Annotated[Dict[str, Any], merge_dicts]
    new_section_name: str

class additional_section_parser(TypedDict):
    title: str
    content: str
#llm definition
os.environ["GOOGLE_API_KEY"]=os.getenv("GOOGLE_API_KEY")
llm=ChatGoogleGenerativeAI(model='gemini-2.0-flash')

#base_prompt = BASE_PROMPT = 

#Nodes
class GrantGeneration:
    """This class contains all the nodes for grant generation workflow."""
    def __init__(self, user_input, organizations_detail):
        self.user_input: Dict[str, Any] = user_input
        self.organizations_detail: Dict[str, Any] = organizations_detail
        self.language = user_input['language']
        self.base_prompt= f"""
            You are a professional grant writer.
            You are writing a grant proposal for a non-profit organization.
            always add the "\n" at the end of the sentence.
            if there is a line break needed add "\n" at the end of the sentence.
            Always generate this whole section in this language: {self.language} mandatory
        """
        self.grants: Dict[str, Any]= {}
        self.app = None
        self.workflow=StateGraph(GraphState)
        self.workflow.add_node('cover_letter',self.cover_letter)
        self.workflow.add_node('executive_summary',self.executive_summary)
        self.workflow.add_node('statement_of_need',self.statement_of_need)
        self.workflow.add_node('project_description',self.project_description)
        self.workflow.add_node('organization_background',self.organization_background)
        self.workflow.add_node('evaluation_plan',self.evaluation_plan)
        self.workflow.add_node('budget_section',self.budget_section)
        self.workflow.add_node('sustainibility_plan',self.sustainibility_plan)
        self.workflow.add_node('aggregate',self.aggregate_sections_node)
        self.workflow.add_node('additional_section', self.additional_section)
        self.workflow.add_node('sender_and_reciever',self.sender_and_reciever)
        self.entry_points = [
                                "cover_letter", "executive_summary", "statement_of_need",
                                "project_description", "organization_background", "evaluation_plan",
                                "budget_section", "sustainibility_plan", "additional_section","sender_and_reciever"
                            ]
        self.add_entry_points_to_workflow()
        self.add_node_to_aggregate()
        self.compile()

           

    async def cover_letter(self, state: GraphState):
        user_input=state['user_input']
        print("Base prompt", self.base_prompt)
        organizations_detail=state['organizations_detail']
        project_title=user_input['project_title']
        
        statement_of_need=user_input['statement_of_need']
        budget=user_input['budget']
        profile_summary=organizations_detail['profile_summary']
        mission_vision=organizations_detail['mission_vision']
        section='Cover Letter'
        funders_detail = user_input.get('funders_details', 'N/A')
        try:
            prompt=ChatPromptTemplate([
                ("system","You are an expert grant writer in english with exceptional grammar fluency your job is to generate {section} section of the grant there are necessary details provided for generation of this section {section}"),
                ("human","""
                        Please generate the cover letter using the following details:
                        {base_prompt}
                        <Funder_Details>
                        Address the letter to: {funders_detail}
                        </Funder_Details>


                        <Organization_Details>
                        Our Organization's Profile: {profile_summary}
                        Our Mission and Vision: {mission_vision}
                        </Organization_Details>

                        <Project_Details>
                        Project Title: {project_title}
                        The Core Need We Address: {statement_of_need}
                        Funding Request: {budget}
                        </Project_Details>
                         """)
            ])
            output_parser=StrOutputParser()
            chain = prompt|llm|output_parser
            cover_letter_output= await chain.ainvoke({'project_title': project_title,'base_prompt':self.base_prompt, 'statement_of_need': statement_of_need, 'budget': budget, 'profile_summary':profile_summary,'mission_vision':mission_vision,'section': section,'funders_detail': funders_detail})
            updated_grants = state.get('grants',{}).copy()
            updated_grants[section]=cover_letter_output
            updated_grants['Project Title'] = project_title
            return {'grants': updated_grants}
        except Exception as e:
            raise ValueError('Failed to generate for {section} : {e}')

    async def executive_summary(self,state: GraphState):
        section = 'Executive Summary'

        try:
            user_input = state['user_input']
            organizations_detail = state['organizations_detail']

            # Extract required data with safe .get() calls
            project_title = user_input.get('project_title', 'N/A')
            statement_of_need = user_input.get('statement_of_need', 'N/A')
            project_description = user_input.get('project_description', 'N/A')
            target_audience = user_input.get('target_audince', 'N/A')
            budget = user_input.get('budget','N/A')
            evaluation_method = user_input.get('evaluation_method', 'N/A')
            achievements = organizations_detail.get('achievements', 'N/A')
            mission_vision = organizations_detail.get('mission_vision', 'N/A')
            prompt = ChatPromptTemplate([
                ("system", "You are an expert grant writer. Your job is to generate a compelling and concise executive summary for a grant proposal. This is the most critical section, so it must capture the essence of the project."),
                ("human", """
                    {base_prompt}
                 Please generate the executive summary using the following details:
                 <Problem_and_Solution>
                 Project Title: {project_title}
                 The core problem we are solving: {statement_of_need}

                 Our proposed solution: {project_description}
                 </Problem_and_Solution>
                 <Organization_Credibility>
                 Our mission that drives this work: {mission_vision}
                 Our track record of success: {achievements}

                 </Organization_Credibility>

                 <Project_Impact>
                 Who we will serve: {target_audience}
                 How we will measure success: {evaluation_method}
                 The total funding required: {budget}
                 </Project_Impact>
                 """)
            ])
            output_parser=StrOutputParser()
            chain = prompt | llm | output_parser
            output = await chain.ainvoke({
                'project_title': project_title, 
                'statement_of_need': statement_of_need, 
                'project_description': project_description,
                'target_audience': target_audience,
                'budget': budget,
                'evaluation_method': evaluation_method,
                'achievements': achievements,
                'mission_vision': mission_vision,
                'base_prompt':self.base_prompt
            })

            updated_grants = state.get('grants', {}).copy()
            updated_grants[section] = output
            return {'grants': updated_grants}

        except Exception as e:
            raise ValueError(f"Failed to generate for {section}: {e}")


    async def statement_of_need(self,state: GraphState):
        section = 'Statement Of Need'
        

        try:
            user_input = state['user_input']
            organizations_detail = state['organizations_detail']
            statement_of_need = user_input.get('statement_of_need', 'N/A')
            target_audience = user_input.get('target_audince', 'N/A')
            challenges = user_input.get('challenges', 'N/A')

            history = organizations_detail.get('history', 'N/A')
            prompt = ChatPromptTemplate([
                ("system", "You are an expert grant writer. Your task is to write a powerful 'Statement of Need' section. Use data and storytelling to make a compelling case for why this project is urgently needed."),
                ("human", """
                    {base_prompt}
                 Please write the Statement of Need using these details:
                 <Core_Problem>
                 Start with this core statement: {statement_of_need}
                 </Core_Problem>


                 <Affected_Community>
                 Describe the community being impacted: {target_audience}
                 </Affected_Community>

                 <Evidence>
                 Use these specific challenges and data points as evidence: {challenges}
                 </Evidence>

                 <Organizational_Context>
                 Weave in our organization's historical connection to this issue: {history}
                 </Organizational_Context>
                 """)
            ])
            output_parser=StrOutputParser()
            chain = prompt | llm | output_parser
            output = await chain.ainvoke({
                'statement_of_need': statement_of_need,
                'target_audience': target_audience,
                'challenges': challenges,
                'history': history,
                'base_prompt':self.base_prompt
            })
            updated_grants = state.get('grants', {}).copy()
            updated_grants[section] = output
            return {'grants': updated_grants}

        except Exception as e:
            raise ValueError(f"Failed to generate for {section}: {e}")



    async def project_description(self, state: GraphState):
        section = 'Project Description'

        try:
            user_input = state['user_input']
            organizations_detail = state['organizations_detail']
            project_description = user_input.get('project_description', 'N/A')
            target_audience = user_input.get('target_audience', 'N/A')
            challenges = user_input.get('challenges', 'N/A')

            mission_vision = organizations_detail.get('mission_vision', 'N/A')
            achievements = organizations_detail.get('achievements', 'N/A')
            prompt = ChatPromptTemplate([
                ("system", "You are an expert grant writer. Your job is to create a detailed 'Project Description'. Clearly outline the goals, objectives, activities, and timeline. It should be a clear blueprint for execution."),
                ("human", """

                 Please write the Project Description using these details:
                 {base_prompt}
                 <Core_Project_Plan>
                 Base the description on this input: {project_description}
                 </Core_Project_Plan>

                 <Participants>
                 Specify that the activities are for: {target_audience}
                 </Participants>

                 <Risk_Mitigation>
                 Acknowledge and address these potential challenges: {challenges}
                 </Risk_Mitigation>

                 <Alignment_and_Credibility>
                 Connect the project's goals back to our overall mission: {mission_vision}
                 Mention our past achievements as proof we can succeed: {achievements}

                 </Alignment_and_Credibility>
                 """)
            ])
            output_parser=StrOutputParser()
            chain = prompt | llm | output_parser
            output = await chain.ainvoke({
                'project_description': project_description,
                'target_audience': target_audience,
                'challenges': challenges,
                'mission_vision': mission_vision,
                'achievements': achievements,
                'base_prompt':self.base_prompt
            })
            updated_grants = state.get('grants', {}).copy()
            updated_grants[section] = output
            return {'grants': updated_grants}

        except Exception as e:
            raise ValueError(f"Failed to generate for {section}: {e}")



    async def organization_background(self,state: GraphState):
        section = 'Organization Background'
        

        try:
            organizations_detail = state['organizations_detail']
            history = organizations_detail.get('history', 'N/A')
            mission_vision = organizations_detail.get('mission_vision', 'N/A')
            achievements = organizations_detail.get('achievements', 'N/A')

            overall_summary = organizations_detail.get('overall_summary', 'N/A')
            prompt = ChatPromptTemplate([
                ("system", "You are an expert grant writer. Your task is to write the 'Organization Background' section. Create a compelling narrative that builds trust and showcases the organization's history, mission, and major accomplishments."),
                ("human", """

                 Please write the Organization Background using these details:
                 {base_prompt}
                 <Our_Story>
                 Tell our history: {history}
                 </Our_Story>


                 <Our_Purpose>
                 State our core mission and vision: {mission_vision}
                 </Our_Purpose>

                 <Our_Impact>
                 Highlight our key achievements: {achievements}
                 </Our_Impact>

                 <Summary>
                 Use this overall summary to tie everything together: {overall_summary}
                 </Summary>
                 """)
            ])
            output_parser=StrOutputParser()
            chain = prompt | llm | output_parser
            output = await chain.ainvoke({
                'history': history,
                'mission_vision': mission_vision,
                'achievements': achievements,
                'overall_summary': overall_summary,
                'base_prompt':self.base_prompt
            })

            updated_grants = state.get('grants', {}).copy()
            updated_grants[section] = output
            return {'grants': updated_grants}

        except Exception as e:
            raise ValueError(f"Failed to generate for {section}: {e}")

    async def evaluation_plan(self,state: GraphState):
        section = 'Evaluation Plan'
        
        try:
            user_input = state['user_input']

            evaluation_method = user_input.get('evaluation_method', 'N/A')
            project_goals = user_input.get('goals_and_objectives', 'N/A') # Reusing description for goals
            target_audience = user_input.get('target_audince', 'N/A')

            prompt = ChatPromptTemplate([
                ("system", "You are an expert grant writer specializing in monitoring and evaluation. Create a clear and logical 'Evaluation Plan'. Define how success will be measured with specific metrics linked to project goals."),
                ("human", """
                 Please write the Evaluation Plan using these details. Create SMART (Specific, Measurable, Achievable, Relevant, Time-bound) objectives where possible.
                    {base_prompt}
                 <Measurement_Framework>
                 Our proposed methods for evaluation are: {evaluation_method}
                 </Measurement_Framework>

                 <Project_Goals_to_Measure>
                 The plan should measure the success of these goals: {project_goals}
                 </Project_Goals_to_Measure>

                 <Target_Group_for_Data>
                 The data will be collected from this group: {target_audience}
                 </Target_Group_for_Data>
                 """)
            ])
            output_parser=StrOutputParser()
            chain = prompt | llm | output_parser
            output = await chain.ainvoke({
                'evaluation_method': evaluation_method,
                'project_goals': project_goals,
                'target_audience': target_audience,
                'base_prompt':self.base_prompt
            })

            updated_grants = state.get('grants', {}).copy()
            updated_grants[section] = output
            return {'grants': updated_grants}

        except Exception as e:
            raise ValueError(f"Failed to generate for {section}: {e}")


    async def budget_section(self,state: GraphState):
        section = 'Budget Section'
        
        try:
            user_input = state['user_input']

            budget = user_input.get('budget', 'N/A')
            project_description = user_input.get('project_description', 'N/A')

            # Pre-process budget for clarity

            prompt = ChatPromptTemplate([
                ("system", "You are an expert grant writer with strong financial acumen. Your task is to write a 'Budget Narrative'. First, present the budget clearly. Second, justify each major expense by linking it directly to an activity in the project description."),
                ("human", """
                 Please write the Budget Section narrative using these details:
                    {base_prompt}
                 <Budget_Data>
                 {budget}
                 </Budget_Data>

                 <Justification_Context>
                 Explain why these budget items are necessary to achieve the goals outlined in the project plan: {project_description}
                 </Justification_Context>
                 """)
            ])
            output_parser=StrOutputParser()
            chain = prompt | llm | output_parser
            output = await chain.ainvoke({
                'budget': budget,
                'project_description': project_description,
                'base_prompt':self.base_prompt
            })

            updated_grants = state.get('grants', {}).copy()
            updated_grants[section] = output
            return {'grants': updated_grants}

        except Exception as e:
            raise ValueError(f"Failed to generate for {section}: {e}")


    async def sustainibility_plan(self,state: GraphState):
        section = 'Sustainibility Plan'
        
        try:
            user_input = state.get('user_input', {})
            #print("user input ",user_input)
            organizations_detail = state['organizations_detail']

            sustainibility_plan = user_input.get('sustainibility_plan', 'N/A')
            project_description = user_input.get('project_description', 'N/A')
            history = organizations_detail.get('history', 'N/A')
            achievements = organizations_detail.get('achievements', 'N/A')

            prompt = ChatPromptTemplate([
                ("system", "You are an expert grant writer focused on long-term strategic planning. Your task is to write a credible 'Sustainability Plan'. Outline clear strategies for how the project's impact will continue after the grant period."),
                ("human", """
                 Please write the Sustainability Plan using these details:
                    {base_prompt}
                 <Future_Strategies>
                 Our ideas for long-term sustainability are: {sustainibility_plan}
                 </Future_Strategies>

                 <Project_Components_to_Sustain>
                 Focus on continuing the impact of these project elements: {project_description}
                 </Project_Components_to_Sustain>

                 <Organizational_Stability>
                 Use our history and achievements to prove we are a stable, long-term organization capable of managing this: History - {history}; Achievements - {achievements}
                 </Organizational_Stability>
                 """)
            ])
            output_parser=StrOutputParser()
            chain = prompt | llm | output_parser
            output = await chain.ainvoke({
                'sustainibility_plan': sustainibility_plan,
                'project_description': project_description,
                'history': history,
                'achievements': achievements,
                'base_prompt':self.base_prompt
            })

            updated_grants = state.get('grants', {}).copy()
            updated_grants[section] = output
            return {'grants': updated_grants}

        except Exception as e:
            raise ValueError(f"Failed to generate for {section}: {e}")

    async def additional_section(self,state: GraphState):
        """This node will generate additional secton and content dynamically"""
        user_input= state['user_input']

        description=user_input.get('project_description',"No description available")
        additional_section = user_input.get('additional_section','no addtional available')
        prompt=ChatPromptTemplate([
            ("system","You are an expert grant writer. you will be provided some text of grant input your job is to elaborate that content using the description of the project and  generate a title which suits the text"),
            ("human","this is the text for the grant <text> {additional_section} </text> and description about this project <description> {description} </description> and only respond with JSON format with two values title and content")
        ])
        additional_section_output_parser = JsonOutputParser(pydantic_object=additional_section_parser)
        chain = prompt | llm | additional_section_output_parser
        try:
            additional_section_output = await chain.ainvoke({'additional_section': additional_section,"description":description})
            print(additional_section_output)
            section_name = additional_section_output.get('title', 'additional_section')
            content = additional_section_output.get('content', 'No content provided.')

            updated_grants = {}
            updated_grants[section_name] = content
            return {'grants': updated_grants,'new_section_name':section_name}
        except Exception as e:
            raise ValueError(f"Failed to generate additional section: {e}")
    
    
    async def sender_and_reciever(self,state: GraphState):
        user_input = state.get('user_input',{})
        organizations_detail = state.get('organizations_detail',{})
        profile_summary = organizations_detail.get('profile_summary',{})
        funders_detail = user_input.get('funders_detail',{})
        output_parser = StrOutputParser()
        senders_name = None
        funders_name = None
        try:
            prompt = ChatPromptTemplate([
                ("system","You are expert in understanding and extracting organizations name from provided text as profile summary you just need to output the name of the organizations."),
                ("human","This is the <profile summary> {profile_summary} </profile_summary> extract only name give it as output.")
            ])
            chain = prompt | llm | output_parser
            senders_name_from_chain = await chain.ainvoke({'profile_summary':profile_summary})
            senders_name = senders_name_from_chain
        except Exception as e:
            raise f"Error while generating the senders name"
        try:
            prompt = ChatPromptTemplate([
                ("system","You are expert in understanding and extracting organizations name from provided text as funders detail you just need to output the name of the funder."),
                ("human","This is the <funders_detail> {funders_detail} </funders_detail> extract only name give it as output.")
            ])
            chain = prompt | llm | output_parser
            funders_name_from_chain = await chain.ainvoke({'funders_detail':funders_detail})
            funders_name = funders_name_from_chain
            grants = state.get("grants",{}).copy()
            grants['Funders Name'] = funders_name
        except Exception as e:
            raise f"Error while generating the senders name"
        grants = state.get("grants",{}).copy()
        grants['Funders Name'] = funders_name
        grants['Senders Name'] = senders_name

        return {'grants': grants}


    def aggregate_sections_node(self,state: GraphState):
        """The aggregation node remains the same."""
        print("Aggregating all sections into final document...")
        
        grant_sections = state["grants"]
        new_section = state['new_section_name']
        sequence = [
            "Cover Letter", "Executive Summary", "Statement Of Need",
            "Project Description", "Organization Background", "Evaluation Plan",
            "Budget Section", "Sustainibility Plan",new_section,"Funders Name","Senders Name","Project Title"
        ]
        new_grant = rearrange_dict(grant_sections, sequence)
        
        """
        full_document = "\n\n---\n\n".join(
            f"## {section.replace('_', ' ').title()}\n\n{grant_sections.get(section, 'Content not available.')}"
        for section in sequence
        )
        print("Full Document Generated:\n", full_document)
        grant_sections["full_grant_document"] = full_document
        """
        grant_sections['full_grant_document'] = new_grant
        return {"grants": grant_sections}

    def add_entry_points_to_workflow(self):
        """This function adds entry points to the workflow"""
        for node in self.entry_points:
            self.workflow.add_edge(START, node)
    
    def add_node_to_aggregate(self):
        """This function adds entry points to the workflow."""
        for node in self.entry_points:
            self.workflow.add_edge(node, 'aggregate')
        self.workflow.add_edge('aggregate',END)
    
    def compile(self):
        self.app = self.workflow.compile()


    async def run_graph(self):
        initial_input: GraphState = {}
        user_input = self.user_input.copy()
        organizations_detail = self.organizations_detail.copy()
        initial_input['user_input'] = user_input
        initial_input['organizations_detail'] = organizations_detail
        initial_input['grants'] = {}
        #print("Initial Input State:", initial_input)
        final_state = await self.app.ainvoke(initial_input)
        return final_state['grants']['full_grant_document']
    











""""
async def run_graph():
    final_state = await app.ainvoke(initial_state)
    print("\n\n================ FINAL GRANT DOCUMENT ================\n")
    print(final_state['grants']['full_grant_document'])


if __name__ == "__main__":
    asyncio.run(run_graph())
    print("\n\n================ GRANT GENERATION COMPLETED ================\n")


user_input={
        "project_title": "Urban Youth Digital Literacy Program",
        "project_description": "A 12-week program to teach coding and design skills.",
        "funders_details": "The Tech for Good Foundation",
        "statement_of_need": "A significant digital skills gap exists among local youth.",
        "budget": "total =  75000, items= [Laptops, Instructor Fees",
        "target_audince": "Under-served youth aged 14-18.",
        "challenges": "Lack of access to hardware and stable internet.",
        "evaluation_plan": "Pre/post-program skill assessments and project portfolios.",
        "sustainibility_plan": "Develop a train-the-trainer model and seek corporate sponsorship.",
        "additional_section": "We will also include a mentorship component to support students post-program.",
    }
organizations_detail= {
        "overall_summary": "A non-profit dedicated to youth empowerment through technology.",
        "profile_summary": "We provide tech education to bridge the opportunity gap.",
        "history": "Founded in 2015, we have served over 500 students.",
        "achievements": "95% of our graduates enter higher education or find employment.",
        "mission_vision": "To create a world where every young person has the tools to succeed."
    }

grant = GrantGeneration(user_input, organizations_detail)

result = asyncio.run(grant.run_graph())

print('------------------ output------------------')
#print(result)

"""