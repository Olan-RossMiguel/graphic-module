import { FaLock, FaShieldAlt } from 'react-icons/fa';
import { TextField } from './FormFields';

export default function PasswordFields({ data, setData, errors }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TextField
                id="password"
                label="Contraseña"
                icon={FaLock}
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                error={errors.password}
                placeholder="Mínimo 8 caracteres"
                required
            />

            <TextField
                id="password_confirmation"
                label="Confirmar Contraseña"
                icon={FaShieldAlt}
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                    setData('password_confirmation', e.target.value)
                }
                error={errors.password_confirmation}
                placeholder="Repite tu contraseña"
                required
            />
        </div>
    );
}
