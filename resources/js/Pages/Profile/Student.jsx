import StudentLayout from '@/Layouts/UI/StudentLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';

export default function EditStudent({ user, fields = {}, status }) {
    const { props } = usePage();

    const form = useForm({
        numero_control: fields.numero_control || '',
        nombre: fields.nombre || '',
        apellido_paterno: fields.apellido_paterno || '',
        apellido_materno: fields.apellido_materno || '',
        semestre: fields.semestre || '',
        group_id: fields.group_id || '',
        email: fields.email || '',
        email_institucional: fields.email_institucional || '',
        password: '',
        password_confirmation: '',
        foto_perfil: null,
    });

    // Debug: mostrar datos iniciales
    useEffect(() => {
        console.log('Initial fields received:', fields);
        console.log('Initial user data:', user);
        console.log('Props:', props);
    }, []);

    // Debug: mostrar datos del formulario cuando cambien
    useEffect(() => {
        console.log('Form data:', form.data);
    }, [form.data]);

    function handleSubmit(e) {
        e.preventDefault();

        console.log('Submitting form with data:', form.data);

        // Validar datos antes de enviar
        if (!form.data.numero_control.trim()) {
            console.error('Número de control es requerido');
            return;
        }
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
        if (!form.data.semestre) {
            console.error('Semestre es requerido');
            return;
        }
        if (!form.data.group_id) {
            console.error('Grupo es requerido');
            return;
        }

        const hasFile = form.data.foto_perfil instanceof File;

        console.log('Has file:', hasFile);
        console.log('Data being sent:', form.data);

        if (hasFile) {
            // Cuando hay archivo, usar POST con method spoofing
            form.post(route('profile.student.update'), {
                data: {
                    ...form.data,
                    _method: 'PATCH',
                },
                forceFormData: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    console.log('Success response:', page);

                    // Resetear campos sensibles
                    form.reset('password', 'password_confirmation');

                    // Resetear la foto después del envío exitoso
                    form.setData('foto_perfil', null);
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    Object.keys(errors).forEach((field) => {
                        console.error(`Error in ${field}:`, errors[field]);
                    });
                },
                onBefore: () => {
                    console.log('About to submit form with file');
                    console.log('Current form data before submit:', form.data);
                },
            });
        } else {
            // Cuando no hay archivo, usar PATCH directamente
            form.patch(route('profile.student.update'), {
                preserveScroll: true,
                onSuccess: (page) => {
                    console.log('Success response:', page);

                    // Solo resetear campos sensibles
                    form.reset('password', 'password_confirmation');
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    Object.keys(errors).forEach((field) => {
                        console.error(`Error in ${field}:`, errors[field]);
                    });
                },
                onBefore: () => {
                    console.log('About to submit form without file');
                    console.log('Current form data before submit:', form.data);
                },
            });
        }
    }

    function handleFotoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        console.log('File selected:', file);
        form.setData('foto_perfil', file);
    }

    // Función para manejar cambios en semestre con conversión correcta
    function handleSemestreChange(e) {
        const value = e.target.value;
        console.log('Semestre changed to:', value, typeof value);
        form.setData('semestre', value === '' ? '' : parseInt(value, 10));
    }

    // Función para manejar cambios en group_id con conversión correcta
    function handleGroupChange(e) {
        const value = e.target.value;
        console.log('Group changed to:', value, typeof value);
        form.setData('group_id', value === '' ? '' : parseInt(value, 10));
    }

    const TutorNombre = fields.tutor_asignado
        ? `${fields.tutor_asignado.nombre ?? ''} ${fields.tutor_asignado.apellido_paterno ?? ''}`.trim()
        : 'Ninguno por el momento';

    const grupos = props?.grupos || [];
    const grupoNombre = form.data.group_id
        ? grupos.find((g) => g.id === parseInt(form.data.group_id))?.nombre ||
          '—'
        : '—';

    return (
        <StudentLayout user={user}>
            {status && (
                <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
                    {status}
                </div>
            )}

            {/* Mostrar errores generales */}
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
                                    Matrícula
                                </p>
                                <p className="text-center text-base font-semibold text-gray-800">
                                    {form.data.numero_control || '—'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-100 p-3 shadow-inner">
                                <p className="text-center text-sm font-medium text-gray-500">
                                    Semestre
                                </p>
                                <p className="text-center text-base font-semibold text-gray-800">
                                    {form.data.semestre
                                        ? `${form.data.semestre}°`
                                        : '—'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-100 p-3 shadow-inner">
                                <p className="text-center text-sm font-medium text-gray-500">
                                    Grupo
                                </p>
                                <p className="text-center text-base font-semibold text-gray-800">
                                    {grupoNombre}
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
                                Datos Generales
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            {/* Matrícula */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Matrícula *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.numero_control}
                                        onChange={(e) =>
                                            form.setData(
                                                'numero_control',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {form.errors.numero_control && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.numero_control}
                                        </p>
                                    )}
                                </div>
                            </div>

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

                            {/* Semestre / Grupo */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Semestre *
                                    </label>
                                    <select
                                        value={form.data.semestre}
                                        onChange={handleSemestreChange}
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">
                                            Seleccionar semestre
                                        </option>
                                        {Array.from(
                                            { length: 12 },
                                            (_, i) => i + 1,
                                        ).map((s) => (
                                            <option key={s} value={s}>
                                                {s}°
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.semestre && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.semestre}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Grupo *
                                    </label>
                                    <select
                                        value={form.data.group_id}
                                        onChange={handleGroupChange}
                                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">
                                            Seleccionar grupo
                                        </option>
                                        {grupos.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.group_id && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.group_id}
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

                    {/* Tutor asignado */}
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="flex items-center gap-3 border-b">
                            <div className="h-8 w-6 bg-gray-300 shadow-inner" />
                            <h3 className="py-3 text-lg font-semibold text-gray-800">
                                Datos del Tutor
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid items-center md:grid-cols-3">
                                <p className="font-medium text-gray-700">
                                    Nombre:
                                </p>
                                <p className="text-gray-800 md:col-span-2">
                                    {TutorNombre}
                                </p>
                            </div>
                            <div className="mt-4 h-px w-full bg-gray-300" />
                        </div>
                    </div>
                </section>
            </div>
        </StudentLayout>
    );
}
