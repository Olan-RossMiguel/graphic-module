import StudentLayout from '@/Layouts/UI/StudentLayout';

const StudentDashboard = ({
    user,
    welcome_message,
    pending_tests,
    completed_tests,
}) => {
    console.log('User:', user); // 🔹 Para verificar
    return (
        <StudentLayout
            user={user}
            onLogout={() => console.log('Cerrar sesión')}
        >
            <h1 className="text-2xl font-bold">{welcome_message}</h1>
            <p>Tests pendientes: {pending_tests}</p>
            <p>Tests completados: {completed_tests}</p>
        </StudentLayout>
    );
};

export default StudentDashboard;
