export enum ERROR {
//error messages

  //processes

  PROCESS_ADD_STAGE ="ERROR: There must be at least one stage on a process",
  PROCESS_NULL = "ERROR: The process is null",
  PROCESS_ADD_ERROR = "ERROR: There was an error adding a process",
  PROCESS_TITLE = "ERROR: Must add process title",
  PROCESSES_HTTP_ERROR = "ERROR: There was an error connecting to the process database",

  //stages
  STAGES_HTTP_ERROR = "ERROR: There was an error connecting to the stage database",
  STAGE_TYPE_SELECT = "ERROR: You must select a type for this stage",
  STAGE_QUESTION_BLANK = "ERROR: You cannot leave a question blank",
  STAGE_PROCESS_NULL = "ERROR: Selected process is null, please select a valid process",
  STAGE_FIELD_BLANK = "ERROR: Field must not be empty",
  STAGE_OPTION_ADD_MORE = "ERROR: You must add more fields",
  STAGE_IS_NULL = "ERROR: Stage is null, please select a stage",

  //options
  OPTION_HTTP_ERROR = "ERROR: There was an error connecting to the stage option database",
  OPTION_VALUE_EMPTY = "ERROR: Field must not be empty",
  //responses
  RESPONSES_HTTP_ERROR = "ERROR: There was an error connecting to the database",


}
