from agents.grant_agent.states.grant_state import GrantState


def section_router(state: GrantState):
    if state.get('default_section'):
        return 'orgdata_fetch'
    else:
        return 'section_normalize'