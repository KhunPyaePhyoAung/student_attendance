const path = require('path');

const viewFolder = path.join(__dirname, '..', 'resource', 'view');
const viewController = ({tokenService}) => {

    return {
        home: async (req, res) => {
            const role = req.user.role;
            let homeHtml;
            if (role === 'ADMIN') {
                homeHtml = path.join(viewFolder, 'admin_home.html');
            } else if (role === 'INSTRUCTOR') {
                homeHtml = path.join(viewFolder, 'instructor_home.html');
            } else if (role === 'STUDENT') {
                homeHtml = path.join(viewFolder, 'student_home.html');
            }
            return res.sendFile(homeHtml);
        },

        login: async (req, res) => {
            let token = req.cookies.access_token
            try {
                if (token) {
                    const decodedToken = tokenService.verifyAccessToken(token)
                    if (!decodedToken) {
                        throw new Error('Unauthorized');
                    }
                    const homeHtml = path.join(viewFolder, 'home.html');
                    return res.sendFile(homeHtml);
                }
                throw new Error('Unauthorized');
            } catch (error) {
                const loginHtml = path.join(viewFolder, 'login.html');
                return res.sendFile(loginHtml);
            }
            
        },

        student_registration: (req, res) => {
            const html = path.join(viewFolder, 'admin_student_registration.html');
            return res.sendFile(html);
        },

        student_edit: (req, res) => {
            const html = path.join(viewFolder, 'admin_student_edit.html');
            return res.sendFile(html);
        },

        students: (req, res) => {
            const role = req.user.role;
            let html;
            if (role === 'ADMIN') {
                html = path.join(viewFolder, 'admin_students.html');
            } else if (role === 'INSTRUCTOR') {
                html = path.join(viewFolder, 'instructor_students.html');
            } else if (role === 'STUDENT') {
                html = path.join(viewFolder, 'student_students.html');
            }
            return res.sendFile(html);
        },

        instructors: (req, res) => {
            const role = req.user.role;
            let html;
            if (role === 'ADMIN') {
                html = path.join(viewFolder, 'admin_instructors.html');
            } else if (role === 'INSTRUCTOR') {
                html = path.join(viewFolder, 'instructor_instructors.html');
            } else if (role === 'STUDENT') {
                html = path.join(viewFolder, 'student_instructors.html');
            }
            return res.sendFile(html);
        },

        instructor_registration: (req, res) => {
            const html = path.join(viewFolder, 'admin_instructor_registration.html');
            return res.sendFile(html);
        },

        instructor_edit: (req, res) => {
            const html = path.join(viewFolder, 'admin_instructor_edit.html');
            return res.sendFile(html);
        },

        subjects: (req, res) => {
            const role = req.user.role;
            let html;
            if (role === 'ADMIN') {
                html = path.join(viewFolder, 'admin_subjects.html');
            } else if (role === 'INSTRUCTOR') {
                html = path.join(viewFolder, 'instructor_subjects.html');
            } else if (role === 'STUDENT') {
                html = path.join(viewFolder, 'student_subjects.html');
            }
            return res.sendFile(html);
        },

        subject_registration: (req, res) => {
            const html = path.join(viewFolder, 'admin_subject_registration.html');
            return res.sendFile(html);
        },

        subject_edit: (req, res) => {
            const html = path.join(viewFolder, 'admin_subject_edit.html');
            return res.sendFile(html);
        },

        terms: (req, res) => {
            const role = req.user.role;
            let html;
            if (role === 'ADMIN') {
                html = path.join(viewFolder, 'admin_terms.html');
            } else if (role === 'INSTRUCTOR') {
                html = path.join(viewFolder, 'instructor_terms.html');
            } else if (role === 'STUDENT') {
                html = path.join(viewFolder, 'student_terms.html');
            }
            return res.sendFile(html);
        },

        term_registration: (req, res) => {
            const html = path.join(viewFolder, 'admin_term_registration.html');
            return res.sendFile(html);
        },

        term_edit: (req, res) => {
            const html = path.join(viewFolder, 'admin_term_edit.html');
            return res.sendFile(html);
        },

        attendance_scan: (req, res) => {
            const html = path.join(viewFolder, 'student_attendance_scan.html');
            return res.sendFile(html);
        },

        sessions: (req, res) => {
            const role = req.user.role;
            let html;
            if (role === 'ADMIN') {
                html = path.join(viewFolder, 'admin_sessions.html');
            } else if (role === 'INSTRUCTOR') {
                html = path.join(viewFolder, 'instructor_sessions.html');
            } else if (role === 'STUDENT') {
                html = path.join(viewFolder, 'student_sessions.html');
            }
            return res.sendFile(html);
        },

        session_registration: (req, res) => {
            const html = path.join(viewFolder, 'instructor_session_registration.html');
            return res.sendFile(html);
        },

        session_edit: (req, res) => {
            const html = path.join(viewFolder, 'instructor_session_edit.html');
            return res.sendFile(html);
        },

        session_detail: (req, res) => {
            const html = path.join(viewFolder, 'instructor_session_detail.html');
            return res.sendFile(html);
        },

        attendances: (req, res) => {
            const role = req.user.role;
            let html;
            if (role === 'ADMIN') {
                html = path.join(viewFolder, 'admin_attendances.html');
            } else if (role === 'INSTRUCTOR') {
                html = path.join(viewFolder, 'instructor_attendances.html');
            } else if (role === 'STUDENT') {
                html = path.join(viewFolder, 'student_attendances.html');
            }
            return res.sendFile(html);
        },

    }
}


module.exports = viewController;