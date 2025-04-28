//api

export const login = 'api/login';
export const logout='api/auth/logout';
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
export const adminAllowancesBulk='/api/admin/allowances/bulk'
export const adminAllowancesPending='/api/admin/allowances/pending'
export const adminAllowancesStudent='/api/admin/allowances/students'
export const adminEquipmentType='/api/admin/equipments/types'
export const adminEquipmentDistribution='/api/admin/equipments/distributions'
export const adminPendingEquipment='/api/admin/equipments/pending' 
export const adminFitnessTest='/api/admin/fitness-tests'
export const adminStudentProfile='/api/admin/students'
export const adminStudentUpdateImage='/api/admin/users'
//manager
export const managerProfile='/api/manager/profile'
export const managerViolations='/api/manager/violations'
export const managerSearchStudent='/api/manager/students/search'
export const managerClasses='/api/manager/class' 
export const managerClassStudents='/api/manager/class/students' 
export const managerFitnessTests='/api/manager/fitness/tests'
export const managerCurrentPractice='/api/manager/fitness/current-session'
export const managerAssessmentsPractice='/api/manager/fitness/sessions'
export const managerAssessments='/api/manager/fitness/assessments'
export const managerAssessmentsBatch='/api/manager/fitness/assessments/batch'

//student
export const updateImage='/api/auth/update-image'
export const studentProfile='/api/student/profile'
export const studentProfileDetail='/api/student/profile/detail'
export const studentClass='/api/student/class'
export const studentClassmates='/api/student/class/classmates'
export const studentAllowances='/api/student/allowances'
export const studentCourses='/api/student/courses'
export const studentViolations='/api/student/violations'
export const studentFitnessAssessments='/api/student/fitness-assessments'
