/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

module.exports = {
    draw: {
        toolbar: {
            actions: {
                title: __('Cancel drawing'),
                text: __('Cancel')
            },
            undo: {
                title: __('Delete last point drawn'),
                text: __('Delete last point')
            },
            finish: {
                title: __('Finish drawing.'),
                text: __('Finish')
            },
            buttons: {
                polyline: __('Draw a line'),
                polygon: __('Draw an area'),
                rectangle: __('Draw a rectangle'),
                circle: __('Draw a circle'),
                marker: __('Draw a marker')
            }
        },
        handlers: {
            circle: {
                tooltip: {
                    start: __('Click and drag to draw circle.')
                },
                radius: __('Radius')
            },
            marker: {
                tooltip: {
                    start: __('Click map to place marker.')
                }
            },
            circlemarker: {
                tooltip: {
                    start: 'Click map to place circle marker.'
                }
            },
            polygon: {
                tooltip: {
                    start: __('Click to start drawing shape.'),
                    cont: __('Click to continue drawing shape.'),
                    end: __('Click first point to close this shape.')
                }
            },
            polyline: {
                error: __('<strong>Error:</strong> shape edges cannot cross!'),
                tooltip: {
                    start: __('Click to start drawing line.'),
                    cont: __('Click to continue drawing line.'),
                    end: __('Click last point to finish line.')
                }
            },
            rectangle: {
                tooltip: {
                    start: __('Click and drag to draw rectangle.')
                }
            },
            simpleshape: {
                tooltip: {
                    end: __('Release mouse to finish drawing.')
                }
            }
        }
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: __('Save changes.'),
                    text: __('Save')
                },
                cancel: {
                    title: __('Cancel editing, discards all changes.'),
                    text: __('Cancel')
                },
                finish: {
                    title: __('Cancel editing, discards all changes.'),
                    text: __('Cancel')
                },
                clearAll: {
                    title: __('Clear all drawings.'),
                    text: __('Clear all')
                }
            },
            buttons: {
                edit: __("Edit drawings."),
                editDisabled: __('No drawings to edit.'),
                remove: __('Delete drawings.'),
                removeDisabled: __('No drawings to delete.')
            }
        },
        handlers: {
            edit: {
                tooltip: {
                    text: __('Drag handles, or marker to edit drawing.'),
                    subtext: __('Click cancel to undo changes.')
                }
            },
            remove: {
                tooltip: {
                    text: __('Click on a drawing to remove')
                }
            }
        }
    }
};