"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var react_1 = require("react");
var utils_1 = require("@rjsf/utils");
/** The `TimeWidget` component uses the `BaseInputTemplate` changing the type to `time` and transforms
 * the value to undefined when it is falsy during the `onChange` handling.
 *
 * @param props - The `WidgetProps` for this component
 */
function TimeWidget(props) {
    var onChange = props.onChange, options = props.options, registry = props.registry;
    var BaseInputTemplate = (0, utils_1.getTemplate)("BaseInputTemplate", registry, options);
    var handleChange = (0, react_1.useCallback)(function (value) { return onChange(value || undefined); }, [onChange]);
    return <BaseInputTemplate type="time" {...props} onChange={handleChange}/>;
}
exports.default = TimeWidget;
