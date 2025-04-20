//api

export const login = 'api/login';
export const logout='api/logout';
export const authTest='/api/auth-test'

//admin
export const register='/api/register'
export const term='/api/admin/terms'
export const course='/api/admin/courses'
export const courseByTerm='/api/admin/courses/getAllByTerm'
export const searchStudent='/api/admin/search/student'
export const adminAdminManager='/api/admin/managers'
export const adminClasses='/api/admin/classes'
export const adminAllowances='/api/admin/allowances'
//manager
export const managerViolations='/api/manager/violations'
export const managerSearchStudent='/api/manager/search/student'
export const managerClasses='/api/manager/class' 
export const managerClassStudents='/api/manager/class/students' 

//student
export const studentClass='/api/student/class'
export const studentClassmates='/api/student/class/classmates'
export const studentAllowances='/api/student/allowances'
export const studentCourses='/api/student/courses'