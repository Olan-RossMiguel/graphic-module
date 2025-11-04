import PsychologistLayout from '@/Layouts/UI/PsychologistLayout';
import { useForm, usePage } from '@inertiajs/react';
import { FaEdit } from 'react-icons/fa';

export default function EditTutor({ user, fields = {}, status }) {
    const { props } = usePage();

    const form = useForm({
        nombre: fields.nombre || '',
        apellido_paterno: fields.apellido_paterno || '',
        apellido_materno: fields.apellido_materno || '',
        nivel_academico: fields.nivel_academico || '',
        email: fields.email || '',
        email_institucional: fields.email_institucional || '',
        password: '',
        password_confirmation: '',
        foto_perfil: null,
    });

    function handleSubmit(e) {
        e.preventDefault();

        // Validar datos antes de enviar
        if (!form.data.nombre.trim()) {
            console.error('Nombre es requerido');
            return;
        }
        if (!form.data.apellido_paterno.trim()) {
            console.error('Apellido paterno es requerido');
            return;
        }
        if (!form.data.apellido_materno.trim()) {
            console.error('Apellido materno es requerido');
            return;
        }
        if (!form.data.email.trim()) {
            console.error('Email es requerido');
            return;
        }
        if (!form.data.nivel_academico) {
            console.error('Nivel académico es requerido');
            return;
        }

        const hasFile = form.data.foto_perfil instanceof File;

        if (hasFile) {
            // ✅ Cuando hay archivo, usar POST con method spoofing correcto
            form.post(route('profile.psychologist.update'), {
                forceFormData: true,
                _method: 'patch',
                preserveScroll: true,
                onSuccess: () => {
                    // Resetear campos sensibles
                    form.reset(
                        'password',
                        'password_confirmation',
                        'foto_perfil',
                    );
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                },
            });
        } else {
            // ✅ Cuando no hay archivo, usar PATCH directamente
            form.patch(route('profile.psychologist.update'), {
                preserveScroll: true,
                onSuccess: () => {
                    // Resetear campos sensibles
                    form.reset('password', 'password_confirmation');
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                },
            });
        }
    }

    function handleFotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tamaño y tipo de archivo
        const maxSize = 5 * 1024 * 1024; // 5MB
        const validTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
        ];

        if (file.size > maxSize) {
            alert('El archivo es demasiado grande. Máximo 5MB.');
            return;
        }

        if (!validTypes.includes(file.type)) {
            alert('Tipo de archivo no válido. Use JPG, PNG o WebP.');
            return;
        }

        form.setData('foto_perfil', file);
    }

    const nivelesAcademicos = [
        { value: 'licenciatura', label: 'Licenciatura' },
        { value: 'especialidad', label: 'Especialidad' },
        { value: 'maestria', label: 'Maestría' },
        { value: 'doctorado', label: 'Doctorado' },
    ];

    return (
        <PsychologistLayout user={user}>
            {status && (
                <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
                    {status}
                </div>
            )}

            {form.errors.general && (
                <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                    {form.errors.general}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                {/* LADO IZQUIERDO */}
                <aside className="bg-gradient-to-b from-white to-gray-50 p-6 shadow-lg sm:rounded-xl md:col-span-1">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-5">
                            <img
                                id="foto-preview"
                                src={
                                    form.data.foto_perfil instanceof File
                                        ? URL.createObjectURL(
                                              form.data.foto_perfil,
                                          )
                                        : `${fields.foto_perfil || '/images/default-avatar.png'}?t=${Date.now()}`
                                }
                                alt="Foto de perfil"
                                className="h-40 w-40 rounded-full border-4 border-gray-200 object-cover shadow-md transition-transform duration-300 hover:scale-105"
                            />
                            <label className="absolute -right-2 top-2 cursor-pointer rounded-full border border-white bg-blue-600 p-2 text-white shadow-lg transition-colors duration-200 hover:bg-blue-700">
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFotoChange}
                                    accept="image/*"
                                />
                                <FaEdit className="h-4 w-4" />
                            </label>
                        </div>

                        <div className="mt-8 w-full space-y-4">
                            <div className="rounded-lg bg-gray-100 p-3 shadow-inner">
                                <p className="text-center text-sm font-medium text-gray-500">
                                    Nivel Académico
                                </p>
                                <p className="text-center text-base font-semibold text-gray-800">
                                    {form.data.nivel_academico
                                        ? nivelesAcademicos.find(
                                              (n) =>
                                                  n.value ===
                                                  form.data.nivel_academico,
                                          )?.label
                                        : '—'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-100 p-3 shadow-inner">
                                <p className="text-center text-sm font-medium text-gray-500">
                                    Tipo de Usuario
                                </p>
                                <p className="text-center text-base font-semibold text-gray-800">
                                    Psicólogo/a
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* LADO DERECHO */}
                <section className="space-y-6 md:col-span-2">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="flex items-center gap-3 border-b">
                            <div className="h-8 w-6 bg-gray-300 shadow-inner" />
                            <h3 className="py-3 text-lg font-semibold text-gray-800">
                                Datos Personales
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            {/* Nombre y apellidos */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.nombre}
                                        onChange={(e) =>
                                            form.setData(
                                                'nombre',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {form.errors.nombre && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.nombre}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Apellido Paterno *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.apellido_paterno}
                                        onChange={(e) =>
                                            form.setData(
                                                'apellido_paterno',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {form.errors.apellido_paterno && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.apellido_paterno}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Apellido Materno *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.apellido_materno}
                                        onChange={(e) =>
                                            form.setData(
                                                'apellido_materno',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {form.errors.apellido_materno && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.apellido_materno}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Nivel académico */}
                            <div className="grid gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Nivel Académico *
                                    </label>
                                    <select
                                        value={form.data.nivel_academico}
                                        onChange={(e) =>
                                            form.setData(
                                                'nivel_academico',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">
                                            Seleccionar nivel académico
                                        </option>
                                        {nivelesAcademicos.map((nivel) => (
                                            <option
                                                key={nivel.value}
                                                value={nivel.value}
                                            >
                                                {nivel.label}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.nivel_academico && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.nivel_academico}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Emails */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Email Personal *
                                    </label>
                                    <input
                                        type="email"
                                        value={form.data.email}
                                        onChange={(e) =>
                                            form.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {form.errors.email && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Email Institucional
                                    </label>
                                    <input
                                        type="email"
                                        value={
                                            form.data.email_institucional || ''
                                        }
                                        onChange={(e) =>
                                            form.setData(
                                                'email_institucional',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {form.errors.email_institucional && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.email_institucional}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Password */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Nueva contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={form.data.password}
                                        onChange={(e) =>
                                            form.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Dejar en blanco para no cambiar"
                                    />
                                    {form.errors.password && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Confirmar contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={form.data.password_confirmation}
                                        onChange={(e) =>
                                            form.setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {form.errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                                >
                                    {form.processing
                                        ? 'Guardando...'
                                        : 'Guardar cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </PsychologistLayout>
    );
}
