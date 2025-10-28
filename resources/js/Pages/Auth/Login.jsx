import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayoutLogIn from '@/Layouts/GuestLayoutLogIn';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaArrowRight, FaLock, FaUser, FaUserPlus } from 'react-icons/fa';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        identifier: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayoutLogIn>
            <Head title="Iniciar Sesión" />

            {status && (
                <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">
                    {status}
                </div>
            )}

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                    Bienvenido de vuelta
                </h2>
                <p className="mt-2 text-gray-600">
                    Ingresa a tu cuenta para continuar
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Campo de identificación */}
                <div>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="identifier"
                            type="text"
                            name="identifier"
                            value={data.identifier}
                            className="mt-1 block w-full border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) =>
                                setData('identifier', e.target.value)
                            }
                            placeholder="Matrícula o correo electrónico"
                        />
                    </div>
                    <InputError message={errors.identifier} className="mt-2" />
                </div>

                {/* Campo de contraseña */}
                <div>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder="Tu contraseña"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Opciones adicionales */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Mantener sesión activa
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-blue-600 transition-colors hover:text-blue-500"
                        >
                            ¿Contraseña olvidada?
                        </Link>
                    )}
                </div>

                {/* Botón de login */}
                <div>
                    <PrimaryButton
                        className="group w-full justify-center py-3 text-base font-semibold"
                        disabled={processing}
                    >
                        {processing ? (
                            'Iniciando sesión...'
                        ) : (
                            <>
                                <span>Ingresar al sistema</span>
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
                            ¿Eres nuevo?
                        </span>
                    </div>
                </div>

                {/* Botón de registro */}
                <div>
                    <Link
                        href={route('register')}
                        className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <FaUserPlus className="mr-2 h-4 w-4" />
                        Crear una cuenta nueva
                    </Link>
                </div>
            </form>

            {/* Información para nuevos usuarios */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-2 flex items-center text-sm font-medium text-gray-800">
                    <FaUserPlus className="mr-2 h-4 w-4" />
                    Información para nuevos usuarios
                </h3>
                <ul className="space-y-1 text-xs text-gray-600">
                    <li>
                        • Estudiantes: Contacta a tu tutor para obtener acceso
                    </li>
                    <li>
                        • Tutores: Solicita tu cuenta al administrador del
                        sistema
                    </li>
                    <li>
                        • ¿Problemas con el acceso? Contacta al soporte técnico
                    </li>
                </ul>
            </div>
        </GuestLayoutLogIn>
    );
}
