"""
test_rfp_parser.py — Unit tests for services/rfp_parser.py

WHAT WE'RE TESTING:
  The RFP parser uses LangChain and Gemini to convert PDF text into structured
  JSON. We test the parsing pipeline, ensuring it correctly handles PDF loading
  and enforces mandatory output fields (sections_required).

WHY THESE TESTS MATTER:
  - Verifies that the LLM prompt is invoked with the correct content.
  - Ensures the service correctly handles cases where the LLM might omit fields.
  - Confirms that the chain composition (prompt | llm | parser) works as expected.

PATTERN USED: AAA (Arrange → Act → Assert)
  We mock the heavy external dependencies:
    - load_pdf (filesystem/parsing)
    - ChatGoogleGenerativeAI (network/LLM)
    - LangChain components (composition logic)
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from services.rfp_parser import parse_rfp

class TestRFPParser:
    """
    Groups tests for the AI-powered RFP parsing logic.
    """

    @pytest.mark.asyncio
    async def test_parse_rfp_success(self):
        """
        WHAT: Verifies the full parsing pipeline from PDF to JSON.
        WHY:  Ensures that PDF content is correctly extracted and passed
              through the LangChain pipeline to get the final parsed data.
        """
        # ARRANGE
        fake_path = "path/to/rfp.pdf"
        fake_content = "This is a sample RFP content."
        fake_parsed_data = {
            "funder": "Google",
            "sections_required": {"intro": {"constraints": None}}
        }

        with patch("services.rfp_parser.load_pdf") as mock_load_pdf, \
             patch("services.rfp_parser.ChatGoogleGenerativeAI") as MockLLM, \
             patch("services.rfp_parser.PromptTemplate") as MockPrompt, \
             patch("services.rfp_parser.JsonOutputParser") as MockParser:
            
            mock_load_pdf.return_value = fake_content
            
            # Setup the LangChain composition mock (| operator)
            mock_chain = MagicMock()
            mock_chain.ainvoke = AsyncMock(return_value=fake_parsed_data)
            
            with patch("services.rfp_parser.PromptTemplate.from_template") as mock_from_template:
                mock_prompt_obj = MagicMock()
                mock_from_template.return_value = mock_prompt_obj
                # chain = prompt | llm | JsonOutputParser()
                # Mock the chain creation result
                mock_prompt_obj.__or__.return_value.__or__.return_value = mock_chain
                
                # ACT
                result = await parse_rfp(fake_path)
                
                # ASSERT
                assert result == fake_parsed_data
                mock_load_pdf.assert_called_once_with(fake_path)
                mock_chain.ainvoke.assert_called_once_with({"content": fake_content})

    @pytest.mark.asyncio
    async def test_parse_rfp_adds_missing_field(self):
        """
        WHAT: Tests the guard clause that ensures "sections_required" is present.
        WHY:  AI outputs can be unpredictable. We must guarantee that this
              specific field exists in the returned dictionary, even if the
              LLM fails to include it.
        """
        # ARRANGE
        fake_parsed_data = {"funder": "NASA"} # Missing sections_required
        
        with patch("services.rfp_parser.load_pdf") as mock_load_pdf, \
             patch("services.rfp_parser.ChatGoogleGenerativeAI"), \
             patch("services.rfp_parser.JsonOutputParser"):
            
            mock_load_pdf.return_value = "Content"
            
            mock_chain = MagicMock()
            mock_chain.ainvoke = AsyncMock(return_value=fake_parsed_data)
            
            with patch("services.rfp_parser.PromptTemplate.from_template") as mock_from_template:
                mock_prompt_obj = MagicMock()
                mock_from_template.return_value = mock_prompt_obj
                mock_prompt_obj.__or__.return_value.__or__.return_value = mock_chain
                
                # ACT
                result = await parse_rfp("file.pdf")
                
                # ASSERT
                assert "sections_required" in result
                assert result["sections_required"] is None  # Should be defaulted to None
