// resources/js/Pages/Psychologist/Reports/GeneralReport.jsx
import GeneralPDFReport from '@/Components/PDF/GeneralPDFReport';
import PsychologistLayout from '@/Layouts/UI/PsychologistLayout';
import { Link } from '@inertiajs/react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaDownload, FaEye } from 'react-icons/fa';

export default function GeneralReport({ auth, student, testResults }) {
    const [showViewer, setShowViewer] = useState(false);
    const [pdfError, setPdfError] = useState(null);

    // URL del logo (ajusta según tu estructura)
    const logoUrl = 'https://i.imgur.com/ROYa0fx.png';

    // 🔍 DEBUG: Ver qué datos llegan
    useEffect(() => {
        console.log('=== DEBUG PSYCHOLOGIST REPORT ===');
        console.log('Student:', student);
        console.log('Test Results:', testResults);
        console.log('Logo URL:', logoUrl);
    }, [student, testResults, logoUrl]);

    return (
        <PsychologistLayout user={auth.user}>
            <div className="space-y-6">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                            <Link
                                href={route('psychologist.groups.index')}
                                className="mr-4 text-gray-400 transition-colors hover:text-gray-600"
                            >
                                <FaArrowLeft className="h-5 w-5" />
                            </Link>
                            <div>
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                                    Reporte General
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {student.nombre_completo} -{' '}
                                    {student.numero_control}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🔍 DEBUG: Mostrar error si existe */}
                {pdfError && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Error en el PDF
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{pdfError}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Información del Estudiante */}
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Información del Estudiante
                        </h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Nombre completo
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {student.nombre_completo}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Matrícula
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {student.numero_control}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Grupo
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {student.grupo}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Semestre
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {student.semestre}° Semestre
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Tests Completados */}
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Tests Completados ({testResults.length})
                        </h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {testResults.map((test, index) => (
                                <li key={index} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {test.test_nombre}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Realizado:{' '}
                                                {new Date(
                                                    test.fecha,
                                                ).toLocaleDateString('es-MX')}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Puntuación:{' '}
                                            <span className="font-semibold text-gray-900">
                                                {test.puntuacion}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            console.log('Toggle viewer clicked');
                            setShowViewer(!showViewer);
                        }}
                        className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <FaEye className="mr-2 h-4 w-4" />
                        {showViewer ? 'Ocultar' : 'Visualizar'} PDF
                    </button>

                    <PDFDownloadLink
                        document={
                            <GeneralPDFReport
                                student={student}
                                testResults={testResults}
                                logoUrl={logoUrl}
                            />
                        }
                        fileName={`Reporte_General_${student.numero_control}.pdf`}
                        className="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {({ loading, error }) => {
                            if (error) {
                                console.error('PDF Download Error:', error);
                                setPdfError(error.message);
                            }
                            return (
                                <>
                                    <FaDownload className="mr-2 h-4 w-4" />
                                    {loading
                                        ? 'Generando...'
                                        : error
                                          ? 'Error en PDF'
                                          : 'Descargar PDF'}
                                </>
                            );
                        }}
                    </PDFDownloadLink>
                </div>

                {/* Visor de PDF */}
                {showViewer && (
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div style={{ height: '800px' }} className="w-full">
                            <PDFViewer width="100%" height="100%">
                                <GeneralPDFReport
                                    student={student}
                                    testResults={testResults}
                                    logoUrl={logoUrl}
                                />
                            </PDFViewer>
                        </div>
                    </div>
                )}
            </div>
        </PsychologistLayout>
    );
}
