"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var react_1 = require("react");
var utils_1 = require("@rjsf/utils");
function getValue(event, multiple) {
    if (multiple) {
        return Array.from(event.target.options)
            .slice()
            .filter(function (o) { return o.selected; })
            .map(function (o) { return o.value; });
    }
    return event.target.value;
}
/** The `SelectWidget` is a widget for rendering dropdowns.
 *  It is typically used with string properties constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
function SelectWidget(_a) {
    var schema = _a.schema, id = _a.id, options = _a.options, value = _a.value, required = _a.required, disabled = _a.disabled, readonly = _a.readonly, _b = _a.multiple, multiple = _b === void 0 ? false : _b, _c = _a.autofocus, autofocus = _c === void 0 ? false : _c, onChange = _a.onChange, onBlur = _a.onBlur, onFocus = _a.onFocus, placeholder = _a.placeholder;
    var enumOptions = options.enumOptions, enumDisabled = options.enumDisabled;
    var emptyValue = multiple ? [] : "";
    var handleFocus = (0, react_1.useCallback)(function (event) {
        var newValue = getValue(event, multiple);
        return onFocus(id, (0, utils_1.processSelectValue)(schema, newValue, options));
    }, [onFocus, id, schema, multiple, options]);
    var handleBlur = (0, react_1.useCallback)(function (event) {
        var newValue = getValue(event, multiple);
        return onBlur(id, (0, utils_1.processSelectValue)(schema, newValue, options));
    }, [onBlur, id, schema, multiple, options]);
    var handleChange = (0, react_1.useCallback)(function (event) {
        var newValue = getValue(event, multiple);
        return onChange((0, utils_1.processSelectValue)(schema, newValue, options));
    }, [onChange, schema, multiple, options]);
    return (<select id={id} name={id} multiple={multiple} className="form-select" value={typeof value === "undefined" ? emptyValue : value} required={required} disabled={disabled || readonly} autoFocus={autofocus} onBlur={handleBlur} onFocus={handleFocus} onChange={handleChange} aria-describedby={(0, utils_1.ariaDescribedByIds)(id)}>
            {!multiple && schema.default === undefined && (<option value="">{placeholder}</option>)}
            {Array.isArray(enumOptions) &&
            enumOptions.map(function (_a, i) {
                var value = _a.value, label = _a.label;
                var disabled = enumDisabled && enumDisabled.indexOf(value) != -1;
                return (<option key={i} value={value} disabled={disabled}>
                            {label}
                        </option>);
            })}
        </select>);
}
exports.default = SelectWidget;
