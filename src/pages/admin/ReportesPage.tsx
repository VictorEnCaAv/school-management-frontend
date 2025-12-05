import { Layout } from '../../components/layout/Layout';

const ReportesPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Reportes y Estadísticas
          </h1>
          <p className="text-gray-600">
            Consulta reportes globales de promedios y desempeño
          </p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">
                  Promedio General
                </p>
                <p className="text-3xl font-bold text-blue-900">78.5</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="card bg-green-50 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">
                  Total Alumnos
                </p>
                <p className="text-3xl font-bold text-green-900">324</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="card bg-purple-50 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">
                  Total Materias
                </p>
                <p className="text-3xl font-bold text-purple-900">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="card bg-orange-50 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium mb-1">
                  Aprobación
                </p>
                <p className="text-3xl font-bold text-orange-900">85%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Generar Reporte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Reporte
              </label>
              <select className="input-field">
                <option value="general">Reporte General</option>
                <option value="alumno">Por Alumno</option>
                <option value="materia">Por Materia</option>
                <option value="grupo">Por Grupo</option>
              </select>
            </div>

            <div>
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

            <div className="flex items-end">
              <button className="btn-primary w-full">
                Generar Reporte
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de promedios por materia */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Promedios por Materia
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Materia
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Total Alumnos
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Promedio
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Aprobados
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Reprobados
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    % Aprobación
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">
                    Matemáticas
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">45</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-gray-800">78.5</span>
                  </td>
                  <td className="py-3 px-4 text-center text-green-600">38</td>
                  <td className="py-3 px-4 text-center text-red-600">7</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      84%
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">
                    Español
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">45</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-gray-800">82.3</span>
                  </td>
                  <td className="py-3 px-4 text-center text-green-600">41</td>
                  <td className="py-3 px-4 text-center text-red-600">4</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      91%
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">
                    Ciencias
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">45</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-gray-800">75.8</span>
                  </td>
                  <td className="py-3 px-4 text-center text-green-600">36</td>
                  <td className="py-3 px-4 text-center text-red-600">9</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      80%
                    </span>
                  </td>
                </tr>

                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">
                    Historia
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">45</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-gray-800">80.1</span>
                  </td>
                  <td className="py-3 px-4 text-center text-green-600">39</td>
                  <td className="py-3 px-4 text-center text-red-600">6</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      87%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportesPage;