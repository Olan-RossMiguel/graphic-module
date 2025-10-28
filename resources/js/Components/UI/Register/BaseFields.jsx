import { FaUser, FaVenusMars } from 'react-icons/fa';
import { SelectField, TextField } from './FormFields';

export default function BaseFields({ data, setData, errors }) {
    const generoOptions = [
        { value: 'masculino', label: 'Masculino' },
        { value: 'femenino', label: 'Femenino' },
    ];

    return (
        <>
            {/* Nombres */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <TextField
                    id="nombre"
                    label="Nombre(s)"
                    icon={FaUser}
                    value={data.nombre}
                    onChange={(e) => setData('nombre', e.target.value)}
                    error={errors.nombre}
                    placeholder="Tu nombre"
                    required
                />

                <TextField
                    id="apellido_paterno"
                    label="Apellido Paterno"
                    icon={FaUser}
                    value={data.apellido_paterno}
                    onChange={(e) =>
                        setData('apellido_paterno', e.target.value)
                    }
                    error={errors.apellido_paterno}
                    placeholder="Apellido paterno"
                    required
                />

                <TextField
                    id="apellido_materno"
                    label="Apellido Materno"
                    icon={FaUser}
                    value={data.apellido_materno}
                    onChange={(e) =>
                        setData('apellido_materno', e.target.value)
                    }
                    error={errors.apellido_materno}
                    placeholder="Apellido materno"
                    required
                />
            </div>

            {/* Género */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <SelectField
                    id="genero"
                    label="Género"
                    icon={FaVenusMars}
                    value={data.genero}
                    options={generoOptions}
                    onChange={(e) => setData('genero', e.target.value)}
                    error={errors.genero}
                    required
                />
            </div>
        </>
    );
}
