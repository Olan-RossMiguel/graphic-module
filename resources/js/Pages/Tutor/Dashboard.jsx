import TutorLayout from '@/Layouts/UI/TutorLayout';

const TutorDashboard = ({ auth }) => {
    return (
        <TutorLayout user={auth.user}>
            <div>
                <h1 className="text-2xl font-bold">Dashboard del Tutor</h1>
                {/* Contenido del dashboard */}
            </div>
        </TutorLayout>
    );
};

export default TutorDashboard;
