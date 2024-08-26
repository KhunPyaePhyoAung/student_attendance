const userRepository = require('./repository/UserRepository')();
const subjectRepository = require('./repository/SubjectRepository')();
const termRepository = require('./repository/TermRepository')();
const studentRepository = require('./repository/StudentRepository')();
const instructorRepository = require('./repository/InstructorRepository')();
const attendanceRepository = require('./repository/AttendanceRepository')();

const passwordEncryptService = require('./service/Md5PasswordEncryptService');
const jwtTokenService = require('./service/JwtTokenService');
const userService = require('./service/UserService')({userRepository, passwordEncryptService});
const subjectService = require('./service/SubjectService')({ subjectRepository });
const termService = require('./service/TermService')({termRepository, subjectService});
const studentService = require('./service/StudentService')({studentRepository, userService});
const instructorService = require('./service/InstructorService')({instructorRepository, userService});
const authService = require('./service/AuthService')({userRepository, passwordEncryptService});
const tokenService = require('./service/JwtTokenService');
const attendanceService = require('./service/AttendanceService')({attendanceRepository});

const userController = require('./controller/UserController')({userService});
const termController = require('./controller/TermController')({termService});
const subjectController = require('./controller/SubjectController')({ subjectService });
const viewController = require('./controller/ViewController')({jwtTokenService});
const studentController = require('./controller/StudentController')({studentService});
const instructorController = require('./controller/InstructorController')({instructorService});
const authController = require('./controller/AuthControlller')({authService, userService, tokenService});
const attendanceController = require('./controller/AttendanceController')({attendanceService});

module.exports = {
    userController,
    termController,
    subjectController,
    viewController,
    studentController,
    instructorController,
    authController,
    attendanceController
}