// resources/js/Pages/Psychologist/Dashboard.jsx
import PsychologistLayout from '../../Layouts/PsychologistLayout';

const PsychologistDashboard = ({ auth }) => {
    return (
        <PsychologistLayout user={auth.user}>
            <div>
                <h1 className="text-2xl font-bold">Dashboard del Psicólogo</h1>
                {/* Contenido del dashboard */}
            </div>
        </PsychologistLayout>
    );
};

export default PsychologistDashboard;
