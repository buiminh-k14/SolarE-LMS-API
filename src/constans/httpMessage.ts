export enum HttpMessage {
  SUCCESS = 'success',
  INTERNAL_SERVER_ERROR = 'internal_server_error',
  BAD_REQUEST = 'bad_request',

  CREATED_USER = 'created_user',
  INVALID_USER = 'invalid_user',

  CREATED_DEPARTMENT = 'created_department',
  INVALID_DEPARTMENT = 'invalid_department',

  CREATED_COURSE = 'created_course',
  INVALID_COURSE = 'invalid_course',

  ASSIGNED_COURSE_FOR_USER = 'assigned_course_for_user',
  USER_WITHOUT_COURSE = 'user_without_course',
  UNASSIGNED_COURSE_FOR_USER = 'unassigned_course_for_user',

  ASSIGNED_COURSE_FOR_DEPARTMENT = 'assigned_course_for_department',
  DEPARTMENT_WITHOUT_COURSE = 'department_without_course',
  UNASSIGNED_COURSE_FOR_DEPARTMENT = 'unassigned_course_for_department',
}
