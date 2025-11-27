import PsychologistLayout from '@/Layouts/UI/PsychologistLayout';
import StudentLayout from '@/Layouts/UI/StudentLayout';
import TutorLayout from '@/Layouts/UI/TutorLayout';
import { Head } from '@inertiajs/react';
import {
    FaBrain,
    FaChalkboardTeacher,
    FaCode,
    FaUserTie,
} from 'react-icons/fa';

export default function AboutIndex({ auth }) {
    // Contenido común para todos los roles
    const content = (
        <div className="space-y-8">
            {/* Header con título y línea decorativa */}
            <div className="text-center">
                <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                    SOBRE <span className="text-yellow-600">NOSOTROS</span>
                </h1>
                <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            </div>

            {/* Sección de logos con animación hover */}
            <div className="flex flex-wrap items-center justify-center gap-8 py-8 sm:gap-16">
                <div className="group flex h-32 w-32 items-center justify-center transition-transform duration-300 hover:scale-110 sm:h-40 sm:w-40">
                    <img
                        src="https://i.imgur.com/TlhGqCr.png"
                        alt="TecNM"
                        className="h-full w-full object-contain drop-shadow-lg"
                    />
                </div>
                <div className="group flex h-32 w-32 items-center justify-center transition-transform duration-300 hover:scale-110 sm:h-40 sm:w-40">
                    <img
                        src="https://i.imgur.com/1MoRblg.png"
                        alt="Logo Proyecto"
                        className="h-full w-full object-contain drop-shadow-lg"
                    />
                </div>
                <div className="group flex h-32 w-32 items-center justify-center transition-transform duration-300 hover:scale-110 sm:h-40 sm:w-40">
                    <img
                        src="https://i.imgur.com/vbzMmkk.png"
                        alt="ITSS"
                        className="h-full w-full object-contain drop-shadow-lg"
                    />
                </div>
            </div>

            {/* Descripción del proyecto con diseño moderno */}
            <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-xl sm:p-12">
                <div className="mb-8 inline-block rounded-lg bg-yellow-100 px-4 py-2">
                    <span className="text-sm font-semibold uppercase tracking-wider text-yellow-800">
                        Nuestro Proyecto
                    </span>
                </div>

                <p className="mb-6 text-lg leading-relaxed text-gray-700">
                    Somos un equipo de estudiantes de{' '}
                    <span className="font-semibold text-gray-900">
                        Ingeniería Informática
                    </span>{' '}
                    del Tecnológico Nacional de México, campus Región Sierra,
                    dedicados al desarrollo de soluciones tecnológicas
                    orientadas al fortalecimiento académico. Nuestro proyecto
                    forma parte del área de Tutorías y responde a la necesidad
                    institucional de contar con herramientas modernas que
                    faciliten la identificación de estilos de aprendizaje y
                    niveles de inteligencia emocional en los estudiantes.
                </p>

                <div className="rounded-xl bg-blue-50 p-6 shadow-inner">
                    <p className="text-lg leading-relaxed text-gray-700">
                        Hemos desarrollado un{' '}
                        <span className="font-semibold text-blue-900">
                            Sistema Web de Aprendizaje Socioemocional
                        </span>
                        , conformado por un módulo para la aplicación digital de
                        test y un módulo para la generación de gráficos y
                        estadísticas. Este sistema permite analizar información
                        de manera precisa y oportuna, apoyando a los tutores en
                        la toma de decisiones académicas y en la atención
                        personalizada del alumnado.
                    </p>
                </div>
            </div>

            {/* Equipo de Trabajo con cards mejoradas */}
            <div className="rounded-2xl bg-white p-8 shadow-xl sm:p-12">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900">
                        Equipo de{' '}
                        <span className="text-yellow-600">Trabajo</span>
                    </h2>
                    <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Columna izquierda - Información del equipo */}
                    <div className="space-y-8">
                        {/* Desarrolladores */}
                        <div className="rounded-xl border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-transparent p-6 shadow-md transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-lg bg-yellow-500 p-2 text-white">
                                    <FaCode className="h-5 w-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Desarrolladores
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1 text-yellow-500">
                                        ▸
                                    </span>
                                    <span className="text-lg text-gray-700">
                                        <strong>
                                            Cindy Juleidy Rodríguez Pérez
                                        </strong>
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1 text-yellow-500">
                                        ▸
                                    </span>
                                    <span className="text-lg text-gray-700">
                                        <strong>
                                            Luis Javier Castro Gómez
                                        </strong>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Tutoría Académica */}
                        <div className="rounded-xl border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent p-6 shadow-md transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-lg bg-blue-500 p-2 text-white">
                                    <FaUserTie className="h-5 w-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Tutoría Académica
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1 text-blue-500">
                                        ▸
                                    </span>
                                    <span className="text-lg text-gray-700">
                                        <strong>
                                            Lic. Isabel Gutiérrez Marín
                                        </strong>
                                        <span className="block text-sm text-gray-600">
                                            Coordinadora de Tutorías
                                        </span>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Tutores Internos */}
                        <div className="rounded-xl border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-transparent p-6 shadow-md transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-lg bg-green-500 p-2 text-white">
                                    <FaChalkboardTeacher className="h-5 w-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Tutores Internos
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1 text-green-500">
                                        ▸
                                    </span>
                                    <span className="text-lg text-gray-700">
                                        <strong>
                                            M.I.A. Alejandra Guadalupe Vázquez
                                            Martínez
                                        </strong>
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1 text-green-500">
                                        ▸
                                    </span>
                                    <span className="text-lg text-gray-700">
                                        <strong>
                                            M.I. Jesús Manuel May León
                                        </strong>
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1 text-green-500">
                                        ▸
                                    </span>
                                    <span className="text-lg text-gray-700">
                                        <strong>
                                            M.T. Isidro Torrez Gonzáles
                                        </strong>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Apoyo del Área de Psicología */}
                        <div className="rounded-xl border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-transparent p-6 shadow-md transition-shadow hover:shadow-lg">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-lg bg-purple-500 p-2 text-white">
                                    <FaBrain className="h-5 w-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Apoyo de Psicología
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1 text-purple-500">
                                        ▸
                                    </span>
                                    <span className="text-lg text-gray-700">
                                        <strong>
                                            Departamento de Psicología del TecNM
                                            campus Región Sierra
                                        </strong>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Columna derecha - Logo del equipo */}
                    <div className="flex items-center justify-center">
                        <div className="group relative">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-75 blur-lg transition-all duration-500 group-hover:opacity-100 group-hover:blur-xl"></div>
                            <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-white p-8 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src="https://i.imgur.com/GBcDgir.png"
                                    alt="Logo Equipo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Seleccionar layout según el tipo de usuario
    const userType = auth?.user?.tipo;

    if (!auth?.user) {
        return (
            <>
                <Head title="Sobre Nosotros" />
                <div className="flex min-h-screen items-center justify-center">
                    <p>Cargando...</p>
                </div>
            </>
        );
    }

    if (userType === 'estudiante') {
        return (
            <StudentLayout user={auth.user}>
                <Head title="Sobre Nosotros" />
                {content}
            </StudentLayout>
        );
    }

    if (userType === 'tutor') {
        return (
            <TutorLayout user={auth.user}>
                <Head title="Sobre Nosotros" />
                {content}
            </TutorLayout>
        );
    }

    if (userType === 'psicologa' || userType === 'psicologo') {
        return (
            <PsychologistLayout user={auth.user}>
                <Head title="Sobre Nosotros" />
                {content}
            </PsychologistLayout>
        );
    }

    // Fallback sin layout
    return (
        <>
            <Head title="Sobre Nosotros" />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {content}
                </div>
            </div>
        </>
    );
}
