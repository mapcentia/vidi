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
                polyline: __('Search with a line'),
                polygon: __('Search with an area'),
                rectangle: __('Search with a rectangle'),
                circle: __('Search with a circle'),
                marker: __('Search with a point')
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
                    text: __('Click on a feature to remove')
                }
            }
        }
    }
};