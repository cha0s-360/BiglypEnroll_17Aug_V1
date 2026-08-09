#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Modify the EMI duration option in fee financing from 6-12 months to 3-12 months (Student/Parent login), and rebuild the Student Fee Payment screen per provided design spec."

backend:
  - task: "Fee financing EMI tenure range 3-12 months"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Changed /api/parent/financing/preview clamp from max(6, min(12, tenure)) to max(3, min(12, tenure)). Verified via curl tenure=3 returns 3-month schedule. Needs formal retest for tenures 2 (clamps to 3), 3, 12, 13 (clamps to 12) and EMI/schedule correctness."
        -working: true
        -agent: "testing"
        -comment: "Comprehensive testing completed. All test cases passed: (1) tenure=3 with amount=100000, down_payment=0 correctly returns 3-month schedule with emi=33334; (2) tenure=2 correctly clamps to 3; (3) tenure=12 with amount=120000, down_payment=20000 correctly returns 12-month schedule with emi=8334, financed_amount=100000; (4) tenure=13 correctly clamps to 12; (5) EMI calculation verified as ceil(financed_amount/tenure); (6) financed_amount correctly calculated as amount - down_payment. Parent flow smoke tests also passed: GET /api/parent/children returns 2 children, GET /api/parent/fees/{student_id} returns fee items with correct structure, POST /api/parent/pay-financing successfully creates financing receipt with mode='Financing (EMI)' and financing=true."

metadata:
  created_by: "main_agent"
  version: "1.2"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus:
    - "Fee financing EMI tenure range 3-12 months"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    -agent: "main"
    -message: "Please test /api/parent/financing/preview (auth as parent@biglyp.com / parent123). Verify: tenure=3 -> 3 EMIs; tenure=2 -> clamps to 3; tenure=12 -> 12 EMIs; tenure=13 -> clamps to 12; financed_amount = amount - down_payment; emi = ceil(financed/tenure); schedule length == tenure. Also confirm /api/parent/pay-financing still works for a parent's pending academic fee heads."
    -agent: "testing"
    -message: "Testing completed successfully. All 6 test cases passed including edge cases and smoke tests. The EMI tenure range change from 6-12 to 3-12 months is working correctly. Tenure clamping works as expected (2->3, 13->12). EMI calculations are accurate using ceil(financed_amount/tenure). Parent flow endpoints (children, fees, pay-financing) are all functioning properly. No issues found."