import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Card, Row, Col, Button, Tag, Space, Modal, message,
    Statistic, Tooltip, Popconfirm, Input, DatePicker, Select
} from 'antd';
import {
    DeleteOutlined, RestOutlined, EyeOutlined,
    ReloadOutlined, FilterOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { controlEscolarService } from '../../services/controlEscolarService';
import type { Calificacion, CalificacionesFiltros } from '../../services';
import LoadingSpinner from '../common/LoadingSpinner';
import FiltrosCalificaciones from './FiltrosCalificaciones';
import EliminarCalificacionModal from './EliminarCalificacionModal';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const CalificacionesControlEscolar: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filters, setFilters] = useState<CalificacionesFiltros>({
        periodo: '',
        incluirEliminadas: false,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCalificacion, setSelectedCalificacion] = useState<Calificacion | null>(null);
    const [estadisticas, setEstadisticas] = useState({
        total: 0,
        activas: 0,
        eliminadas: 0,
        promedio: 0,
    });

    // Cargar calificaciones
    const fetchCalificaciones = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params: CalificacionesFiltros = {
                pagina: page,
                limite: pagination.pageSize,
                ...filters,
            };

            const response = await controlEscolarService.obtenerCalificaciones(params);
            
            if (response.success) {
                setCalificaciones(response.data);
                
                if (response.paginacion) {
                    setPagination({
                        ...pagination,
                        current: response.paginacion.pagina,
                        total: response.paginacion.total,
                    });
                }

                // Calcular estadísticas simples
                const activas = response.data.filter(c => !c.deleted_at).length;
                const eliminadas = response.data.filter(c => c.deleted_at).length;
                const notasActivas = response.data.filter(c => !c.deleted_at).map(c => c.nota);
                
                // CORRECCIÓN: Asegurar que promedio sea number
                let promedioCalculado = 0;
                if (notasActivas.length > 0) {
                    const suma = notasActivas.reduce((a, b) => a + b, 0);
                    promedioCalculado = parseFloat((suma / notasActivas.length).toFixed(2));
                }

                setEstadisticas({
                    total: response.data.length,
                    activas,
                    eliminadas,
                    promedio: promedioCalculado, // Aquí ya es number
                });
            }
        } catch (error) {
            console.error('Error al cargar calificaciones:', error);
            message.error('Error al cargar las calificaciones');
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.pageSize]);

    // Cargar datos iniciales
    useEffect(() => {
        fetchCalificaciones();
    }, [fetchCalificaciones]);

    // Manejar cambio de página
    const handleTableChange = (newPagination: any) => {
        fetchCalificaciones(newPagination.current);
    };

    // Manejar eliminación
    const handleDelete = async (id: number, motivo?: string) => {
        try {
            const response = await controlEscolarService.eliminarCalificacion(id, motivo);
            if (response.success) {
                message.success(response.message);
                fetchCalificaciones(pagination.current);
                setModalVisible(false);
            } else {
                message.error(response.message || 'Error al eliminar calificación');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            message.error('Error al eliminar calificación');
        }
    };

    // Manejar restauración
    const handleRestore = async (id: number) => {
        try {
            const response = await controlEscolarService.restaurarCalificacion(id);
            if (response.success) {
                message.success(response.message);
                fetchCalificaciones(pagination.current);
            } else {
                message.error(response.message || 'Error al restaurar calificación');
            }
        } catch (error) {
            console.error('Error al restaurar:', error);
            message.error('Error al restaurar calificación');
        }
    };

    // Confirmar eliminación múltiple
    const confirmBulkDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Selecciona al menos una calificación');
            return;
        }

        confirm({
            title: `¿Eliminar ${selectedRowKeys.length} calificación(es)?`,
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción marca las calificaciones como eliminadas (soft delete). Pueden restaurarse después.',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    for (const id of selectedRowKeys) {
                        await controlEscolarService.eliminarCalificacion(
                            Number(id), 
                            'Eliminación masiva'
                        );
                    }
                    message.success(`${selectedRowKeys.length} calificaciones eliminadas`);
                    setSelectedRowKeys([]);
                    fetchCalificaciones(pagination.current);
                } catch (error) {
                    message.error('Error en la eliminación masiva');
                }
            },
        });
    };

    // Columnas de la tabla
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: (a: Calificacion, b: Calificacion) => a.id - b.id,
        },
        {
            title: 'Alumno',
            key: 'alumno',
            render: (record: Calificacion) => (
                <div>
                    <div><strong>{record.alumno?.nombre} {record.alumno?.apellidos}</strong></div>
                    <small style={{ color: '#666' }}>Matrícula: {record.alumno?.matricula}</small>
                </div>
            ),
        },
        {
            title: 'Materia',
            key: 'materia',
            render: (record: Calificacion) => (
                <div>
                    <div>{record.asignacion?.materia?.nombre}</div>
                    <small style={{ color: '#666' }}>Código: {record.asignacion?.materia?.codigo}</small>
                </div>
            ),
        },
        {
            title: 'Maestro',
            key: 'maestro',
            render: (record: Calificacion) => (
                <div>
                    <div>{record.asignacion?.maestro?.nombre} {record.asignacion?.maestro?.apellidos}</div>
                    <small style={{ color: '#666' }}>{record.asignacion?.maestro?.email}</small>
                </div>
            ),
        },
        {
            title: 'Nota',
            dataIndex: 'nota',
            key: 'nota',
            width: 100,
            render: (nota: number) => (
                <Tag color={nota >= 70 ? 'green' : nota >= 60 ? 'orange' : 'red'}>
                    {nota.toFixed(1)}
                </Tag>
            ),
            sorter: (a: Calificacion, b: Calificacion) => a.nota - b.nota,
        },
        {
            title: 'Periodo',
            dataIndex: 'periodo',
            key: 'periodo',
            width: 120,
        },
        {
            title: 'Fecha',
            key: 'fecha',
            render: (record: Calificacion) => 
                record.fecha_evaluacion 
                    ? moment(record.fecha_evaluacion).format('DD/MM/YYYY')
                    : 'N/A',
            width: 120,
        },
        {
            title: 'Estado',
            key: 'estado',
            width: 120,
            render: (record: Calificacion) => (
                record.deleted_at ? (
                    <Tag color="red" icon={<DeleteOutlined />}>
                        Eliminada
                    </Tag>
                ) : (
                    <Tag color="green">Activa</Tag>
                )
            ),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 180,
            render: (record: Calificacion) => (
                <Space size="small">
                    <Tooltip title="Ver detalles">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => setSelectedCalificacion(record)}
                        />
                    </Tooltip>

                    {record.deleted_at ? (
                        <Popconfirm
                            title="¿Restaurar esta calificación?"
                            description="La calificación volverá a estar activa en el sistema."
                            onConfirm={() => handleRestore(record.id)}
                            okText="Sí, restaurar"
                            cancelText="Cancelar"
                        >
                            <Tooltip title="Restaurar">
                                <Button
                                    type="primary"
                                    ghost
                                    icon={<RestOutlined />}
                                />
                            </Tooltip>
                        </Popconfirm>
                    ) : (
                        <Tooltip title="Eliminar">
                            <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    setSelectedCalificacion(record);
                                    setModalVisible(true);
                                }}
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    // Row selection configuration
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        getCheckboxProps: (record: Calificacion) => ({
            disabled: !!record.deleted_at, // No seleccionar eliminadas
        }),
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card title="Gestión de Calificaciones - Control Escolar" style={{ marginBottom: 24 }}>
                {/* Estadísticas */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Total Calificaciones"
                                value={estadisticas.total}
                                prefix={<ReloadOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Activas"
                                value={estadisticas.activas}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Eliminadas"
                                value={estadisticas.eliminadas}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card size="small">
                            <Statistic
                                title="Promedio General"
                                value={estadisticas.promedio}
                                suffix="/100"
                                precision={2}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Filtros */}
                <FiltrosCalificaciones
                    filters={filters}
                    onFilterChange={(newFilters) => {
                        setFilters(newFilters);
                        setPagination({ ...pagination, current: 1 });
                    }}
                />

                {/* Acciones masivas */}
                {selectedRowKeys.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <Space>
                            <span>
                                Seleccionadas: <strong>{selectedRowKeys.length}</strong> calificaciones
                            </span>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={confirmBulkDelete}
                            >
                                Eliminar seleccionadas
                            </Button>
                            <Button onClick={() => setSelectedRowKeys([])}>
                                Limpiar selección
                            </Button>
                        </Space>
                    </div>
                )}

                {/* Tabla de calificaciones */}
                <Table
                    columns={columns}
                    dataSource={calificaciones}
                    rowKey="id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    rowSelection={rowSelection}
                    scroll={{ x: 1300 }}
                    locale={{
                        emptyText: 'No hay calificaciones para mostrar',
                    }}
                />
            </Card>

            {/* Modal para eliminar calificación individual */}
            {selectedCalificacion && (
                <EliminarCalificacionModal
                    visible={modalVisible}
                    calificacion={selectedCalificacion}
                    onCancel={() => setModalVisible(false)}
                    onConfirm={handleDelete}
                />
            )}

            {/* Modal para ver detalles */}
            {selectedCalificacion && !modalVisible && (
                <Modal
                    title="Detalles de Calificación"
                    open={!!selectedCalificacion}
                    onCancel={() => setSelectedCalificacion(null)}
                    footer={[
                        <Button key="close" onClick={() => setSelectedCalificacion(null)}>
                            Cerrar
                        </Button>,
                    ]}
                    width={700}
                >
                    <Card bordered={false}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <h4>Información del Alumno</h4>
                                <p><strong>Nombre:</strong> {selectedCalificacion.alumno?.nombre} {selectedCalificacion.alumno?.apellidos}</p>
                                <p><strong>Matrícula:</strong> {selectedCalificacion.alumno?.matricula}</p>
                                <p><strong>Grupo:</strong> {selectedCalificacion.asignacion?.grupo?.nombre}</p>
                            </Col>
                            <Col span={12}>
                                <h4>Información Académica</h4>
                                <p><strong>Materia:</strong> {selectedCalificacion.asignacion?.materia?.nombre}</p>
                                <p><strong>Código:</strong> {selectedCalificacion.asignacion?.materia?.codigo}</p>
                                <p><strong>Maestro:</strong> {selectedCalificacion.asignacion?.maestro?.nombre}</p>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ marginTop: 16 }}>
                            <Col span={8}>
                                <p><strong>Nota:</strong> <Tag color="blue">{selectedCalificacion.nota}</Tag></p>
                            </Col>
                            <Col span={8}>
                                <p><strong>Periodo:</strong> {selectedCalificacion.periodo}</p>
                            </Col>
                            <Col span={8}>
                                <p><strong>Fecha:</strong> {selectedCalificacion.fecha_evaluacion ? moment(selectedCalificacion.fecha_evaluacion).format('DD/MM/YYYY') : 'N/A'}</p>
                            </Col>
                        </Row>
                        {selectedCalificacion.observaciones && (
                            <div style={{ marginTop: 16 }}>
                                <h4>Observaciones</h4>
                                <p>{selectedCalificacion.observaciones}</p>
                            </div>
                        )}
                        {selectedCalificacion.deleted_at && (
                            <div style={{ marginTop: 16, padding: 16, background: '#fff2f0', borderRadius: 6 }}>
                                <h4 style={{ color: '#cf1322' }}>Información de Eliminación</h4>
                                <p><strong>Eliminada por:</strong> {selectedCalificacion.eliminadoPor?.nombre || 'N/A'}</p>
                                <p><strong>Fecha eliminación:</strong> {moment(selectedCalificacion.deleted_at).format('DD/MM/YYYY HH:mm')}</p>
                                <p><strong>Motivo:</strong> {selectedCalificacion.delete_reason || 'Sin motivo especificado'}</p>
                            </div>
                        )}
                    </Card>
                </Modal>
            )}
        </div>
    );
};

export default CalificacionesControlEscolar;