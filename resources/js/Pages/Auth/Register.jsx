import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import AcademicLevelField from '@/Components/UI/Register/AcademicLevelField';
import BaseFields from '@/Components/UI/Register/BaseFields';
import EmailFields from '@/Components/UI/Register/EmailFields';
import PasswordFields from '@/Components/UI/Register/PasswordFields';
import StudentFields from '@/Components/UI/Register/StudentFields';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    FaArrowLeft,
    FaArrowRight,
    FaUserPlus,
    FaUserTag,
} from 'react-icons/fa';

export default function Register({ groups = [], canResetPassword, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        genero: '',
        email: '',
        email_institucional: '',
        password: '',
        password_confirmation: '',
        tipo: 'estudiante',
        numero_control: '',
        semestre: '',
        group_id: '',
        nivel_academico: '',
        grupos_tutor: [],
    });

    const [showFields, setShowFields] = useState({
        estudiante: true,
        tutor: false,
        psicologa: false,
    });

    const tipoOptions = [
        { value: 'estudiante', label: 'Estudiante' },
        { value: 'tutor', label: 'Tutor' },
        { value: 'psicologa', label: 'Psicóloga' },
    ];

    useEffect(() => {
        setShowFields({
            estudiante: data.tipo === 'estudiante',
            tutor: data.tipo === 'tutor',
            psicologa: data.tipo === 'psicologa',
        });

        // Resetear campos específicos al cambiar tipo
        if (data.tipo !== 'estudiante') {
            setData((prev) => ({
                ...prev,
                numero_control: '',
                semestre: '',
                group_id: '',
            }));
        }

        if (data.tipo !== 'tutor') {
            setData((prev) => ({
                ...prev,
                grupos_tutor: [],
            }));
        }

        if (data.tipo === 'estudiante') {
            setData((prev) => ({
                ...prev,
                nivel_academico: '',
            }));
        }
    }, [data.tipo]);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrarse" />

            {status && (
                <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">
                    {status}
                </div>
            )}

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                    Crea tu cuenta
                </h2>
                <p className="mt-2 text-gray-600">
                    Completa el formulario para comenzar
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Tipo de Usuario */}
                <div>
                    <label
                        htmlFor="tipo"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Tipo de Usuario
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaUserTag className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            id="tipo"
                            name="tipo"
                            value={data.tipo}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onChange={(e) => setData('tipo', e.target.value)}
                            required
                        >
                            {tipoOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <InputError message={errors.tipo} className="mt-2" />
                </div>

                {/* Campos Base */}
                <BaseFields data={data} setData={setData} errors={errors} />

                {/* Campos específicos por tipo */}
                {showFields.estudiante && (
                    <StudentFields
                        data={data}
                        setData={setData}
                        errors={errors}
                        groups={groups}
                    />
                )}

                {(showFields.tutor || showFields.psicologa) && (
                    <div className="space-y-6">
                        <AcademicLevelField
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </div>
                )}

                {/* Campos de Email */}
                <EmailFields data={data} setData={setData} errors={errors} />

                {/* Campos de Contraseña */}
                <PasswordFields data={data} setData={setData} errors={errors} />

                {/* Botón de registro */}
                <div>
                    <PrimaryButton
                        className="group w-full justify-center py-3 text-base font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            'Creando cuenta...'
                        ) : (
                            <>
                                <span>Crear cuenta</span>
                                <FaArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </PrimaryButton>
                </div>

                {/* Separador */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">
                            ¿Ya tienes cuenta?
                        </span>
                    </div>
                </div>

                {/* Botón de login */}
                <div>
                    <Link
                        href={route('login')}
                        className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Volver al inicio de sesión
                    </Link>
                </div>
            </form>

            {/* Información adicional */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-2 flex items-center text-sm font-medium text-gray-800">
                    <FaUserPlus className="mr-2 h-4 w-4" />
                    Información importante
                </h3>
                <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Usa tu email institucional para verificación</li>
                    <li>• La contraseña debe tener al menos 8 caracteres</li>
                    <li>• Selecciona correctamente tu tipo de usuario</li>
                    <li>
                        • ¿Problemas al registrarte? Contacta al soporte técnico
                    </li>
                </ul>
            </div>
        </GuestLayout>
    );
}
