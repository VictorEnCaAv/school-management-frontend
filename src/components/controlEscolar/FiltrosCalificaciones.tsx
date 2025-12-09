// src/components/controlEscolar/FiltrosCalificaciones.tsx
import React, { useState } from 'react';
import { Row, Col, Input, Select, Button, DatePicker, Space, Tag } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { CalificacionesFiltros } from '../../services';
export interface CalificacionesFiltros {
  pagina?: number;
  limite?: number;
  asignacion_id?: number;
  alumno_id?: number;
  periodo?: string;
  maestro_id?: number;
  materia_id?: number;
  grupo_id?: number;
  incluirEliminadas?: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
  [key: string]: any; // Para permitir propiedades adicionales
}
const { Option } = Select;
const { RangePicker } = DatePicker;

interface FiltrosCalificacionesProps {
  filters: CalificacionesFiltros;
  onFilterChange: (filters: CalificacionesFiltros) => void;
}

const FiltrosCalificaciones: React.FC<FiltrosCalificacionesProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  const [localFilters, setLocalFilters] = useState<CalificacionesFiltros>(filters);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: CalificacionesFiltros = {
      periodo: '',
      incluirEliminadas: false,
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const handleDateChange = (dates: any) => {
    setLocalFilters({
      ...localFilters,
      fecha_inicio: dates ? dates[0].format('YYYY-MM-DD') : '',
      fecha_fin: dates ? dates[1].format('YYYY-MM-DD') : '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== '' && value !== false && value !== undefined && value !== null
  ).length;

  return (
    <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 8 }}>
      <Row gutter={16} align="middle">
        <Col span={5}>
          <Input
            placeholder="Buscar alumno..."
            prefix={<SearchOutlined />}
            value={localFilters.alumno_id?.toString() || ''}
            onChange={(e) => setLocalFilters({ 
              ...localFilters, 
              alumno_id: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            allowClear
          />
        </Col>
        
        <Col span={4}>
          <Input
            placeholder="Periodo"
            value={localFilters.periodo || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, periodo: e.target.value })}
            allowClear
          />
        </Col>

        <Col span={5}>
          <RangePicker
            style={{ width: '100%' }}
            onChange={handleDateChange}
            value={[
              localFilters.fecha_inicio ? moment(localFilters.fecha_inicio) : null,
              localFilters.fecha_fin ? moment(localFilters.fecha_fin) : null,
            ]}
            placeholder={['Fecha inicio', 'Fecha fin']}
          />
        </Col>

        <Col span={3}>
          <Select
            style={{ width: '100%' }}
            value={localFilters.incluirEliminadas}
            onChange={(value: boolean) => setLocalFilters({ ...localFilters, incluirEliminadas: value })}
          >
            <Option value={false}>Solo activas</Option>
            <Option value={true}>Incluir eliminadas</Option>
          </Select>
        </Col>

        <Col span={3}>
          <Space>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={handleApplyFilters}
            >
              Filtrar
            </Button>
            <Button
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
            >
              Limpiar
            </Button>
          </Space>
        </Col>
      </Row>

      {activeFiltersCount > 0 && (
        <div style={{ marginTop: 12 }}>
          <span style={{ marginRight: 8 }}>Filtros activos:</span>
          {filters.alumno_id && (
            <Tag 
              closable 
              onClose={() => {
                const newFilters = { ...localFilters };
                delete newFilters.alumno_id;
                setLocalFilters(newFilters);
              }}
            >
              Alumno ID: {filters.alumno_id}
            </Tag>
          )}
          {filters.periodo && (
            <Tag 
              closable 
              onClose={() => setLocalFilters({...localFilters, periodo: ''})}
            >
              Periodo: {filters.periodo}
            </Tag>
          )}
          {filters.incluirEliminadas && (
            <Tag 
              closable 
              onClose={() => setLocalFilters({...localFilters, incluirEliminadas: false})}
            >
              Incluye eliminadas
            </Tag>
          )}
          <Tag color="blue">{activeFiltersCount} filtro(s)</Tag>
        </div>
      )}
    </div>
  );
};

export default FiltrosCalificaciones;