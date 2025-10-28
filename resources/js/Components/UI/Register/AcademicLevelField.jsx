import { FaGraduationCap } from 'react-icons/fa';
import { SelectField } from './FormFields';

export default function AcademicLevelField({ data, setData, errors }) {
    const nivelOptions = [
        { value: 'licenciatura', label: 'Licenciatura' },
        { value: 'especialidad', label: 'Especialidad' },
        { value: 'maestria', label: 'Maestría' },
        { value: 'doctorado', label: 'Doctorado' },
    ];

    return (
        <SelectField
            id="nivel_academico"
            label="Nivel Académico"
            icon={FaGraduationCap}
            value={data.nivel_academico}
            options={nivelOptions}
            onChange={(e) => setData('nivel_academico', e.target.value)}
            error={errors.nivel_academico}
            required
        />
    );
}
