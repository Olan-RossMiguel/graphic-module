import { Link } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function StudentHeader({ student, backRoute }) {
    return (
        <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
                <div className="flex items-center">
                    {backRoute && (
                        <Link
                            href={backRoute}
                            className="mr-4 text-gray-400 transition-colors hover:text-gray-600"
                        >
                            <FaArrowLeft className="h-5 w-5" />
                        </Link>
                    )}
                    <div className="flex items-center">
                        <img
                            className="mr-4 h-12 w-12 rounded-full object-cover"
                            src={student.foto_perfil_url}
                            alt={`${student.nombre} ${student.apellido_paterno}`}
                        />
                        <div>
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                                {student.nombre} {student.apellido_paterno}{' '}
                                {student.apellido_materno}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Grupo {student.group_nombre} -{' '}
                                {student.semestre}° Semestre
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
