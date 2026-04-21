from agents.grant_agent.states.grant_state import GrantState


import copy

def end_node(state: GrantState) -> dict:
    extracted_content = {}
    sections = state.get("sections", {})
    
    for section_name, section_data in sections.items():
        # Make a deep copy to preserve the original state and avoid mutating it unintentionally
        clean_section = copy.deepcopy(section_data)
        
        # Remove the specified keys from the context in the final output
        if "context" in clean_section:
            clean_section["context"].pop("description", None)
            clean_section["context"].pop("org_data_required", None)
            clean_section["context"].pop("predefined_name", None)
            
        extracted_content[section_name] = clean_section
        
    return {"final_output": extracted_content}