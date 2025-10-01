import "./ProductParameterList.css";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import MeasurementTypeSelectInput from "../../selectInput/MeasurementTypeSelectInput";
import MeasurementUnitSelectInput from "../../selectInput/MeasurementUnitSelectInput";
import TextInput from "../../textInput/TextInput";
import SubmitButton from "../../../buttons/submitButton/SubmitButton";

/* параметр считается ПОЛНОСТЬЮ заполненным, когда есть тип, единица и значение */
const isParamComplete = (p) =>
  !!(p?.measurementType && p?.measurementUnit && p?.value !== "" && p?.value != null);

const ProductParameterList = ({ parameters = [], setParameters }) => {
  const [params, setParams] = useState([]);
  const userChanged = useRef(false);

  /* внешний → внутренний стейт */
  useEffect(() => {
    if (userChanged.current) return;

    const mapped = parameters.map((p) => {
      const mt = p.measurement_type;
      const mu = p.measurement_unit;
      return {
        id: p.id ?? null,
        measurementType: mt
          ? {
              value: typeof mt === "object" ? mt.id : mt,
              label: typeof mt === "object" ? mt.name : p.measurement_type_name ?? "",
            }
          : null,
        measurementUnit: mu
          ? {
              value: typeof mu === "object" ? mu.id : mu,
              label: typeof mu === "object" ? mu.name : p.measurement_unit_name ?? "",
            }
          : null,
        value: p.value ?? "",
      };
    });

    if (JSON.stringify(mapped) !== JSON.stringify(params)) setParams(mapped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  /* внутренний → внешний стейт */
  useEffect(() => {
    if (!userChanged.current) return;

    const payload = params.map(({ id, measurementType, measurementUnit, value }) => ({
      id,
      measurement_type: measurementType ? { id: measurementType.value, name: measurementType.label } : null,
      measurement_unit: measurementUnit ? { id: measurementUnit.value, name: measurementUnit.label } : null,
      value,
    }));

    setParameters(payload);
    userChanged.current = false;
  }, [params, setParameters]);

  const handleParamChange = (index, field, newVal) => {
    userChanged.current = true;
    setParams((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: newVal };
      return next;
    });
  };

  const addParam = () => {
    const prevParam = params[params.length - 1];
    if (prevParam && !isParamComplete(prevParam)) {
      toast.warn("Пожалуйста, заполните предыдущий параметр перед добавлением нового.");
      return;
    }
    userChanged.current = true;
    setParams((prev) => [...prev, { id: null, measurementType: null, measurementUnit: null, value: "" }]);
  };

  const removeParam = (index) => {
    userChanged.current = true;
    setParams((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="ppl-param-list">
      {params.map((p, idx) => (
        <div key={p.id ?? idx} className="ppl-param-item">
          <MeasurementTypeSelectInput
            value={p.measurementType}
            setValue={(v) => handleParamChange(idx, "measurementType", v)}
            showErrorText={false}
            placeholder="Тип измерения"
            isRequired
          />
          <TextInput
            value={p.value}
            setValue={(v) => handleParamChange(idx, "value", v)}
            name="Значение"
            placeholder="Значение"
            showErrorText={false}
            isRequired
          />
          <MeasurementUnitSelectInput
            name="Ед. измерения"
            value={p.measurementUnit}
            setValue={(v) => handleParamChange(idx, "measurementUnit", v)}
            showErrorText={false}
            placeholder="Ед. измерения"
            isRequired
          />
          <button type="button" className="ppl-param-remove-btn" onClick={() => removeParam(idx)}>
            Удалить
          </button>
        </div>
      ))}

      <SubmitButton onClick={addParam} title="Добавить параметр" />
    </div>
  );
};

ProductParameterList.propTypes = {
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      measurement_type: PropTypes.oneOfType([
        PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }),
        PropTypes.number,
      ]),
      measurement_type_name: PropTypes.string,
      measurement_unit: PropTypes.oneOfType([
        PropTypes.shape({ id: PropTypes.number, name: PropTypes.string }),
        PropTypes.number,
      ]),
      measurement_unit_name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ),
  setParameters: PropTypes.func.isRequired,
};

export default ProductParameterList;
