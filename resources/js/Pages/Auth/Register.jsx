import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Register({ groups = [], canResetPassword, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        // Campos base para todos
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        genero: '',
        email: '',
        email_institucional: '',
        password: '',
        password_confirmation: '',

        // Campos específicos por tipo
        tipo: 'estudiante',
        numero_control: '',
        semestre: '',
        group_id: '',
        nivel_academico: '',
        grupos_tutor: [], // Para múltiples grupos de tutor
    });

    const [showFields, setShowFields] = useState({
        estudiante: true,
        tutor: false,
        psicologa: false,
    });

    // Efecto para mostrar/ocultar campos según el tipo
    useEffect(() => {
        setShowFields({
            estudiante: data.tipo === 'estudiante',
            tutor: data.tipo === 'tutor',
            psicologa: data.tipo === 'psicologa',
        });

        // Resetear campos específicos al cambiar tipo
        if (data.tipo !== 'estudiante') {
            setData('numero_control', '');
            setData('semestre', '');
            setData('grupo_id', '');
        }
        if (data.tipo !== 'tutor') {
            setData('grupos_tutor', []);
        }
        if (data.tipo === 'estudiante') {
            setData('nivel_academico', '');
        }
    }, [data.tipo]);

    const handleGrupoTutorChange = (grupoId) => {
        const updatedGrupos = data.grupos_tutor.includes(grupoId)
            ? data.grupos_tutor.filter((id) => id !== grupoId)
            : [...data.grupos_tutor, grupoId];

        setData(
            'grupos_tutor',
            updatedGrupos.map((id) => Number(id)),
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrarse" />

            {status && <div className="mb-4 text-green-600">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                {/* Tipo de Usuario */}
                <div>
                    <InputLabel htmlFor="tipo" value="Tipo de Usuario" />
                    <select
                        id="tipo"
                        name="tipo"
                        value={data.tipo}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => setData('tipo', e.target.value)}
                        required
                    >
                        <option value="estudiante">Estudiante</option>
                        <option value="tutor">Tutor</option>
                        <option value="psicologa">Psicóloga</option>
                    </select>
                    <InputError message={errors.tipo} className="mt-2" />
                </div>

                {/* Campos Base (para todos) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre" />
                        <TextInput
                            id="nombre"
                            name="nombre"
                            value={data.nombre}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('nombre', e.target.value)}
                            required
                        />
                        <InputError message={errors.nombre} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="apellido_paterno"
                            value="Apellido Paterno"
                        />
                        <TextInput
                            id="apellido_paterno"
                            name="apellido_paterno"
                            value={data.apellido_paterno}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData('apellido_paterno', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.apellido_paterno}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="apellido_materno"
                            value="Apellido Materno"
                        />
                        <TextInput
                            id="apellido_materno"
                            name="apellido_materno"
                            value={data.apellido_materno}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData('apellido_materno', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.apellido_materno}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="genero" value="Género" />
                        <select
                            id="genero"
                            name="genero"
                            value={data.genero}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => setData('genero', e.target.value)}
                            required
                        >
                            <option value="">Seleccionar</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                        </select>
                        <InputError message={errors.genero} className="mt-2" />
                    </div>
                </div>

                {/* Campos específicos para Estudiantes */}
                {showFields.estudiante && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <InputLabel
                                htmlFor="numero_control"
                                value="Matrícula"
                            />
                            <TextInput
                                id="numero_control"
                                name="numero_control"
                                value={data.numero_control}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData('numero_control', e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.numero_control}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="semestre" value="Semestre" />
                            <select
                                id="semestre"
                                name="semestre"
                                value={data.semestre}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                onChange={(e) =>
                                    setData('semestre', e.target.value)
                                }
                                required
                            >
                                <option value="">Seleccionar</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                    (sem) => (
                                        <option key={sem} value={sem}>
                                            {sem}°
                                        </option>
                                    ),
                                )}
                            </select>
                            <InputError
                                message={errors.semestre}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="group_id" value="Grupo" />
                            <select
                                id="group_id"
                                name="group_id"
                                value={data.group_id} // cambiar de data.grupo_id a data.group_id
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                onChange={(e) =>
                                    setData('group_id', Number(e.target.value))
                                } // ya estaba correcto
                                required
                            >
                                <option value="">Seleccionar</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.nombre}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.group_id} // también debe ser group_id
                                className="mt-2"
                            />
                        </div>
                    </div>
                )}

                {/* Campos específicos para Tutores */}
                {showFields.tutor && (
                    <div className="space-y-4">
                        <div>
                            <InputLabel
                                htmlFor="nivel_academico"
                                value="Nivel Académico"
                            />
                            <select
                                id="nivel_academico"
                                name="nivel_academico"
                                value={data.nivel_academico}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                onChange={(e) =>
                                    setData('nivel_academico', e.target.value)
                                }
                                required
                            >
                                <option value="">Seleccionar</option>
                                <option value="licenciatura">
                                    Licenciatura
                                </option>
                                <option value="especialidad">
                                    Especialidad
                                </option>
                                <option value="maestria">Maestría</option>
                                <option value="doctorado">Doctorado</option>
                            </select>
                            <InputError
                                message={errors.nivel_academico}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="Grupos a cargo" />
                            <div className="mt-2 space-y-2">
                                {groups.map((group) => (
                                    <label
                                        key={group.id}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.grupos_tutor.includes(
                                                group.id,
                                            )}
                                            onChange={() =>
                                                handleGrupoTutorChange(group.id)
                                            }
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Grupo {group.nombre}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <InputError
                                message={errors.grupos_tutor}
                                className="mt-2"
                            />
                        </div>
                    </div>
                )}

                {/* Campos específicos para Psicólogas */}
                {showFields.psicologa && (
                    <div>
                        <InputLabel
                            htmlFor="nivel_academico"
                            value="Nivel Académico"
                        />
                        <select
                            id="nivel_academico"
                            name="nivel_academico"
                            value={data.nivel_academico}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) =>
                                setData('nivel_academico', e.target.value)
                            }
                            required
                        >
                            <option value="">Seleccionar</option>
                            <option value="licenciatura">Licenciatura</option>
                            <option value="especialidad">Especialidad</option>
                            <option value="maestria">Maestría</option>
                            <option value="doctorado">Doctorado</option>
                        </select>
                        <InputError
                            message={errors.nivel_academico}
                            className="mt-2"
                        />
                    </div>
                )}

                {/* Campos de Email */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="email" value="Email Personal" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="email_institucional"
                            value="Email Institucional"
                        />
                        <TextInput
                            id="email_institucional"
                            type="email"
                            name="email_institucional"
                            value={data.email_institucional}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData('email_institucional', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.email_institucional}
                            className="mt-2"
                        />
                    </div>
                </div>

                {/* Campos de Contraseña */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="password" value="Contraseña" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirmar Contraseña"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        ¿Ya estás registrado?
                    </Link>
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Registrarse
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
