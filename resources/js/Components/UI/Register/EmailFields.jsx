import { FaEnvelope, FaUniversity } from 'react-icons/fa';
import { TextField } from './FormFields';

export default function EmailFields({ data, setData, errors }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TextField
                id="email"
                label="Email Personal"
                icon={FaEnvelope}
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={errors.email}
                placeholder="tu@email.com"
                required
            />

            <TextField
                id="email_institucional"
                label="Email Institucional"
                icon={FaUniversity}
                type="email"
                value={data.email_institucional}
                onChange={(e) => setData('email_institucional', e.target.value)}
                error={errors.email_institucional}
                placeholder="tu@institucion.edu.mx"
                required
            />
        </div>
    );
}
