import { Layout } from '../../components/layout/Layout';

const CalificacionesPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestión de Calificaciones
            </h1>
            <p className="text-gray-600">
              Registra y edita las calificaciones de tus alumnos
            </p>
          </div>
          <button className="btn-primary">
            + Nueva Calificación
          </button>
        </div>

        {/* Filtros */}
        <div className="card">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materia
              </label>
              <select className="input-field">
                <option value="">Todas las materias</option>
                <option value="1">Matemáticas</option>
                <option value="2">Español</option>
                <option value="3">Ciencias</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grupo
              </label>
              <select className="input-field">
                <option value="">Todos los grupos</option>
                <option value="1A">1° A</option>
                <option value="1B">1° B</option>
                <option value="2A">2° A</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar alumno
              </label>
              <input
                type="text"
                placeholder="Nombre o matrícula..."
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Tabla de calificaciones */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Alumno
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Matrícula
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Materia
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Grupo
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Nota
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Ejemplo de fila */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">Juan Pérez García</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">2024001</td>
                  <td className="py-3 px-4 text-gray-600">Matemáticas</td>
                  <td className="py-3 px-4 text-gray-600">1° A</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                      85.5
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      Aprobado
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Editar
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 font-medium text-sm">
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Otra fila de ejemplo */}
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">María López Hernández</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">2024002</td>
                  <td className="py-3 px-4 text-gray-600">Matemáticas</td>
                  <td className="py-3 px-4 text-gray-600">1° A</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                      55.0
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      Reprobado
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Editar
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 font-medium text-sm">
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Mostrando 1-10 de 45 calificaciones
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalificacionesPage;