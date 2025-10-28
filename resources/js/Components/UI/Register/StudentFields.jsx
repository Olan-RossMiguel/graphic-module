import { FaBook, FaIdCard, FaUsers } from 'react-icons/fa';
import { SelectField, TextField } from './FormFields';

export default function StudentFields({ data, setData, errors, groups }) {
    const semestreOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
        (sem) => ({
            value: sem,
            label: `${sem}° Semestre`,
        }),
    );

    const groupOptions = groups.map((group) => ({
        value: group.id,
        label: group.nombre,
    }));

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <TextField
                id="numero_control"
                label="Matrícula"
                icon={FaIdCard}
                value={data.numero_control}
                onChange={(e) => setData('numero_control', e.target.value)}
                error={errors.numero_control}
                placeholder="Número de control"
                required
            />

            <SelectField
                id="semestre"
                label="Semestre"
                icon={FaBook}
                value={data.semestre}
                options={semestreOptions}
                onChange={(e) => setData('semestre', e.target.value)}
                error={errors.semestre}
                required
            />

            <SelectField
                id="group_id"
                label="Grupo"
                icon={FaUsers}
                value={data.group_id}
                options={groupOptions}
                onChange={(e) => setData('group_id', Number(e.target.value))}
                error={errors.group_id}
                required
            />
        </div>
    );
}
