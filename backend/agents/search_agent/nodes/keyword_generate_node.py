from agents.search_agent.llms.groq_llm import groq_llm
from agents.search_agent.prompts.keyword_search_prompt import keyword_prompt
from agents.search_agent.states.search_state import SearchState
from langchain_core.prompts import PromptTemplate

async def keyword_generate_node(state: SearchState):
    user_input = state['user_input']
    description = user_input['description']
    domain = user_input['domain']
    target_benef = user_input['target_benef']
    prompt_template = PromptTemplate.from_template(keyword_prompt)
    prompt = prompt_template.format(
        description=description,
        domain=domain,
        target_benef=target_benef
    )
    llm = groq_llm()
    response = await llm.ainvoke(prompt)
    keyword = response.content.strip().replace(' "\'\n', '')
    return {"keyword": keyword}